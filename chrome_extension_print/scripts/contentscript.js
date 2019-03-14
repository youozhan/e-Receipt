"use strict";

var settings = {}

const cssPaths = {
    'settingRow': 'div.BQtBnc',
    'settingLabel': 'h3.bJCr1d',
    'settingData': 'div.kFNik'
}

// Foreach rows has setting data
$(`${cssPaths.settingRow}:has(${cssPaths.settingData})`)
        // Add a dictionary entry to the settings collection
        .each((i, row) => settings[$(row).find(cssPaths.settingLabel).text()] = $(row).find(cssPaths.settingData).text())

saveText('UserSettings.json', JSON.stringify(settings))
