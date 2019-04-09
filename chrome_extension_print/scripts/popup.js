function syncCheckboxesWithStorage() {
    //Check whether specific tasks are already finished
    ['purchaseStorageKey', 'subscriptionStorageKey', 'settingStorageKey', 'adsStorageKey'].forEach(key => {
        chrome.storage.local.get([key], (result) => {
            if (result[key]) {
                $('#' + key).prop('checked', true)
            } else {
                $('#' + key).prop('checked', false)
            }
        })
    })
}

$(document).ready(function () {
    $(this).on('click', 'a', function () {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false
    });

    $(this).on('click', 'a#submit', function () {
        chrome.tabs.create({
            url: chrome.runtime.getURL("receipt.html")
        });
        return false
    });

    $(this).on('click', 'button#download', function () {
        saveReceiptIntoData()
        return false
    })

    $(this).on('click', 'button#reset', function () {
        chrome.storage.local.clear()
        return false
    });

    syncCheckboxesWithStorage()
});

