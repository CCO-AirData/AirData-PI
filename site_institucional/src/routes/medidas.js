var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/medidasController");

//Direcionando para a função medidasPercentCpuDiskRam de medidasController.js
router.get("/tempo-real/:idMaquina/:metrica/:limite", function (req, res) {
    empresaController.medidasPercentCpuDiskRam(req, res);
})


module.exports = router;