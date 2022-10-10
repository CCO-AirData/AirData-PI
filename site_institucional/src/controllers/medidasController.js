var medidasModel = require("../models/medidasModel");


function medidasPercentCpuDiskRam(req, res) {
    idMaquina = req.params.idMaquina
    metrica = req.params.metrica
    limite = req.params.limite

    if (idMaquina == null || idMaquina == undefined){
        res.status(400).send("O idMaquina está undefined");
    } else  if (metrica == null || metrica == undefined){
        res.status(400).send("A metrica está undefined");
    } else  if (limite == null || limite == undefined){
        res.status(400).send("O limite está undefined");
    } else {
        medidasModel.medidasPercentCpuDiskRam(idMaquina, metrica, limite).then(function (resultado) {
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