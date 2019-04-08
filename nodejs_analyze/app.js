const glob = require('glob'),
    fs = require('fs')

let settingsOnAmount = []
let subscriptionOnAmount = []
let adOnAmount = []

glob(__dirname + '/data/*.json', {}, (err, files)=>{
    files.forEach(file => {
        
        let rawdata = fs.readFileSync(file)
        let profile = JSON.parse(rawdata)
        let settingCount = 0

        Object.keys(profile.settingStorageKey).forEach(key => {
            if (profile.settingStorageKey[key] === "On") {
                settingCount += 1
            }
        })

        settingsOnAmount.push(settingCount)

        subscriptionOnAmount.push(profile.subscriptionStorageKey.length)
        adOnAmount.push(profile.adsStorageKey.length)

    })

    console.log(toPercentile(settingsOnAmount))
    console.log(toPercentile(subscriptionOnAmount))
    console.log(toPercentile(adOnAmount))

})

function toPercentile(arr) {
    return arr.map(amt => arr.filter(d => d<amt).length / arr.length)
}