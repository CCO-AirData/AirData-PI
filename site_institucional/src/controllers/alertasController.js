var alertasModel = require("../models/alertasModel");

function receberDadosAlertas(req, res) {
    var fkTorre = req.body.fkTorreServer;
    var limite = req.body.limiteServer;

    if (fkTorre == undefined) {
        res.status(400).send("A fkTorre do aeroporto está undefined!");
    } else {
        alertasModel.listarAlertas(fkTorre, limite)
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

function receberOpcoesFiltros(req, res) {
    var fkTorre = req.body.fkTorreServer;

    if (fkTorre == undefined) {
        res.status(400).send("A fkTorre do aeroporto está undefined!");
    } else {
        alertasModel.listarFiltros(fkTorre)
            .then(
                function (resultado) {
                    console.log(`\nFiltros: ${resultado}`);
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

function receberDadosFiltro(req, res) {
    var fkTorre = req.body.fkTorreServer;
    var limite = req.body.limiteServer;
    var hardware = req.body.hardwareServer;
    var maquina = req.body.maquinaServer;

    if (fkTorre == undefined) {
        res.status(400).send("A fkTorre do aeroporto está undefined!");
    } else if (hardware == undefined) {
        res.status(400).send("O hardware está undefined!");
    } else if (maquina == undefined) {
        res.status(400).send("A máquina está undefined!");
    } else if (hardware == 'null' && maquina == 'null') {
        alertasModel.listarAlertas(fkTorre, 10)
            .then(
                function (resultado) {
                    console.log(`\nAlertas: ${resultado}`);
                    res.json(false);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao receber os alertas! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            )
    } else {
        alertasModel.listarAlertasFiltrados(fkTorre, limite, hardware, maquina)
            .then(
                function (resultado) {
                    console.log(`\nAlertas: ${resultado}`);
                    res.json(resultado);
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

function listarRecentes(req, res) {
    let fkTorre = req.body.fkTorreServer;

    if (fkTorre == undefined) {
        res.status(400).send("A fkTorre da torre está undefined!");
    } else {
        alertasModel.listarRecentes(fkTorre).then(
            function (resultado) {
                console.log(`\nAlertas recentes encontrados: ${resultado}`);
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao receber os alertas recentes! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
    }
}

module.exports = {
    receberDadosAlertas,
    receberOpcoesFiltros,
    receberDadosFiltro,
    listarRecentes
}