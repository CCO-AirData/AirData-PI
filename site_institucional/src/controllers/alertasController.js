var alertasModel = require("../models/alertasModel");

function receberDadosAlertas(req, res) {
    var fkTorre = req.body.fkTorreServer;

    if (fkTorre == undefined) {
        res.status(400).send("A fkTorre do aeroporto está undefined!");
    } else {
        alertasModel.listar(fkTorre)
            .then(
                function (resultado) {
                    console.log(`\nAlertas: ${resultado}`);
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao receber os alertas! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            )
    }
}

module.exports = {
    receberDadosAlertas
}