let localStat = {
    settingsOnAmount: 0,
    subscriptionOnAmount: 0,
    adOnAmount: 0
}

$(document).ready(() => {

    var dt = new Date()
    document.getElementById("datetime").innerHTML = dt.toLocaleString();

    chrome.storage.local.get(['purchaseStorageKey'], (result) => {
        // Need to update [0] to object list
        var purchaseData = JSON.parse(result['purchaseStorageKey'])[0]

        if (purchaseData) {

            $('#pname').text($('#pname').text() + purchaseData.name)
            $('#pprice').text($('#pprice').text() + purchaseData.price)

            console.log("purchase data get")
            // console.log(purchaseData.name)
        }

    })

    chrome.storage.local.get(['subscriptionStorageKey'], (result) => {

        var subscriptionData = JSON.parse(result['subscriptionStorageKey'])

        // Only search for a slice of data to avoid throttling
        subscriptionData.forEach((item, i) => {
            setTimeout(() => {
                $.get('https://socialblade.com/youtube/channel/' + (item.id)[0], (socialBladeHTML) => {

                    const data = $(socialBladeHTML)

                    const videoGrade = data.find('#afd-header-total-grade').text()
                    const monthlyEarn = data.find('p[style*="font-size: 1.4em; color:#41a200; font-weight: 600; padding-top: 20px;"]')[0].innerHTML

                    $('table#subscriptionlist').append(`<tr><td width="58%">${item.name}</td><td>${monthlyEarn}</td></tr>`)
                })
            }, 500*i)
        })

        localStat.subscriptionOnAmount = subscriptionData.length

    })

    chrome.storage.local.get(['settingStorageKey'], (result) => {

        var settingData = JSON.parse(result['settingStorageKey'])

        var items = []

        Object.keys(settingData).forEach((key) => {

            // Construct the receipt HTML
            items.push(`<tr><td>${key}</td><td>${settingData[key]}</td></tr>`)

            // Accumulate the localstat
            if (settingData[key] === "On") {
                localStat.settingsOnAmount += 1
            }
        })

        $('table#settinglist').append(items.join(''))

        console.log("setting data get")
        console.log(JSON.parse(result['settingStorageKey']))
    })

    chrome.storage.local.get(['adsStorageKey'], (result) => {

        var adsData = JSON.parse(result['adsStorageKey'])

        var items = []

        Object.keys(adsData).forEach((key) => {
            items.push(`<tr><td>${adsData[key]}</td></tr>`)
        })

        $('table#adslist').append(items.join(''))

        localStat.adOnAmount = adsData.length

        console.log("ads data get " + localStat.adOnAmount)

    })


    // Send request to backend and get the percentile
    setTimeout(() => {
        $.ajax ({
            type: "POST",
            //the url where you want to sent the userName and password to
            url: 'http://54.65.179.104:8080/perct',
            // url: 'http://localhost:3000/perct',
            contentType: 'application/json',
            
            data: JSON.stringify(localStat),
            
            success: (res) => {
                console.log(res)
                $('#subscriptionpercentile').text((JSON.parse(res.subscriptionOnAmount)*100).toFixed(0) + "%")
                $('#settingpercentile').text((JSON.parse(res.settingsOnAmount)*100).toFixed(0) + "%")
                $('#adspercentile').text((JSON.parse(res.adOnAmount)*100).toFixed(0) + "%")
            }
        })
    }, 1000)
})