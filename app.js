if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const bcrypt = require("bcrypt")
const app = express()
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")

const initializePassport = require("./passport-config")
initializePassport(
  passport,
  name => users.find(user => user.name === name),
  id => users.find(user => user.id === id)
)

app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))
app.use(express.static("public"))

const users = []
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

app.get("/", checkAuthenticated, (req, res) => {
  res.redirect("/index")
})

app.get("/index", checkAuthenticated, function(req, res) {
    currentDayOfWeek = new Date().getDay();
    let currentDate = new Date();
    if (lastAccessedDay === -1 ||
        (lastAccessedDay > currentDayOfWeek) ||
        (date.getDateDiff(currentDate, lastAccessedDate) >= 7)) {
        reloadItems();
    }
    lastAccessedDay = currentDayOfWeek;
    lastAccessedDate = currentDate;
    res.render("index.ejs", {
        name: req.user.name,
        listTitle: day,
        dayOfWeek: dayOfWeek,
        newListItems: itemsMap,
        itemsCheckedMap: itemsCheckedMap,
    });
});

app.post("/index", function(req, res) {
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
    res.redirect("/index");
});

app.post("/onMyClick", function(req, res) {
    let itemNumber = req.body.itemNumber;
    const index = itemsCheckedMap.get(dayOfWeek).indexOf(itemNumber);
    if (index > -1) {
        itemsCheckedMap.get(dayOfWeek).splice(index, 1);
    }
    res.redirect("/index");
});

app.post("/onYourClick", function(req, res) {
    let itemNumber = req.body.itemNumber;
    itemsCheckedMap.get(dayOfWeek).push(itemNumber);
    res.redirect("/index");
});

app.post("/editInput", function(req, res) {
    const itemNumber = req.body.itemNumber;
    const itemText = req.body.itemText;
    const index = Number(itemNumber);
    itemsMap.get(dayOfWeek)[index].itm = itemText;
    res.redirect("/index");
});

app.post("/deleteItem", function(req, res) {
    const itemNumber = req.body.itemNumber;
    const index = Number(itemNumber);
    itemsMap.get(dayOfWeek).splice(index, 1);
    res.redirect("/index");
});

app.post("/posts/:day/:type", function(req, res) {
    let currentDay = req.params.day;
    let type = req.params.type;
    dayOfWeek = date.getDayByType(currentDay, type);
    day = date.postTitleDays(currentDayOfWeek, dayOfWeek);
    res.redirect("/index");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs")
})

app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/index",
  failureRedirect: "/login",
  failureFlash: true
}))

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs")
})

app.post("/register", checkNotAuthenticated, async (req, res) => {
  if(!date.isValidPassword(req.body.password, req.body.name)) {
    res.render("register.ejs", {
      error: 'The password must be less than 8 characters, without spaces and to not contain the username.'
    })
  } else if (!date.isValidEmail(req.body.email)) {
      res.render("register.ejs", {
      error: 'The email is invalid. Please try again.'
    })
  } else {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect("/login")
    } catch {
      res.redirect("/register")
    }
  }
})

app.delete("/logout", (req, res) => {
  req.logOut()
  res.redirect("/login")
})

function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

function checkNotAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/index")
  }
  next()
}

app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("Server is running on port 3000.");
});
