//jshint: 'esversion 6'

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let day = date.getDate();
let dayOfWeek = new Date().getDay();
let currentDayOfWeek = new Date().getDay();
let itemsMap = new Map();
let itemsCheckedMap = new Map();
let lastAccessedDay = -1;
let lastAccessedDate;

function reloadItems() {
    day = date.getDate();
    itemsMap = new Map();
    itemsMap.set(0, []);
    itemsMap.set(1, []);
    itemsMap.set(2, []);
    itemsMap.set(3, []);
    itemsMap.set(4, []);
    itemsMap.set(5, []);
    itemsMap.set(6, []);
    itemsCheckedMap = new Map();
    itemsCheckedMap.set(0, []);
    itemsCheckedMap.set(1, []);
    itemsCheckedMap.set(2, []);
    itemsCheckedMap.set(3, []);
    itemsCheckedMap.set(4, []);
    itemsCheckedMap.set(5, []);
    itemsCheckedMap.set(6, []);
};

app.get("/", function(req, res) {
    currentDayOfWeek = new Date().getDay();
    let currentDate = new Date();
    if (lastAccessedDay === -1 ||
        (lastAccessedDay > currentDayOfWeek) ||
        (date.getDateDiff(currentDate, lastAccessedDate) >= 7)) {
        reloadItems();
    }
    lastAccessedDay = currentDayOfWeek;
    lastAccessedDate = currentDate;
    res.render("list", {
        listTitle: day,
        dayOfWeek: dayOfWeek,
        newListItems: itemsMap,
        itemsCheckedMap: itemsCheckedMap,
    });
});

app.post("/", function(req, res) {
    let item = req.body.newItem;
    let itemOption = {
        itm: item,
        chk: 0
    };
    if (item.length !== 0) {
        if (item.length <= 300) {
            itemsMap.get(dayOfWeek).push(itemOption);
        }
    }
    res.redirect("/");
});

app.post("/onMyClick", function(req, res) {
    let itemNumber = req.body.itemNumber;
    const index = itemsCheckedMap.get(dayOfWeek).indexOf(itemNumber);
    if (index > -1) {
        itemsCheckedMap.get(dayOfWeek).splice(index, 1);
    }
    res.redirect("/");
});

app.post("/onYourClick", function(req, res) {
    let itemNumber = req.body.itemNumber;
    itemsCheckedMap.get(dayOfWeek).push(itemNumber);
    res.redirect("/");
});

app.post("/posts/:day/:type", function(req, res) {
    let currentDay = req.params.day;
    let type = req.params.type;
    dayOfWeek = date.getDayByType(currentDay, type);
    day = date.postTitleDays(currentDayOfWeek, dayOfWeek);
    res.redirect("/");
});

app.listen(process.env.PORT || 5000, function(req, res) {
    console.log("Server is running on port 5000.");
});
