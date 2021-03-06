module.exports = app => {
  const users = require("../controllers/usersController");
  var router = require("express").Router();

  router.post("/signup", users.signup);
  router.post("/login", users.logIn);
  router.get("/", users.findAll);
  router.get("/:id", users.findOne);
  router.put("/:id", users.update);
  router.delete("/:id", users.delete);
  router.delete("/", users.deleteAll);
  
  app.use('/api/users', router);
};
