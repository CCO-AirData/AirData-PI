var maquinaModel = require("../models/maquinaModel");

function cadastrarComponente(req, res) {
    let fkServidor = req.body.fkServidorServer;
    let tipoComponente = req.body.tipoComponenteServer;
    let nomeComponente = req.body.nomeComponenteServer;
    let memoria = req.body.memoriaServer;
    let tipoMemoria = req.body.tipoMemoriaServer;

    if (fkServidor == undefined) {
        res.status(400).send("A fkServidor está undefined!");
    } else if (tipoComponente == undefined) {
        res.status(400).send("O tipoComponente está undefined!");
    } else if(nomeComponente == undefined) {
        res.status(400).send("O nomeComponente está undefined!")
    } else if (memoria == undefined) {
        res.status(400).send("A memória está undefined!");
    } else if (tipoMemoria == undefined) {
        res.status(400).send("O tipoMemoria está undefined!");
    } else {
        memoria = memoria == "" ? "null" : memoria;
        tipoMemoria = tipoMemoria == "" ? "null" : tipoMemoria;

        maquinaModel.cadastrarComponente(fkServidor, tipoComponente, nomeComponente, memoria, tipoMemoria).then(function (resposta) {
            res.json(resposta)
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao cadastrar o componente! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        )
    }
}

function getComponente(req, res){
    const idComponente = req.body.idComponenteServer;
    const fkServidor = req.body.fkServidorServer;

    if(idComponente == undefined){
        res.status(400).send("O idComponente está undefined!");
    } else if (fkServidor == undefined){
        res.status(400).send("A fkServidor está undefined!");
    } else {
        maquinaModel.getComponente(idComponente, fkServidor).then(function (resposta) {
            res.json(resposta)
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar os dados do componente! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        )
    }
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

function deletar(req, res) {
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
    getComponente,
    listar,
    deletar
}