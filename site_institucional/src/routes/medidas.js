var express = require("express");
var router = express.Router();

var medidasController = require("../controllers/medidasController");

//Direcionando para a função medidasGrafico de medidasController.js
router.get("/cards-tempo-real/:idMaquina&:metrica&:nomeComponente&:nomeMetrica", function (req, res) {
    medidasController.medidasCardsTempoReal(req, res);
})

router.get("/grafico-tempo-real/:idMaquina/:metrica/:idComponente/:idMetrica/:mes", function (req, res) {
    medidasController.medidasGraficoTempoReal(req, res);
})

router.get("/getComponentesServidor/:idMaquina", function (req, res) {
    medidasController.getComponentesServidor(req, res);
})

router.get("/getDadosAnalytics/:idTorre/:idServidor/:idComponente/:idMetrica/:mes", function (req, res) {
    medidasController.getDadosAnalytics(req, res);
})

router.get("/predict/:idTorre&:idServidor&:idComponente&:idMetrica&:mes", function (req, res) {
    medidasController.getPredict(req, res);
})

module.exports = router;