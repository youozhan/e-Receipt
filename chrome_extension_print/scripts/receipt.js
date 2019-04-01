$(document).ready(function () {
    chrome.storage.local.get(['purchaseStorageKey'], function (result) {

        var purchaseData = JSON.parse(result['purchaseStorageKey'])[0]

        $('#pname').text($('#pname').text() + purchaseData.name)
        $('#pprice').text($('#pprice').text() + purchaseData.price)

        console.log("purchase data get")
        // console.log(purchaseData.name)

    })

    chrome.storage.local.get(['subscriptionStorageKey'], function (result) {

        var subscriptionData = JSON.parse(result['subscriptionStorageKey'])[0]
        $('#sname').text($('#sname').text() + subscriptionData.name)
        console.log("subscription data get")

    })

    chrome.storage.local.get(['settingStorageKey'], function (result) {

        var settingData = JSON.parse(result['settingStorageKey'])
        $('#setname').text($('#setname').text() + settingData)
        console.log("setting data get")
        console.log(JSON.parse(result['settingStorageKey']))

    })

    chrome.storage.local.get(['adsStorageKey'], function (result) {

        var adsData = JSON.parse(result['adsStorageKey'])[0]
        $('#aname').text($('#aname').text() + adsData)
        console.log("ads data get")

    })
})