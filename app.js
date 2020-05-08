//jshint: 'esversion 6'

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const app = express();
let items = [];
let itemsChecked = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    let day = date();

    res.render("list", { listTitle: day, kindOfDay: anotherDay, newListItems: items, itemsChecked: itemsChecked });
});

app.post("/", function(req, res) {
    let item = req.body.newItem;
    let itemOption = {
        itm: item,
        chk: 0
    };
    if (item.length !== 0) {
        if (item.length <= 200) {
            items.push(itemOption);
        }
    }
    res.redirect("/");
});

app.post("/onmyclick", function(req, res) {
    let itemnumber = req.body.itemnumber;
    const index = itemsChecked.indexOf(itemnumber);
    if (index > -1) {
        itemsChecked.splice(index, 1);
    }
    res.redirect("/");
});

app.post("/onyourclick", function(req, res) {
    let itemnumber = req.body.itemnumber;
    itemsChecked.push(itemnumber);
    res.redirect("/");
});


app.listen(3000, function(req, res) {
    console.log("Server is running on port 3000.");
});

//send vs.write-> we can only use send once, but write multipy times
// we are rendering a file with res.render inside the list.ejs file inside views, no need to refer to html files