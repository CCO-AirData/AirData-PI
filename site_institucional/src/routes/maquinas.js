var express = require("express");
var router = express.Router();

var maquinaController = require("../controllers/maquinaController");

router.post("/cadastrarComponente", function (req, res) {
    maquinaController.cadastrarComponente(req, res);
});

router.post("/getComponente", function (req, res) {
    maquinaController.getComponente(req, res);
});

router.post("/listar", function (req, res) {
    maquinaController.listar(req, res);
});

router.post("/listarComEstado", function (req, res) {
    maquinaController.listarComEstado(req, res);
});

router.post("/listarMaiorUsoCpu", function (req, res) {
    maquinaController.listarMaiorUsoCpu(req, res);
});

router.post("/deletar", function (req, res) {
    maquinaController.deletar(req, res);
});

module.exports = router;