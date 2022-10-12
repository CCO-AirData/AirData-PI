var maquinaModel = require("../models/maquinaModel");

function cadastrarComponente(req, res) {

}

function listar(req, res) {
    var fkTorre = req.body.fkTorreServer;

    if (fkTorre == undefined) {
        res.status(400).send("A fkTorre do aeroporto está undefined!");
    } else {
        maquinaModel.listar(fkTorre)
            .then(
                function (resultado) {
                    console.log(`\nMáquinas: ${resultado}`);
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao listar as máquinas! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            )
    }
}

function deletar (req, res) {
    var mac = req.body.macServer;

    if (mac == undefined) {
        res.status(400).send("O mac da máquina está undefined!");
    } else {
        maquinaModel.deletar(mac)
            .then(
                function (resultado) {
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao deletar a máquina! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);                   
                }
            )
    }
}

module.exports = {
    cadastrarComponente,
    listar,
    deletar
}