var processosModel = require("../models/processosModel");

function receberDadosProcessos(req, res) {
    var fkTorre = req.body.fkTorreServer;
    var limite = req.body.limiteServer;
    var fkServidor = req.body.fkServidorServer

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

function receberDadosProcessosProibidos(req, res) {
    var fkServidor = req.body.fkServidorServer

    if(fkServidor == undefined){
        res.status(400).send("O fkServidor está undefined!");
    } else {
        processosModel.listarProcessosProibidos(fkServidor)
            .then(
                function (resultado) {
                    console.log(`\nProcessos: ${resultado}`);
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao receber os processos proibidos! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            )
    }
}

function deletarProcesso(req, res) {
    var nomeProcesso = req.body.nomeProcessoServer;
    var fkServidor = req.body.fkServidorServer;
    if (nomeProcesso == undefined) {
        res.status(400).send("O nomeProcesso está undefined!");
    } else if (fkServidor == undefined) {
        res.status(400).send("O fkServidor está undefined!");
    } else {
        processosModel.deletarProcesso(nomeProcesso, fkServidor).then(function (resposta) {
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

function proibirProcesso(req, res) {
    var nomeProcesso = req.body.nomeProcessoServer;
    var fkServidor = req.body.fkServidorServer;
    console.log(`Meu amigo nomeProcesso ${nomeProcesso}`)
    console.log(`Meu amigo fkServidor ${fkServidor}`)
    if (nomeProcesso == undefined) {
        res.status(400).send("O nomeProcesso está undefined!");
    } else if (fkServidor == undefined) {
        res.status(400).send("O fkServidor está undefined!");
    } else {
        processosModel.proibirProcesso(nomeProcesso, fkServidor).then(function (resposta) {
            res.json(resposta);
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao proibir o processo! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

    }

}

function normalizarProcesso(req, res) {
    var nomeProcesso = req.body.nomeProcessoServer;
    var fkServidor = req.body.fkServidorServer;
    console.log(`Meu amigo nomeProcesso ${nomeProcesso}`)
    console.log(`Meu amigo fkServidor ${fkServidor}`)
    if (nomeProcesso == undefined) {
        res.status(400).send("O nomeProcesso está undefined!");
    } else if (fkServidor == undefined) {
        res.status(400).send("O fkServidor está undefined!");
    } else {
        processosModel.normalizarProcesso(nomeProcesso, fkServidor).then(function (resposta) {
            res.json(resposta);
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao normalizar o processo! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

    }

}

function obterProcessos(req, res) {
    var horarioInicio = req.params.horarioInicio;
    var horarioFim = req.params.horarioFim;
    var mac = req.params.mac;
  
    if (horarioFim == 'undefined') {
      horarioFim = horarioInicio;
    }
  
    console.log("Obtendo processos entre " + horarioInicio + " e " + horarioFim);
  
    processosModel.obterProcessos(horarioInicio, horarioFim, mac).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
      console.log(erro);
      console.log("\nHouve um erro ao coletar as medidas! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
  }

module.exports = {
    receberDadosProcessos,
    receberDadosProcessosProibidos,
    deletarProcesso,
    proibirProcesso,
    normalizarProcesso,
    obterProcessos
}