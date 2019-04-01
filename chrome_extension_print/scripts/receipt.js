$(document).ready(function() {
    chrome.storage.local.get(['purchaseStorageKey'], function (result) {

        var purchaseData = JSON.parse(result['purchaseStorageKey'])[0]
    
        $('#pname').text($('#pname').text() + purchaseData.name)
        $('#pprice').text($('#pprice').text() + purchaseData.price)
    
        console.log("purchase data get")
        console.log(purchaseData.name)
    })
})