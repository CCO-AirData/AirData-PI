var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/medidasController");

//Direcionando para a função medidasGrafico de medidasController.js
router.post("/grafico", function (req, res) {
    empresaController.medidasGrafico(req, res);
})

router.get("/cards-tempo-real/:idMaquina/:metrica", function (req, res) {
    empresaController.medidasCardsTempoReal(req, res);
})

router.get("/getComponentesServidor/:idMaquina", function (req, res) {
    empresaController.getComponentesServidor(req, res);
})

module.exports = router;