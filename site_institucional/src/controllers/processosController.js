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

function obterProcessos(req, res) {
    var horarioInicio = req.params.horarioInicio;
    var horarioFim = req.params.horarioFim;
  
    if (horarioFim == 'undefined') {
      horarioFim = horarioInicio;
    }
  
    console.log("Obtendo processos entre " + horarioInicio + " e " + horarioFim);
  
    processosModel.obterProcessos(horarioInicio, horarioFim).then(function (resultado) {
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
    deletarProcesso,
    obterProcessos
}