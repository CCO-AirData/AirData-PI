var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/medidasController");

//Direcionando para a função medidasGraficoTempoReal de medidasController.js
router.get("/grafico-tempo-real/:idMaquina/:metrica/:limite", function (req, res) {
    empresaController.medidasGraficoTempoReal(req, res);
})

router.get("/cards-tempo-real/:idMaquina/:metrica", function (req, res) {
    empresaController.medidasCardsTempoReal(req, res);
})

module.exports = router;