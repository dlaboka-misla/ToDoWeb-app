# to-do web-app
Web Application for one user. The user can make To Do List for the current week, Sunday till Saturday. 
The page realoads each week, i.e. the tasks remain and are visible only for the current week.
Cannot edit the task, only check/cross if completed. 
To navigate through the days, click on the curly brackets or left-right arrow keys. 
To enter text, click on the smiley or press enter.

Written in JavaScript using node.js on server side together with several dependencies like express, body-parser, dateformat and ejs template.

To test and use, assuming you've already installed docker, run these commands in the console:

docker pull dalexandra/todolist:latest

docker run -p 3000:3000 -e "TZ=Europe/Amsterdam" -d dalexandra/todolist:latest

for different time zones checkout https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

open browser and type: localhost:3000
