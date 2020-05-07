//jshint: 'esversion 6'

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dateFormat = require("dateformat");
const app = express();
let items = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function(req, res) {
    let today = new Date();
    let currentDay = today.getDay();
    let day = dateFormat(today, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    if (currentDay === 6 || currentDay === 0) {
        let anotherDay = "Weekend";
    } else {
        anotherDay = "Weekday";
    }
    res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function(req, res) {
    let item = req.body.newItem;

    if (item.length !== 0) {
        if (item.length <= 200) {
            items.push(item);
        }
        res.redirect("/");
    }
});

app.listen(3000, function(req, res) {
    console.log("Server is running on port 3000.");
});

//send vs.write-> we can only use send once, but write multipy times
// we are rendering a file with res.render inside the list.ejs file inside views, no need to refer to html files