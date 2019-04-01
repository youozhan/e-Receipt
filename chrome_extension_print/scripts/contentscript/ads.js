"use strict";

let adsSettings = Array.from(document.querySelectorAll('.c7O9k').values()).map(elem => elem.innerHTML)

saveText("AdsSettings.json", JSON.stringify(adsSettings))