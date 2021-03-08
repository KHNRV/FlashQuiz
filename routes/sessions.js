const express = require("express");
const router = express.Router();
// ! require sessions db helper functions here
// ! require cookie session npm package here

/*
  List of sessions Routes/Endpoints:
  1 - GET /sessions/new -> Displays the Login page
  2 - POST /sessions -> Creates a new session (i.e. logged in)
  3 - DELETE / sessions -> Deletes the current session (i.e.) - will use method override for this.

  NOTE: We could remove the "s" from sessions
  as there will never be more than a 'session'
  at a time for a user. I left it for consistency reasons
  in relation to the restful convention
*/

module.exports = (db) => {
  // Route 1 - GET /sessions/new
  router.get("/", (req, res) => {});
  return router;
};
