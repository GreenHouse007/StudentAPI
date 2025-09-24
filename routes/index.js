const routes = require("express").Router();
const myController = require("../controllers");

routes.get("/", myController.awesomeFunction);
routes.get("/ttech", myController.tooeleTechFunction);
routes.use("/students", require("./students"));
routes.use("/auth", require("./auth"));

module.exports = routes;
