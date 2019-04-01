$(document).ready(function () {
    $('body').on('click', 'a', function () {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });

    $('body').on('click', 'a#submit', function () {
        chrome.tabs.create({
            url: chrome.runtime.getURL("receipt.html")
        });
        return false;
    });
});