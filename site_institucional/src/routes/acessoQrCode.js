var express = require("express");
var router = express.Router();

var acessoQrCodeController = require("../controllers/acessoQrCodeController");

router.post("/listarAcessosQrCode", function (req, res) {
    acessoQrCodeController.listarAcessos(req, res);
});

router.post("/setNotificado", function (req, res) {
    acessoQrCodeController.setNotificado(req, res);
});

router.post("/cadastrarAcesso", function (req, res) {
    acessoQrCodeController.cadastrarAcesso(req, res);
});

module.exports = router;