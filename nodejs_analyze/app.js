const glob = require('glob'),
    fs = require('fs'),
    express = require('express')

app = express()

app.use(express.json());

//Global variables as counters
let settingsOnAmounts = []
let subscriptionOnAmounts = []
let adOnAmounts = []


function updateStats() {
    glob(__dirname + '/data/*.json', {}, (err, files) => {

        settingsOnAmounts = []
        subscriptionOnAmounts = []
        adOnAmounts = []

        files.forEach(file => {
            
            // Generage analytics for client
            let rawdata = fs.readFileSync(file)
            let profile = JSON.parse(rawdata)
            let settingCount = 0

            Object.keys(profile.settingStorageKey).forEach(key => {
                if (profile.settingStorageKey[key] === "On") {
                    settingCount += 1
                }
            })

            // Accumulate all data from json data files
            settingsOnAmounts.push(settingCount)
            subscriptionOnAmounts.push(profile.subscriptionStorageKey.length)
            adOnAmounts.push(profile.adsStorageKey.length)

            // Rank the profile
            

        })

        console.log("Stats updated on server")
        // console.log(adOnAmounts)
    })
}


// Handler for uploading files using express-upload
app.post('/upload', (req, res) => {

    updateStats()

    console.log(req.files.datafile) // the uploaded file object
})


function getPercentile(amt, arr) {
    return arr.filter(d => d < amt).length / arr.length
}


app.post('/perct', (req, res) => {
    let curStat = req.body

    res.send({
        settingsOnAmount: getPercentile(curStat.settingsOnAmount, settingsOnAmounts),
        subscriptionOnAmount: getPercentile(curStat.subscriptionOnAmount, subscriptionOnAmounts),
        adOnAmount: getPercentile(curStat.adOnAmount, adOnAmounts)
    })
})


app.listen(3000, () => updateStats())