"use strict";

let purchases_raw = Array.from(document.querySelectorAll('.details.style-scope.ytd-purchase-item-renderer yt-formatted-string').values()).map(elem => elem.innerHTML)

var purchases = []
var aPurchase = {}

purchases_raw.forEach( (value, i) => {
    
    if (i % 3 == 0) {
        aPurchase = {}
        aPurchase['name'] = value
    } else if (i % 3 == 1) {
        aPurchase['price'] = value
        purchases.push(aPurchase)
    } 

}) 

saveText("Purchases.json", JSON.stringify(purchases))