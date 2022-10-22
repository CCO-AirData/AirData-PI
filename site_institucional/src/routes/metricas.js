var express = require("express");
var router = express.Router();

var metricaController = require("../controllers/metricaController");

router.post("/listarComponentes", function (req, res) {
    metricaController.listar(req, res);
});

router.post("/listarOpcoesComponentes", function (req, res) {
    metricaController.listarOpcoesComponentes(req, res);
});

router.post("/cadastrar", function (req, res) {
    metricaController.cadastrar(req, res);
});

router.post("/deletar", function (req, res) {
    metricaController.deletarComponente(req, res);
});

module.exports = router;