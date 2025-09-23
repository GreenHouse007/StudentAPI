const routes = require("express").Router();
const myController = require("../controllers");

routes.get("/", myController.awesomeFunction);
routes.get("/ttech", myController.tooeleTechFunction);
routes.get("/students", myController.getAllStudents);

module.exports = routes;
