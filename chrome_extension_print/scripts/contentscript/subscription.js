"use strict";

let subscriptions = Array.from(document.querySelectorAll('#channel-title span.style-scope.ytd-channel-renderer').values()).map(elem => elem.innerHTML)

saveText("SubscriptionList.json", JSON.stringify(subscriptions))