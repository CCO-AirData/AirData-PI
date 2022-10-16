var empresaModel = require("../models/empresaModel");
var aeroportoModel = require("../models/aeroportoModel");
var usuarioModel = require("../models/usuarioModel");
var sha512 = require('js-sha512');

function cadastrar(req, res) {
    var nomeEmpresa = req.body.nomeEmpresaServer;
    var cnpjEmpresa = req.body.cnpjEmpresaServer;
    var telefoneEmpresa = req.body.telefoneEmpresaServer;
    var nomeAeroporto = req.body.nomeAeroportoServer;
    var cepAeroporto = req.body.cepAeroportoServer;
    var cidadeAeroporto = req.body.cidadeAeroportoServer;
    var bairroAeroporto = req.body.bairroAeroportoServer;
    var ruaAeroporto = req.body.ruaAeroportoServer;
    var ufAeroporto = req.body.ufAeroportoServer;
    var numeroAeroporto = req.body.numeroAeroportoServer;
    var nomePessoal = req.body.nomePessoalServer;
    var emailPessoal = req.body.emailPessoalServer;
    var cpfPessoal = req.body.cpfPessoalServer;
    var password = req.body.passwordServer;
    var tipoUsuario = req.body.tipoUsuarioServer;

    // Faça as validações dos valores
    if (telefoneEmpresa == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (nomeEmpresa == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (cnpjEmpresa == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (nomeAeroporto == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (cepAeroporto == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (cidadeAeroporto == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (bairroAeroporto == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (ruaAeroporto == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (numeroAeroporto == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (nomePessoal == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (emailPessoal == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (cpfPessoal == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (password == undefined) {
        res.status(400).send("Algo está undefined!");
    } else if (tipoUsuario == undefined) {
        res.status(400).send("Algo está undefined!");
    } else {
        empresaModel.cadastrar(nomeEmpresa, cnpjEmpresa, telefoneEmpresa).then(function (resultado) {
            console.log(resultado)
            var fkEmpresa = process.env.AMBIENTE_PROCESSO == "desenvolvimento" ? resultado.insertId : resultado[0].ID;
            aeroportoModel.cadastrarAeroporto(fkEmpresa, nomeAeroporto, cepAeroporto, numeroAeroporto, ufAeroporto, cidadeAeroporto, bairroAeroporto, ruaAeroporto).then(function (resultado) {
                var fkAeropoto = process.env.AMBIENTE_PROCESSO == "desenvolvimento" ? resultado.insertId : resultado[0].ID;
                aeroportoModel.cadastrarTorre(fkAeropoto).then(function (resultado) {
                    usuarioModel.cadastrar(nomePessoal, emailPessoal, sha512(password), cpfPessoal, tipoUsuario, fkAeropoto).then(function (resultado) {
                        res.json(resultado);
                    })
                })
            })

        }).catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

module.exports = {
    cadastrar
}