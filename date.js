//jshint esversion:6

const dateFormat = require("dateformat");

module.exports.getDate = function() {
    let today = new Date();
    let currentDay = today.getDay();
    if (currentDay === 6 || currentDay === 0) {
        anotherDay = "Weekend";
    } else {
        anotherDay = "Weekday";
    }
    return dateFormat(today, "dddd, mmmm dS, yyyy, h:MM:ss TT");
};

module.exports.getDay = function() {
    let today = new Date();
    let options = {
        weekday: "long"
    };
    return today.toLocaleDateString("en-US", options);
};

module.exports.getNextDay = function(currentDay) {
    if (currentDay === 'Saturday') {
        return 'Sunday';
    }
    return currentDay;
};

module.exports.getPreviousDay = function(currentDay) {

    return currentDay;
};