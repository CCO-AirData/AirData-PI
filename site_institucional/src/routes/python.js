var express = require("express");
var router = express.Router();
var pythonController = require("../controllers/pythonController");


router.post("/graficoR", function (req, res) {
    pythonController.iniciar(req, res);
});

router.post("/wordcloudProcessos", function (req, res) {
    pythonController.wordcloudProcessos(req, res);
})

module.exports = router;