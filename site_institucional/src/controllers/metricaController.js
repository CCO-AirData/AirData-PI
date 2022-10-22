var metricaModel = require("../models/metricaModel");

function listar(req, res) {
    var fkServidor = req.body.fkServidorServer
    console.log(fkServidor)
    if (fkServidor == undefined) {
        res.status(400).send("A fkServidor está undefined!");
    } else {
        metricaModel.listar(fkServidor)
            .then(
                function (resultado) {
                    console.log(`\nComponentes: ${resultado}`);
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao listar os Componentes! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            )
    }
}

function listarOpcoesComponentes(req, res) {
        nomeComponente = req.body.nomeComponenteServer;

        if(nomeComponente == undefined) {
            metricaModel.listarOpcoesComponentes()
            .then(
                function (resultado) {
                    console.log(`\nOpções de Componentes: ${resultado}`);
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao listar as opções de Componentes! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            )
        } else {
            metricaModel.listarOpcoesParametro(nomeComponente)
            .then(
                function (resultado) {
                    console.log(`\nOpções de Componentes: ${resultado}`);
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao listar as opções de Componentes! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            )
        }
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

function deletarComponente(req, res) {
    let idComponente = req.body.idComponenteServer;

    if (idComponente == undefined) {
        res.status(400).send("O idComponente está undefined!");
    } else {
        metricaModel.deletar(idComponente).then(function (resposta) {
            res.json(resposta);
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao deletar o componente! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

    }

}

module.exports = {
    listar,
    listarOpcoesComponentes,
    cadastrar,
    deletarComponente
}