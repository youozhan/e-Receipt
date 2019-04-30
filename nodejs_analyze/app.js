const glob = require('glob'),
    fs = require('fs'),
    express = require('express'),
    multer = require('multer'),
    bodyParser = require('body-parser')
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
            next(null, './data');
        },

        //specify the filename to be unique
        filename: function(req, file, next){
            console.log(file);
            //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
            const ext = file.mimetype.split('/')[1];
            //set the file fieldname to a unique name containing the original name, current datetime and the extension.
            next(null, file.fieldname + '-' + Date.now() + '.'+ext);
        }
    })
}

app.get('/', (req, res) => {
    res.render('index.html')
})

app.post('/upload', multer(multerConfig).single('youtubeStats'), (req, res) => {
    res.send('Complete! Check out your data folder.  Please note that files not encoded with an image mimetype are rejected. <a href="index.html">try again</a>');
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

const folderpath = '/Users/yz/Documents/Processing/sketch_190328a/'
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


        })

        // Convert result to position data
        for (var i = 0; i < settingsPercentiles.length; i++) {
            analyzeResult[i] = 800 - (settingsPercentiles[i] + subscriptionPercentiles[i] + adPercentiles[i]) * 400

            var xpos = analyzeResult[i] * Math.cos(Math.PI * 2 * i / profileCount)
            var ypos = analyzeResult[i] * Math.sin(Math.PI * 2 * i / profileCount)
            var orbit = Math.cos(Math.PI * i) * 0.002
            var moon = Math.round(subscriptionPercentiles[i] * 6)
            var profileLabel = "anonymous" + String(i)

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
                label: profileLabel
            })
        }

        console.log("Stats updated on server")
        console.log(settingsOnAmounts)
        console.log(subscriptionOnAmounts)
        console.log(adOnAmounts)

    })

    setTimeout(function () {
        fs.writeFile(folderpath + "data.json", JSON.stringify(obj), function (err) {
            if (err) throw err
            console.log("Saving data")
        })
    }, 2000)

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


app.listen(8080, () => updateStats())