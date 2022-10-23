var express = require("express");
var router = express.Router();

var alertasController = require("../controllers/alertasController");

router.post("/receberDadosAlertas", function (req, res) {
    alertasController.receberDadosAlertas(req, res);
});

router.post("/receberOpcoesFiltros", function (req, res) {
    alertasController.receberOpcoesFiltros(req, res);
});

router.post("/receberDadosFiltro", function (req, res) {
    alertasController.receberDadosFiltro(req, res);
});

router.post("/listarRecentes", function (req, res) {
    alertasController.listarRecentes(req, res);
});


module.exports = router;