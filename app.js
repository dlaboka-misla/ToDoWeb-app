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
let itemsMap = new Map();
let itemsCheckedMap = new Map();
let lastAccessedDay = -1;
let lastAccessedDate;

// reloadItems is called when the app starts and when the week changes
function reloadItems() {
    day = date.getDate();
    resetItems();
};

/* each day of the week has its own array of items.
 itemsMap stores unchecked items, itemsCheckedMap stores already done (checked) items.
*/

function resetItems() {
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
}

function deleteFromDB() {
   // db.gpsdatas.find({"createdAt" : { $gte : new ISODate("2012-01-12T20:15:31Z") }});
   // { $gte: new Date(dateVar).toISOString() }
    const lastSunday = date.getDateOfLastSunday(new Date());
    console.log("DateOfLastSunday = " + lastSunday);
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
        reloadItems();
        deleteFromDB();
    }
    lastAccessedDay = currentDayOfWeek;
    lastAccessedDate = currentDate;
    resetItems();
    Item.find({}, function(err, foundItems) {
        foundItems.forEach(foundItem => {
            if (foundItem.day === dayOfWeek) {
            let itemOption = {
            itm: foundItem.name,
            id: foundItem._id,
            day: foundItem.day,
            chk: foundItem.chk
        };
        itemsMap.get(dayOfWeek).push(itemOption);
        }
    })
        res.render("list", {
        listTitle: day,
        dayOfWeek: dayOfWeek,
        newListItems: itemsMap,
        itemsCheckedMap: itemsCheckedMap,
    });
    });
});

/* add new item (itemOption) to itemsMap. itemOption is a class which
contains item send from the user and is a text input.
chk:0 means item is unchecked */

app.post("/", function(req, res) {
    let item = req.body.newItem;
    let itemOption = {
        itm: item,
        day: dayOfWeek,
        chk: 0
    };
    if (item.length !== 0) {
        if (item.length <= 300) {
            itemsMap.get(dayOfWeek).push(itemOption);
            const todoItem = new Item ({
                name: itemOption.itm,
                createdOn: new Date(new Date().toISOString().slice(0,10)),
                day: itemOption.day,
                chk: itemOption.chk
            });
            todoItem.save();
        }
    }
    res.redirect("/");
});

// removes an item from itemsCheckedMap
app.post("/onMyClick", function(req, res) {
    let itemNumber = req.body.itemNumber;
    const index = itemsCheckedMap.get(dayOfWeek).indexOf(itemNumber);
    let itemId = req.body.id;
    console.log("itemId = " + itemId);
    Item.updateOne({_id: itemId}, {$set: {chk: 0} }, function(err, res) {
        if (err) throw err;
         console.log("1 item unchecked");
    })
    if (index > -1) {
        itemsCheckedMap.get(dayOfWeek).splice(index, 1);
    }
    res.redirect("/");
});

// adds item to itemsCheckedMap
app.post("/onYourClick", function(req, res) {
    let itemNumber = req.body.itemNumber; 
    let itemId = req.body.id;
    console.log("itemId = " + itemId);
    Item.updateOne({_id: itemId}, {$set: {chk: 1} }, function(err, res) {
        if (err) throw err;
         console.log("1 item checked");
    })
    itemsCheckedMap.get(dayOfWeek).push(itemNumber);
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
