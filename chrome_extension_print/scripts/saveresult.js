function saveReceiptIntoData() {

    var resultData = {}

    //Check each key in the local storage
    var storageKeys = ['purchaseStorageKey', 'subscriptionStorageKey', 'settingStorageKey', 'adsStorageKey']
    
    storageKeys.forEach(key => {
        chrome.storage.local.get([key], (result) => {
            resultData[key] = JSON.parse(result[key])
        })
    })

    setTimeout(() => {
        console.log(resultData)
        saveText("ReceiptData.json", JSON.stringify(resultData))
    }, 2000);
}