const express = require("express");
const router = express.Router();
// ! require users db helper functions here
//fetchUserNameById(userId)
//verifyEmail(email) - check if an email exists
//verifyUsername(username) - check if a userName exists
//addUser(newUser)
//getQuizzesByUserId(userId)

/*
  List of users Routes/Endpoints:
  1 - GET /users/new -> Display the registration form
  2 - POST /users -> Creates a new user and is pushed to the db
  3 - GET /users/:userId/quizzes -> List all quizzes associated with a userId (public & private)
  Stretch:
  4 - DELETE /users/:userId/quizzes/quiz:id -> switch is_active to false (soft delete)

*/

module.exports = (db) => {
  //Route 1 - GET /users/new
  router.get("/new", (req, res) => {
    //Need to capture the userId as it will be needed for our partial ejs templates so that the logged in userName stays visible across all tabs
    //const userId = req.session.userId
    //const userName = fetchUsername(userId)
    //const templateVars = {userId}
    //res.render("register.ejs", templateVars)

    const userId = req.session && req.session.userId;

    // ! add conditionals on who can see this page i.e. if user alrdy logged in etc.
    fetchUsernameById(userId) // ! discuss the cookie issue
      .then((response) => {
        const userName = response;
        const templateVars = { userName };
        res.render("./pages/register.ejs", templateVars); // Remove templatevars - not necessary
      })
      .catch((error) => {
        console.log(error);
      });
  });

  //Route 2 - POST /users
  router.post("/", (req, res) => {
    //const {username, email, password} = req.body; data from the form
    //Check if the email, user or password fields are empty & notify the user
    //if(!email || !password || !username) return res.status(400).send("Invalid email address, username or password")
    //if(verify(email)) return res.status(400).send("Email address already exists")
    //if(verifyUserName(userName)) return res.status(400).send("Username already exists")
    //password = bcrypt.hashSync(password, 12);  encrypt user's password
    //newUser = {userName, email, password}
    //addUser(newUser) function
    //req.session.userId = user.id --> In the .then() - setup the cookie
    //remember to include a .catch for all your db calls in all your functions
    // ? Setup a delicious cookie ->Need to discuss various approach to this. I need to know the id of last user in db so I can increment or user Username for cookies in this app (not ideal)
    //redirect to GET /quizzes
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .send("Empty email address, username and/or password field");
    }
    //verifyEmail will check whether an email exists in the db or not
    verifyEmail(email)
      .then((response) => {
        if (!response) {
          return res.status(400).send("Email address already exists");
        }
        //VerifyUsername will check whether a userName exists in the db or not
        verifyUsername(username).then((response) => {
          if (!response) {
            return res.status(400).send("Username address already exists");
          }
          const newUser = {
            email,
            username,
            password: bcrypt.hashSync(password, 10),
          };
          addUser(newUser).then((response) => {
            req.session.userId = userId; // ! We need to define what we setup for a cookie i.e. the userId only or whole user object? instead of userId use user? would make life easier in some situations.
            res.status(302).redirect("/quizzes");
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });

  //Route 3 - GET /:userId/quizzes
  router.get("/:userId/quizzes", (req, res) => {
    //A user needs to be logged in in order to have access to this section
    //const userId = req.session.userId else redirect to the login page
    //getQuizzesByUserId(userId);
    //Need to capture the response & send it back to FE as an array of personal quizzes
    // res.render("myquizzes.ejs", templateVars);

    const userId = req.session && req.session.userId;
    if (!userId) {
      return res.redirect("/sessions/new");
    }
    getQuizzesByUserId(userId)
      .then((response) => {
        const myQuizzes = response;
        const templateVars = { myQuizzes, userId };
        res.render("./pages/myquizzes.ejs", templateVars); // ! userName, myQuizzes
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return router;
};
