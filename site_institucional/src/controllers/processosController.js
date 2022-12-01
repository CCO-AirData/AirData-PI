var processosModel = require("../models/processosModel");

function receberDadosProcessos(req, res) {
    var fkTorre = req.body.fkTorreServer;
    var limite = req.body.limiteServer;
    var fkServidor = req.body.fkTorreServer

    if (fkTorre == undefined) {
        res.status(400).send("A fkTorre do aeroporto está undefined!");
    } else if(fkServidor == undefined){
        res.status(400).send("O fkServidor está undefined!");
    }
    else {
        processosModel.listarProcessos(fkTorre, limite, fkServidor)
            .then(
                function (resultado) {
                    console.log(`\nProcessos: ${resultado}`);
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao receber os processos! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            )
    }
}

function deletarProcesso(req, res) {
    let pid = req.body.pidServer;
    console.log(`Meu amigo pid ${pid}`)
    if (pid == undefined) {
        res.status(400).send("O pid está undefined!");
    } else {
        processosModel.deletarProcesso(pid).then(function (resposta) {
            res.json(resposta);
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao deletar o processo! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

    }

}

module.exports = {
    receberDadosProcessos,
    deletarProcesso
}