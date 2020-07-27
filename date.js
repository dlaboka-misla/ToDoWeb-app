//jshint esversion:6

const dateFormat = require("dateformat");

module.exports.getDate = function() {
    let today = new Date();
    return dateFormat(today, "dddd, mmmm dS, yyyy, h:MM:ss TT");
};

/* depending on the type which can be next or previous,
   getDayByType returns back next or previous day of the week */
module.exports.getDayByType = function(currentDay, type) {
    let result = 0;
    if (type === "next") {
        if (currentDay >= 6) {
            result = 6;
        } else {
            result = 1 + parseInt(currentDay);
        }
    } else {
        if (currentDay <= 0) {
            result = 0;
        } else {
            result = parseInt(currentDay) - 1;
        }
    }
    return result;
};

// postTitleDays displays the titles of the days in certain format
module.exports.postTitleDays = function(currentDayOfWeek, newDayOfWeek) {
    let difference = newDayOfWeek - currentDayOfWeek;
    const today = new Date();
    const tommorrow = new Date(today);
    tomorrow = tommorrow.setDate(today.getDate() + difference);
    let diffTomm = dateFormat(tommorrow, "dddd, mmmm dS, yyyy");
    if (currentDayOfWeek == newDayOfWeek) {
        diffTomm = dateFormat(tommorrow, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    }
    return diffTomm;
};

/* getDateDif calculates the difference between two days and is used as
helping function when checking if we are in the current week */
module.exports.getDateDiff = function(currentDate, lastAccessedDate) {
    let diffInTime = currentDate.getTime() - lastAccessedDate.getTime();
    return (diffInTime / (1000 * 3600 * 24));
};

// accessing the date when the last Sunday occured in order to delete the items from DB
module.exports.getDateOfLastSunday = function(currentDate) {
    if (currentDate.getDay() === 0) return currentDate
   while (currentDate.getDay() > 0) {
       currentDate.setDate(currentDate.getDate() - 1)
   }
   return currentDate;
};
