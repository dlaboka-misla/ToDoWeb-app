//jshint: 'esversion 6'

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true})

const itemsSchema = {
    name: String,
    createdOn: Date,
    day: Number,
    chk: Number
};

const Item = mongoose.model("Item", itemsSchema);

let day = date.getDate();
let dayOfWeek = new Date().getDay();
let currentDayOfWeek = new Date().getDay();
let itemsMap = [];
let lastAccessedDay = -1;
let lastAccessedDate;

// deletes items which were created in the past week, ending last Saturday
function deleteFromDB() {
    const lastSunday = date.getDateOfLastSunday(new Date());
    Item.deleteMany({"createdOn": { $lt : new Date(lastSunday.toISOString().slice(0,10)) } }, function(err) {
         if (err) return handleError(err);
    })
}

app.get("/", function(req, res) {
    currentDayOfWeek = new Date().getDay();
    let currentDate = new Date();

    // makes sure the span of days is in the range of Sunday to Saturday
    if (lastAccessedDay === -1 ||
        (lastAccessedDay > currentDayOfWeek) ||
        (date.getDateDiff(currentDate, lastAccessedDate) >= 7)) {
        day = date.getDate();
        deleteFromDB();
    }
    lastAccessedDay = currentDayOfWeek;
    lastAccessedDate = currentDate;
    itemsMap = [];
    Item.find({day:dayOfWeek}, function(err, foundItems) {
        foundItems.forEach(foundItem => {
        itemsMap.push(foundItem);
    })
        res.render("list", {
        listTitle: day,
        dayOfWeek: dayOfWeek,
        newListItems: itemsMap,
    });
    });
});

// adds new item to itemsMap
app.post("/", function(req, res) {
    let item = req.body.newItem;
    if (item.length !== 0) {
        if (item.length <= 300) {
            const todoItem = new Item ({
                name: item,
                createdOn: new Date(new Date().toISOString().slice(0,10)),
                day: dayOfWeek,
                chk: 0
            });
            todoItem.save();
            itemsMap.push(todoItem);
        }
    }
    res.redirect("/");
});

// marks to-do item as checked or unchecked in the database
app.post("/onToggle", function(req, res) {
    let itemNumber = req.body.itemNumber;
    let itemId = req.body.id;
    let chk = req.body.chk;
    Item.updateOne({_id: itemId}, {$set: {chk: chk} }, function(err, res) {
        if (err) throw err;
    })
    res.redirect("/");
});

/* the function bellow is called when curly bracket is clicked or arrow key is pressed
  and changes the title of the week */
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
