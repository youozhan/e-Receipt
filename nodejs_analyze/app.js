const glob = require('glob'),
    fs = require('fs')

let settingsOnAmount = 0
let subscriptionOnAmount = 0
let adOnAmount = 0

glob(__dirname + '/data/*.json', {}, (err, files)=>{
    files.forEach(file => {
        
        let rawdata = fs.readFileSync(file)
        let profile = JSON.parse(rawdata)

        Object.keys(profile.settingStorageKey).forEach(key => {
            if (profile.settingStorageKey[key] === "On") {
                settingsOnAmount += 1
            }
        })

        subscriptionOnAmount += profile.subscriptionStorageKey.length
        adOnAmount += profile.adsStorageKey.length

    })

    console.log(files.length)
    console.log("setting total " + settingsOnAmount)
    console.log("subscription total " + subscriptionOnAmount)
    console.log("ad total " + adOnAmount)
})