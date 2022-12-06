var express = require("express");
var router = express.Router();

var pythonController = require("../controllers/pythonController");

router.post("/graficoR", function (req, res) {
    console.log("To na rota")
    pythonController.iniciar(req, res);
});

module.exports = router;