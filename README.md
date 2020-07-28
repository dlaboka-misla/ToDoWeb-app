# to-do web app
Responsive Web Application for one user. The user can make to-do list for the current week, Sunday till Saturday.

The page reloads each week, i.e. the tasks remain and are visible only for the current week.

The dates follow the current time.

Cannot edit the task, only check/cross if completed.

To navigate through the days, click on the curly brackets or up arrow key (to go forward in the week) and down arrow key(to return to previous day).

To enter text, click on the arrow or press enter.

Written in JavaScript using **Node.js** on server side and **MongoDB** as database, together with several dependencies like express, body-parser, dateformat, ejs template and mongoose.

If you want to use my todolist locally on your machine, you need to have installed **docker** and **docker-compose**. 

Then, run these commands in the terminal:

* mkdir todo
* cd todo
* vim docker-compose.yml and copy paste this code:

```
version: "3"
services:
  app:
    restart: always
    image: dalexandra/todolist-mongodb
    ports:
      - "8080:8080"
    depends_on:
      - mongo
  mongo:
    restart: always
    image: mongo
    ports:
      - "27018:27017"
```
* save the docker-compose.yml file
* while inside the todo folder, type: docker-compose up
* open browser and type: localhost:8080

The awesome thing about docker is that you don't need to have nodejs or mongoDB installed on your machine.

Another awesome thing, if you add data inside the app, and restart your machine, open the browser on localhost:8080 your data remains. At least until upcoming Saturday :)

Have fun planning your todos!
