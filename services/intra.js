const axios = require('axios');
const config = require('../utils/config')

const TRIESLIMIT = 10;
const TIMEOUT = 900;

let token;
const baseUrl = 'https://api.intra.42.fr/'

const getToken = () => {
	return axios.post(baseUrl + 'oauth/token', {
		client_id: config.INTRA_UID, 
		client_secret: config.INTRA_SECRET, 
		grant_type: 'client_credentials', 
		scope: "public"
	});
}

const renewToken = () => { token = getToken(); }

const authError = (authHead) => {
	if (!(authHead === "")) {
		const desc = authHead.split('error_description="')[1].split('"')[0];
		if (desc == "The access token expired" || desc == "The access token is invalid") {
			console.log('[intraService] ' + desc);
			console.log('[intraService] renewing token');
			renewToken();
			return true
		}
	}
	return false
}

const rateLimit = (retryAfter) => {
	console.log('[intraService] rate limit exceeed')
	const waitTime = parseInt(retryAfter);
	console.log(`[intraService] waiting ${waitTime}s before requesting again`) 
	return new Promise(r => setTimeout(r, 1000 * waitTime));
}

const logError = (resp, url, params) => {
	console.error(`Headers: ${JSON.stringify(resp.headers)}`);
	console.error(`${resp.status < 500 ? 'Client' : 'Server'}Error(${resp.status})`)
	console.error(`${url} with params: ${JSON.stringify(params)}`)
	console.error(`Response: ${resp.data}`)
}

const writeHeader = async (params) => {
	if (token === undefined)
		renewToken();
	tokenData = (await token).data;
	params.headers = {
		'Authorization': `${tokenData.token_type} ${tokenData.access_token}`
	};
}

const reqAll = async (method, url, params={}) => {
	const ret = await req(method, url, {...params, per_page: 1})
	const maxCount = ret.headers['x-total'];
	const all = [];

	for (let page = 1; page <= Math.ceil(maxCount / 100); page++)
	{
		newUrl = url + (url.includes('?') ? '&' : '?') + 'per_page=100&page=' + page

		let data = (await req(method, newUrl, {
					...params,
			})).data;
			all.push(...data)
	}
	return all;
}

const req = async (method, url, params={}) => {
	await writeHeader(params);
	params.method = params.method == undefined ? method : params.method;
	params.timeout = params.timeout == undefined ? TIMEOUT * 1000 : params.timeout;
	
	params.url = params.url == undefined ? `${baseUrl}v2/${url}` : params.url;

  let tries = 0;
  
  while (tries < TRIESLIMIT) {
		await new Promise(r => setTimeout(r, 50 * tries++));
    
    try {
			const res = await axios(params);
			console.log(`[intraService] ${res.status} - ${url}`)
			return res
		} catch (error) {
			let resp = error.response;
			switch (resp.status) {
				case 401:
					if (authError(resp.headers['www-authenticate'])) 
						await writeHeader(params);
						break;
				case 429:
					await rateLimit(resp.headers['retry-after']);
					break;
				default:
					if (resp.status >= 400) {
						logError(resp, url, params);
						throw error;
					}	
			};
    }

	}
}

module.exports = { req, reqAll }