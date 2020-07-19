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

/* each day of the week has its own array of items.
 itemsMap stores unchecked items, itemsCheckedMap stores already done (checked) items. 
 */
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

    // makes sure the span of days is in the range of Sunday to Saturday
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

/* add new item (itemOption) to itemsMap. itemOption is a class which 
contains item which is send from the client and is a text input. chk:0 means item is unchecked */

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

// removes an item from itemsCheckedMap

app.post("/uncheckItem", function(req, res) {
    let itemNumber = req.body.itemNumber;
    const index = itemsCheckedMap.get(dayOfWeek).indexOf(itemNumber);
    if (index > -1) {
        itemsCheckedMap.get(dayOfWeek).splice(index, 1);
    }
    res.redirect("/index");
});

// adds item to itemsCheckedMap

app.post("/checkItem", function(req, res) {
    let itemNumber = req.body.itemNumber;
    itemsCheckedMap.get(dayOfWeek).push(itemNumber);
    res.redirect("/index");
});

// changes the value of the item in itemsMap (edits only if its unchecked)

app.post("/editInput", function(req, res) {
    const itemNumber = req.body.itemNumber;
    const itemText = req.body.itemText;
    const index = Number(itemNumber);
    itemsMap.get(dayOfWeek)[index].itm = itemText;
    res.redirect("/index");
});

// removes the item in itemsMap (deletes only if its unchecked)

app.post("/deleteItem", function(req, res) {
    const itemNumber = req.body.itemNumber;
    const index = Number(itemNumber);
    itemsMap.get(dayOfWeek).splice(index, 1);
    res.redirect("/index");
});

/* is called when curly bracket is clicked or arrow key is pressed 
  and changes the title of the week */

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

/* when user tries to login, an authetication process is performed,
and if he/she is or not registered will be redirected either to index or login page */

app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/index",
  failureRedirect: "/login",
  failureFlash: true  // flash messages are used with express-flash in order to display status information to the user.
}))

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs")
})

/* when user tries to register, we check for valid password and valid email.
if everything is ok, we hash the password with bcrypt and depending on their input, 
we redirect him/her either to register or login page */

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
