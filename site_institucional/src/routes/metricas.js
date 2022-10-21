var express = require("express");
var router = express.Router();

var metricaController = require("../controllers/metricaController");

router.post("/listar", function (req, res) {
    metricaController.listar(req, res);
});

router.post("/cadastrar", function (req, res) {
    metricaController.cadastrar(req, res);
});

module.exports = router;