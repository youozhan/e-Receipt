const fs = require('fs')

let rawdata = fs.readFileSync('data/ReceiptData.json')
let profile = JSON.parse(rawdata)

let settingsOnAmount = 0

Object.keys(profile.settingStorageKey).forEach(key => {
    if (profile.settingStorageKey[key] === "On") {
        settingsOnAmount += 1
    }
})

console.log(settingsOnAmount)