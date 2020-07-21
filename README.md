# to-do web-app develop branch
Responsive Web Application for multiple users.
 
The users can:

 **Register with a username, email and password** The app uses [passport dependency](http://www.passportjs.org/docs/), checks for valid email and valid password. The password is encrypted using [bcrypt](https://medium.com/@mridu.sh92/a-quick-guide-for-authentication-using-bcrypt-on-express-nodejs-1d8791bb418f).

**Login** to their profile.

Make to-do list for the current week, Sunday till Saturday. The dates follow the current time.

note: The tasks don't remain and are not visible for the current week as the web-app for ONE USER on master branch. For that, I either need to create another (nested) map for each user which will increase the complexity of app or use a database.

**Edit** the task with a click on the paragraph. To input edited text, click on the arrow or press enter.

**Delete** the task with a click on the delete-icon, x image.

**If checked/crossed can not delete or edit the task.**

To navigate through the days, click on the curly brackets or left-right arrow keys. 
To enter text, click on the arrow or press enter.

Written in JavaScript using node.js on server side together with several dependencies.

Deployed on heroku with the 'secret key' just for testing purposes. You can visit and test the project at: 

https://sleepy-meadow-66502.herokuapp.com/

advice: register/login with fake email (there is no verification for email).
