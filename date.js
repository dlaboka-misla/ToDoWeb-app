//jshint esversion:6

module.exports = getDate;

const dateFormat = require("dateformat");

function getDate() {
    let today = new Date();
    let currentDay = today.getDay();
    let day = dateFormat(today, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    if (currentDay === 6 || currentDay === 0) {
        let anotherDay = "Weekend";
    } else {
        anotherDay = "Weekday";
    }
    return day;
}