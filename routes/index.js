const myController = require("../controllers");
const routes = require("express").Router();

routes.get("/", myController.awesomeFunction);
routes.get("/ttech", myController.tooeleTech);
routes.get("/alex", myController.alexMessage);

module.exports = routes;
