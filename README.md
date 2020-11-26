<h1 align="center"><code>vgs_watcher</code></h1>

<div align="center">
  <sub>Created by <a href="">Jordane Gengo (Titus)</a></sub>
</div>

<h1 align="center">WIP</h1>

<a href="#">vgs_watcher</a> may not interest you (at all). It is a tool I'm planning to use to avoid some issues related to a private external service (intra 42). But also, a project to get better with Javascript.

## Features
- [x] populate a mongodb with users from my campus
- [ ] crawl future evaluations and save them.
- [ ] when it's evaluation time, check gitea that the evaluator has the read permission on the repo
- [ ] manual mode, send a slack message to inform of the problem (+interaction button to give perm?)
- [ ] auto-pilot mode, if permission aren't given automatically give it + send notif

## Why?

Time to time, the 42 intra Sidekiq is down or may be slow, so our students have to wait that the sidekiq to be back to be able to do their evaluation and I would like to avoid this.
So I may code this (maybe) so I will be alerted if such a problem happens and propose me a quick-fix or automatically fix it for me.

## How it works


