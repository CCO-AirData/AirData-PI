const medidasModel = require("../models/medidasModel");
const rls = require('ml-regression-multivariate-linear')


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
    var nomeComponente = req.params.nomeComponente;
    var nomeMetrica = req.params.nomeMetrica;
    const limite = 1;
    
    if (idMaquina == null || idMaquina == undefined){
        res.status(400).send("O idMaquina está undefined");
    } else  if (metrica == null || metrica == undefined){
        res.status(400).send("A metrica está undefined");
    } else {
        medidasModel.medidasCardsTempoReal(idMaquina, metrica, nomeComponente, nomeMetrica, limite).then(function (resultado) {
            if (resultado.length > 0) {
                // console.log('resposta',resultado)
                res.json(resultado);
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
    var idComponente = req.params.idComponente;
    var idMetrica = req.params.idMetrica;
    var mes = req.params.mes;
    
    if (idMaquina == null || idMaquina == undefined){
        res.status(400).send("O idMaquina está undefined");
    } else  if (metrica == null || metrica == undefined){
        res.status(400).send("A metrica está undefined");
    } else  if (idMetrica == null || idMetrica == undefined){
        res.status(400).send("A ID metrica está undefined");
    } else if (mes == null || mes == undefined){
        res.status(400).send("O mês está undefined");
    } else {
        medidasModel.medidasGraficoTempoReal(idMaquina, metrica, idComponente, idMetrica, mes)
        .then(function (resultado) {
            if (resultado.length > 0) {
                console.log(resultado)
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!")
            }
        }).catch(function (error) {
            console.log(error);
            console.log("\nHouve um erro ao coletar as medidas! Erro: ", error.sqlMessage);
            res.status(500).json(error.sqlMessage);
        });
    }
}

function getDadosAnalytics(req, res) {
    var idServidor = req.params.idServidor;
    var idTorre = req.params.idTorre;
    var idComponente = req.params.idComponente;
    var mesAtual = req.params.mes;
    var mesAnterior = mesAtual - 1;
    var idMetrica = req.params.idMetrica;


    if(idServidor == null || idServidor == undefined) {
        res.status(400).send("O idServidor está undefined");
    } else if(idTorre == null || idTorre == undefined) {
        res.status(400).send("O idTore está undefined");
    } else if(idComponente == null || idComponente == undefined) {
        res.status(400).send("O idComponente está undefined");
    } else if(mesAtual == null || mesAtual == undefined) {
        res.status(400).send("O mesAtual está undefined");
    } else if(mesAnterior == null || mesAnterior == undefined) {
        res.status(400).send("O mesAnterior está undefined");
    } else if(idMetrica == null || idMetrica == undefined) {
        res.status(400).send("O idMetrica está undefined");
    } else {
        medidasModel.getDadosAnalytics(idTorre, idServidor, idComponente, mesAtual, mesAnterior, idMetrica)
            .then(function (response) {
                if(response.length > 0) {
                    console.log(response)
                    res.status(200).json(response)
                } else {
                    res.status(204).send("Nenhum resultado encontrado!")
                }
            }).catch(function(error) {
                console.log(error);
                console.log("\nHouve um erro ao coletar os dados! Erro: ", error.sqlMessage);
                res.status(500).json(error.sqlMessage)
            })
    }
}

function getPredict(req, res) {
    var idServidor = req.params.idServidor;
    var idTorre = req.params.idTorre;
    var idComponente = req.params.idComponente;
    var mesAtual = parseInt(req.params.mes) + 1;
    var idMetrica = req.params.idMetrica;

    console.log(mesAtual)

    if(idServidor == null || idServidor == undefined) {
        res.status(400).send("O idServidor está undefined");
    } else if(idTorre == null || idTorre == undefined) {
        res.status(400).send("O idTore está undefined");
    } else if(idComponente == null || idComponente == undefined) {
        res.status(400).send("O idComponente está undefined");
    } else if(mesAtual == null || mesAtual == undefined) {
        res.status(400).send("O mesAtual está undefined");
    } else if(idMetrica == null || idMetrica == undefined) {
        res.status(400).send("O idMetrica está undefined");
    } else {
        medidasModel.getTodasAsMediasPorMes(idTorre, idServidor, idComponente, idMetrica, mesAtual)
            .then(function (response) {
                if(response.length > 0) {

                    console.log(response)

                    var dados = []
                    var meses = []
                    
                    for(var i = 0; i < response.length; i++){
                        var dadoAtual = parseFloat(response[i].media);
                        dados.push([dadoAtual]);
                        meses.push([i])
                    };            
                    
                    const regressao = new rls(meses, dados)

                    res.status(200).json(regressao.predict([dados.length + 1]));                
                } else {
                    res.status(204).send("Nenhum resultado encontrado!")
                }
            }).catch(function(error) {
                console.log(error);
                console.log("\nHouve um erro ao coletar os dados! Erro: ", error.sqlMessage);
                res.status(500).json(error.sqlMessage)
            })
    }
}

function pegarDadosGrafico(req, res) {
    mac = req.params.mac;

    medidasModel.pegarDadosGrafico(mac).then(function (resultado) {
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao coletar as medidas! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


module.exports = {
    getComponentesServidor,
    medidasCardsTempoReal,
    medidasGraficoTempoReal,
    getDadosAnalytics,
    getPredict,
    pegarDadosGrafico
}