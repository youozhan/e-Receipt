const glob = require('glob'),
    fs = require('fs'),
    express = require('express'),
    multer = require('multer'),
    bodyParser = require('body-parser'),
    moment = require('moment')
    // path = require('path')

app = express()

app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/', express.static(__dirname + '/public'));

//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {
    //specify diskStorage (another option is memory)
    storage: multer.diskStorage({

        //specify destination
        destination: function(req, file, next){
            next(null, './data_raw')
        },

        //specify the filename to be unique
        filename: function(req, file, next){
            console.log(file)
            //get the file mimetype
            const ext = file.mimetype.split('/')[1]
            //set the file fieldname to a unique name containing the original name, current datetime and the extension.
            next(null, `${file.fieldname}-${Date.now()}.${ext}`)
        }
    })
}

app.get('/', (req, res) => {
    res.render('index.html')
})


const {promisify} = require('util'),
    readFileAsync = promisify(fs.readFile),
    writeFileAsync = promisify(fs.writeFile)

// Handler for uploading files using express-upload
app.post('/upload', multer(multerConfig).single('youtubeStats'), (req, res) => {

    async function enrichData() {
        try {
            // Access the raw uploads
            const text = await readFileAsync(`./data_raw/${req.file.filename}`, {encoding: 'utf8'})

            const statUploaded = JSON.parse(text)

            const {ageGroup, youtubeUse, idString} = req.body

            // Add metadata
            statUploaded['ageGroup'] = ageGroup
            statUploaded['youtubeUse'] = youtubeUse
            statUploaded['idString'] = idString + moment().format("MMDD")


            // Rewrite file to the real data file
            await writeFileAsync(`./data/${req.file.filename}`, JSON.stringify(statUploaded))

            updateStats()

            console.log('Enriched data for stats json file:', req.file.filename)
        } catch (err) {
            console.log('Enrich data error:', err);
        }
    }

    enrichData()

    res.redirect("/uploaded.html")
})



//Global variables as counters
let settingsOnAmounts = []
let subscriptionOnAmounts = []
let adOnAmounts = []

//Percentile
let settingsOnPercentiles = []
let suscriptionPercentiles = []
let adOnPercentiles = []

let analyzeResult = []
let profileCount = 0

// const folderpath = '/Users/yz/Documents/GitHub/chrome-extension-youtube-analytics/p5/assets/'
const folderpath = '/home/yz526/Chrome-Extension-YouTube-Analytics/p5/assets/'

let obj = {
    planets: []
}

function updateStats() {
    glob(__dirname + '/data/*.json', {}, (err, files) => {

        settingsOnAmounts = []
        subscriptionOnAmounts = []
        adOnAmounts = []

        settingsPercentiles = []
        subscriptionPercentiles = []
        adPercentiles = []

        let ageGroups = []
        let youtubeUses = []
        let idStrings = []

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
            settingsPercentiles = settingsOnAmounts.map(d => getPercentile(d, settingsOnAmounts))
            subscriptionPercentiles = subscriptionOnAmounts.map(d => getPercentile(d, subscriptionOnAmounts))
            adPercentiles = adOnAmounts.map(d => getPercentile(d, adOnAmounts))

            profileCount = settingsOnAmounts.length

            // Add additiona information
            // {ageGroup, youtubeUse, idString} = profile
            ageGroups.push(profile.ageGroup)
            youtubeUses.push(profile.youtubeUse)
            idStrings.push(profile.idString)

        })

        obj.planets = []

        // Convert result to position data
        for (let i = 0; i < settingsPercentiles.length; i++) {
            analyzeResult[i] = 800 - (settingsPercentiles[i] + subscriptionPercentiles[i] + adPercentiles[i]) * 400
            // Generate position based on the percentiles
            var xpos = analyzeResult[i] * Math.cos(Math.PI * 2 * i / profileCount)
            var ypos = analyzeResult[i] * Math.sin(Math.PI * 2 * i / profileCount)
            var orbit = Math.cos(Math.PI * i) * 0.008 * (1 - analyzeResult[i]/800) * (1 - analyzeResult[i]/800)
            var moon = Math.round(subscriptionPercentiles[i] * 6)

            obj.planets.push({
                position: {
                    x: xpos.toFixed(0),
                    y: ypos.toFixed(0)
                },
                diameter: 32,
                orbitspeed: orbit,
                mooncount: moon,
                moondistance: 36,
                moondiameter: 12,
                label: idStrings[i] 
            })
        }

        console.log("Stats updated on server")
        // console.log(settingsOnAmounts)
        // console.log(subscriptionOnAmounts)
        // console.log(adOnAmounts)
        console.log(analyzeResult)

    })

    setTimeout(function () {
        fs.writeFile(folderpath + "data.json", JSON.stringify(obj), function (err) {
            if (err) throw err
            console.log("Saving data")
        })
    }, 2000)

}


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


app.listen(8080, () => updateStats())