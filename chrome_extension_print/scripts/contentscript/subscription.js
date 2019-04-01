"use strict";

let subscriptionName = Array.from(document.querySelectorAll('#channel-title span.style-scope.ytd-channel-renderer').values()).map(elem => elem.innerHTML)
let subscriptionID = Array.from(document.querySelectorAll('#grid-container .yt-simple-endpoint.style-scope.ytd-channel-renderer').values()).map(elem => elem.href)

var subscriptions = []
var aSubscription = {}

subscriptionName.forEach ((value, i) => {
    aSubscription = {}

    aSubscription['name'] = value
    aSubscription['id'] = subscriptionID[i].split("/").slice(-1)

    subscriptions.push(aSubscription)

})

saveText("SubscriptionList.json", JSON.stringify(subscriptions))