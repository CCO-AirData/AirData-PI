var express = require("express");
var router = express.Router();

var medidasController = require("../controllers/medidasController");

//Direcionando para a função medidasGrafico de medidasController.js
router.get("/cards-tempo-real/:idMaquina/:metrica", function (req, res) {
    medidasController.medidasCardsTempoReal(req, res);
})

router.get("/grafico-tempo-real/:idMaquina/:metrica/:limite/:idComponente", function (req, res) {
    medidasController.medidasGraficoTempoReal(req, res);
})

router.get("/getComponentesServidor/:idMaquina", function (req, res) {
    medidasController.getComponentesServidor(req, res);
})

module.exports = router;