let acessoQrCodeModel = require("../models/acessoQrCodeModel");

function listarAcessos(req, res) {
    let idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).send("listarAcessos(): A idUsuario está undefined!");
    } else {
        acessoQrCodeModel.listarAcessos(idUsuario).then(function (resposta) {
            res.json(resposta)
        }).catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao listar os acessos por QR Code! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        })
    }
}

function setNotificado(req, res) {
    let idAcesso = req.body.idAcessoServer;

    if (idAcesso == undefined) {
        res.status(400).send("setNotificado(): A idAcesso está undefined!");
    } else {
        acessoQrCodeModel.setNotificado(idAcesso).then(function (resposta) {
            res.json(resposta);
        }).catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao dar como notificado o acesso por QR Code! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        })
    }
}

function cadastrarAcesso(req, res) {
    let idUsuario = req.body.idUsuarioServer;
    let idMaquina = req.body.idMaquinaServer;

    if(idUsuario == undefined){
        res.status(400).send("cadastrarAcesso(): A idUsuario está undefined!");
    } else if(idMaquina == undefined){
        res.status(400).send("cadastrarAcesso(): A idMaquina está undefined!");
    } else {
        acessoQrCodeModel.cadastrarAcesso(idUsuario, idMaquina).then(function (resposta) {
            res.json(resposta);
        }).catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao cadastrar o acesso por QR Code! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        })
    }
}

module.exports = {
    listarAcessos,
    setNotificado,
    cadastrarAcesso
}