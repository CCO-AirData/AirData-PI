var medidasModel = require("../models/medidasModel");


function medidasPercentCpuDiskRam(req, res) {
    idMaquina = req.params.idMaquina

    if (idMaquina == null || idMaquina == undefined){
        res.status(400).send("O idMaquina está undefined");
    } else {
        medidasModel.medidasPercentCpuDiskRam(idMaquina).then(function (resultado) {
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
    medidasPercentCpuDiskRam
}