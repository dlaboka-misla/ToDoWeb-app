//jshint esversion:6

const dateFormat = require("dateformat");

module.exports.getDate = function() {
    let today = new Date();
    return dateFormat(today, "dddd, mmmm dS, yyyy, h:MM:ss TT");
};

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

module.exports.getDateDiff = function(currentDate, lastAccessedDate) {
    let diffInTime = currentDate.getTime() - lastAccessedDate.getTime();
    return (diffInTime / (1000 * 3600 * 24));
};


module.exports.isValidPassword = function(password, username) {
  if (password.length < 8) {
    return false
  }
  if (password.indexOf(' ') !== -1) {
    return false
  }
  if (password.indexOf(username) !== -1) {
    return false
  }
  return true
}

module.exports.isValidEmail = function (email) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    return (true)
  }
    return (false)
}