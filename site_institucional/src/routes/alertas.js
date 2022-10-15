var express = require("express");
var router = express.Router();

var alertasController = require("../controllers/alertasController");

router.post("/receberDadosAlertas", function (req, res) {
    alertasController.receberDadosAlertas(req, res);
});

module.exports = router;