var express = require("express");
var router = express.Router();

var regressaoController = require('../controllers/regressaoController');

router.get("/get-rls/:temp&:rpm", function (req, res) {
  regressaoController.lm(req, res);
});

module.exports = router;