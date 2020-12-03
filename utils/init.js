const logger = require('./logger')
const vgsService = require('../services/vogsphere')
const intraService = require('../services/intra')

const User = require('../models/user')
const Sync = require('../models/sync')
const Evaluation = require('../models/evaluation')


const vgsIsAlive = async () => {
  try {
    await vgsService.ping()
  } catch(err) {
    if (err.response)
      logger.error(`${err.response.status} - data: ${JSON.stringify(err.response.data)}`)
    else 
      logger.error(err)
  }
}

const intraIsAlive = async () => {
  try {
    await intraService.req('GET', 'users/jgengo')
  } catch(err) {
    if (err.response)
      logger.error(`${err.response.status} - data: ${JSON.stringify(err.response.data)}}`)
    else
      logger.error(err)
  }
}

const populateUser = async () => {
  let users

  let sync = await Sync.findOne({model: "users"}).sort({_id: 1})

  if (!sync) { 
    console.log("[init] first time running ; gathering all the users")
    users = await intraService.reqAll('GET', 'users?filter[staff?]=false&filter[primary_campus_id]=13')
  } else {
    // TODO: intra user route doesnt return created_at or updated_at so this below doesn't work.
    let last = sync.created_at.toISOString()
    let now = new Date().toISOString()
    users = await intraService.reqAll(
      'GET', 
      `users?filter[staff?]=false&filter[primary_campus_id]=13&range[updated_at]=${last},${now.toString()}`
    )
  }

  console.log(`[init] found ${users.length} users`)

  // remove anonymized ones -- 
  // TODO: this should be added only for new sync, 
  //     : for update it should first check if the user exist and then update it or then skip it
  users = users.filter( user => !user.login.startsWith('3b3-')  )

  await Promise.all(
    users.map(async (user) => {
      const u = await User.findOne({intraId: user.id})
      
      if (!u) {
        newUser = new User({
          intraId: user.id,
          login: user.login,
        })
        try {
          await newUser.save()
        } catch(err) {
          console.log(`[init] error while creating user ${user.login} - ${err}`)
        }
      }
    })
  )

  console.log("[init] users pushed into the mongodb.")
  
  newSync = new Sync({model: "users"})
  newSync.save()
  
  console.log("[init] adding a Sync record")
}

const populateEvaluation = async () => {
  const users = await User.find()

  const intraIds = users.map ( (user) => { return user.intraId })
  
  let evaluations = await intraService.reqAll('GET', "scale_teams?filter[future]=true")

  evaluations = evaluations.filter( (eval) => intraIds.includes(eval.correcteds[0].id) && eval.corrector.login !== 'supervisor' )


  // await Promise.all(
  //   evaluations.map ( async (eval) => {
  //     const u = await User.findOne({intraId: eval.correcteds[0].id }) 
    
  //     corrected = eval.correcteds[0].login
  //     found = intraIds.includes(eval.correcteds[0].id)
  //     console.log(`[found: ${found}] login: ${u.login} corrected: ${corrected}`)
  //   })
  // )

  console.log(`[init] found ${evaluations.length} evaluations for your campus`)

  await Promise.all(
    evaluations.map(async (eval) => {
      const e = await Evaluation.findOne({intraId: eval.id})
      
      if (!e) {
        const user = await User.findOne({intraId: eval.corrector.id})
        console.log(user)

        duration = new Date(eval.begin_at) - new Date() //seconds bro, just awesome for a setTimeout
        // const hours = Math.abs(date2-date1) / 36e5

        newEval = new Evaluation({
          intraId: eval.id,
          beginAt: eval.begin_at,
          repo: eval.team.repo_uuid
        })

        try {
          await newEval.save()
          user.evaluations.push(newEval)
          user.save()
          console.log(`[init] ${user.login} will have to correct ${eval.correcteds.map( (c) => c.login).join(', ')} with the repo: ${newEval.repo}`)
        } catch(err) {
          console.log(`[init] error while creating evaluation ${eval.id} - ${err}`)
        }
      }
    })
  )

 // TODO: at least here there is timestamps fields -_-' 
 // TODO: check corrector.login !== supervisor
 // TODO: repo_uuid 
 // TODO correcteds is an array ; first would be enough to determine if it's a hive stud
 //  "correcteds": [
  // {
  //   "id": 29606,
  //   "login": "****",
  // }]

 // TODO: get repo_uuid
 // TODO /v2/scale_teams?filter[future]=true

}


const check = () => {
  vgsIsAlive()
  intraIsAlive()
}

module.exports = { check, populateUser, populateEvaluation }