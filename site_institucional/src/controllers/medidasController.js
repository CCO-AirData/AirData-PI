var medidasModel = require("../models/medidasModel");

function getComponentesServidor(req, res) {
    var idMaquina = req.params.idMaquina

    if (idMaquina == null || idMaquina == undefined){
        res.status(400).send("O idMaquina está undefined");
    } else {
        medidasModel.getComponentesServidor(idMaquina).then(function (resultado) {
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
}

function medidasCardsTempoReal(req, res) {
    var idMaquina = req.params.idMaquina;
    var metrica = req.params.metrica;
    const limite = 1;
    
    if (idMaquina == null || idMaquina == undefined){
        res.status(400).send("O idMaquina está undefined");
    } else  if (metrica == null || metrica == undefined){
        res.status(400).send("A metrica está undefined");
    } else {
        medidasModel.medidasCardsTempoReal(idMaquina, metrica, limite).then(function (resultado) {
            if (resultado.length > 0) {
                console.log('resposta',resultado)
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
}

function medidasGraficoTempoReal(req, res) {
    var idMaquina = req.params.idMaquina;
    var metrica = req.params.metrica;
    var limite = req.params.limite;
    var idComponente = req.params.idComponente;

    console.log(idComponente)
    
    if (idMaquina == null || idMaquina == undefined){
        res.status(400).send("O idMaquina está undefined");
    } else  if (metrica == null || metrica == undefined){
        res.status(400).send("A metrica está undefined");
    } else if (limite == null || metrica == undefined){
        res.status(400).send("O limite está undefined");
    } else {
        medidasModel.medidasGraficoTempoReal(idMaquina, metrica, limite, idComponente).then(function (resultado) {
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
}


module.exports = {
    getComponentesServidor,
    medidasCardsTempoReal,
    medidasGraficoTempoReal
}