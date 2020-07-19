# to-do web-app develop branch
Responsive Web Application for one user.
 
The user can:

 **Register with a username, email and password**. 
note: For user authentication, i use [passport dependency](http://www.passportjs.org/docs/) When registering, i check for valid email and valid password. The password is encrypted (using [bcrypt](https://medium.com/@mridu.sh92/a-quick-guide-for-authentication-using-bcrypt-on-express-nodejs-1d8791bb418f) and express-session requires a secret key, therefore not deployable for testing on docker or heroku atm. 

**Login** to their profile.

Make to-do List for the current week, Sunday till Saturday. The dates follow the current time.
The page reloads each week, i.e. the tasks remain and are visible only for the current week.

**Edit** the task with a click on the paragraph. To input edited text, click on the arrow or press enter.

**Delete** the task by one click on the x image.

**if checked/crossed can not delete or edit the task.**

To navigate through the days, click on the curly brackets or left-right arrow keys. 
To enter text, click on the arrow or press enter.

Written in JavaScript using node.js on server side together with several dependencies.
