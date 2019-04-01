"use strict";

let adsSettings = Array.from(document.querySelectorAll('.c7O9k').values()).map(elem => elem.innerHTML)

chrome.storage.local.set({'adsStorageKey': JSON.stringify(adsSettings)}, function(){
    console.log('ads data stored')
})

// saveText("AdsSettings.json", JSON.stringify(adsSettings))