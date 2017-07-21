const got = require('got')
const change = require('..')

// returns repo information, which includes nested owner object
const getRepoInfo = ownerAndName => {
  const url = `https://api.github.com/repos/${ownerAndName}`
  return got(url, { json: true }).then(r => r.body)
}

// notice some renamed fields!
const onlyInterested = {
  login: 'bahmutov',
  avatar: 'https://avatars1.githubusercontent.com/u/2212006?v=4',
  url: 'https://api.github.com/repos/bahmutov/change-by-example',
  ssh: 'git@github.com:bahmutov/change-by-example.git'
}

// TODO should go into Applicative
getRepoInfo('bahmutov/change-by-example')
  // returns A LOT of info!
  // see for yourself using
  // curl https://api.github.com/repos/bahmutov/change-by-example
  .then(info => change(info, onlyInterested))
  .then(f => {
    return getRepoInfo('bahmutov/next-update').then(f)
  })
  .then(console.log, console.error)
// prints only extracted + renamed info
/*
{
  login: 'bahmutov',
  avatar: 'https://avatars1.githubusercontent.com/u/2212006?v=4',
  url: 'https://api.github.com/repos/bahmutov/next-update',
  ssh: 'git@github.com:bahmutov/next-update.git'
}
*/
