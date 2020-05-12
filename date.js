//jshint esversion:6

const dateFormat = require("dateformat");

module.exports.getDate = function() {
    let today = new Date();
    return dateFormat(today, "dddd, mmmm dS, yyyy, h:MM:ss TT");
};

module.exports.getDayByType = function(currentDay, type) {
    let result = 0;
    if (type === "next") {
        if (currentDay == 0 || currentDay >= 6) {
            result = 0;
        } else {
            result = 1 + parseInt(currentDay);
        }
    } else {
        if (currentDay == 0) {
            result = 6;
        } else if (currentDay == 1) {
            result = 1;
        } else {
            result = parseInt(currentDay) - 1;
        }
    }
    return result;
};

module.exports.postTitleDays = function(currentDayOfWeek, newDayOfWeek) {
    let difference = newDayOfWeek - currentDayOfWeek;
    if (newDayOfWeek == 0) {
        difference = 7 - currentDayOfWeek;
    }
    const today = new Date();
    const tommorrow = new Date(today);
    tommorrow.setDate(tommorrow.getDate() + difference);
    let diffTomm = dateFormat(tommorrow, "dddd, mmmm dS, yyyy");
    if (currentDayOfWeek == newDayOfWeek) {
        diffTomm = dateFormat(tommorrow, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    }
    return diffTomm;
};