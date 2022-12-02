var express = require("express");
var router = express.Router();
var pythonController = require("../controllers/pythonController");


router.post("/graficoR", function (req, res) {
    pythonController.iniciar(req, res);
})


module.exports = router;