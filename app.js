//jshint: 'esversion 6'

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const app = express();
let dayOfWeek;
dayOfWeek = date.getDay();
let itemMap = new Map();
let itemsChecked = [];
itemMap.set('Monday', []);
itemMap.set('Tuesday', []);
itemMap.set('Wednesday', []);
itemMap.set('Thursday', []);
itemMap.set('Friday', []);
itemMap.set('Saturday', []);
itemMap.set('Sunday', []);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    let day = date.getDate();

    res.render("list", { listTitle: day, kindOfDay: anotherDay, newListItems: itemMap, itemsChecked: itemsChecked, dayOfWeek: dayOfWeek });
});

app.post("/", function(req, res) {
    let item = req.body.newItem;
    let itemOption = {
        itm: item,
        chk: 0
    };
    if (item.length !== 0) {
        if (item.length <= 200) {
            itemMap.get(dayOfWeek).push(itemOption);
        }
    }
    res.redirect("/");
});

app.post("/onMyClick", function(req, res) {
    let itemNumber = req.body.itemNumber;
    const index = itemsChecked.indexOf(itemNumber);
    if (index > -1) {
        itemsChecked.splice(index, 1);
    }
    res.redirect("/");
});

app.post("/onYourClick", function(req, res) {
    let itemNumber = req.body.itemNumber;
    itemsChecked.push(itemNumber);
    res.redirect("/");
});

app.post("/nextDay", function(req, res) {
    let nextDay = req.body.nextDay;
    dayOfWeek = date.getNextDay(nextDay);
    console.log('next day is ' + nextDay);
    res.redirect("/");
});

app.post("/previousDay", function(req, res) {
    let previousDay = req.body.previousDay;
    dayOfWeek = date.getNextDay(previousDay);
    console.log('previous day is ' + previousDay);
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("Server is running on port 3000.");
});