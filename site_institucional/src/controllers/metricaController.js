var metricaModel = require("../models/metricaModel");

function listar(req, res) {
    metricaModel.listar()
        .then(
            function (resultado) {
                console.log(`\nMétricas: ${resultado}`);
                res.json(resultado)
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao listar as métricas! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        )
}

function cadastrar(req, res) {
    let fkMetrica = req.body.fkMetricaServer;
    let idComponente = req.body.idComponenteServer;
    let fkServidor = req.body.fkServidorServer;

    if (fkMetrica == undefined) {
        res.status(400).send("A fkMetrica está undefined!");
    } else if (idComponente == undefined) {
        res.status(400).send("O idComponente está undefined!");
    } else if (fkServidor == undefined) {
        res.status(400).send("O fkServidor está undefined!");
    } else {
        metricaModel.cadastrar(fkMetrica, idComponente, fkServidor).then(function (resposta) {
            res.json(resposta);
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao cadastrar o componente! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
    }

}

module.exports = {
    listar,
    cadastrar
}