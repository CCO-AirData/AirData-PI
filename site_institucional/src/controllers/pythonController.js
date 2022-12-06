
// Importando dependências do node
const fs = require('fs');
const spawn = require("child_process").spawn;
const exec = require("child_process").exec;

// Encontrando caminho do interpretador python
const pyVersao = 310;
var pythonPath;

// Diretório armazenando os graficos
const diretorioGraficos = "public/assets/img/graficos"

var dict = {
    // "metrica": "cpuPercent",
    // "idServidor": "16:a6:95:10:ef:9f",
    // "idTorre": 2,
    // "componente": 125,
    // "mes": 11
};

function iniciar(req, res){

    console.log(req.body)
    dict["metrica"] = req.body.metrica;
    // dict["idTorre"] = req.body.idTorre;
    // dict["idServidor"] = req.body.idServidor;
    dict["componente"] = req.body.componente;
    dict["mes"] = req.body.mes;

    acharPython();
    setTimeout(()=>{
        ativarPython();
    },1000)
    
}

function acharPython(){
    exec('python -c "import os, sys; print(os.path.dirname(sys.executable))"', function(error, stdout, stderr){
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error != null) {
            console.log('exec error: ' + error);
        } else {
            pythonPath = stdout.replace(/(\r\n|\n|\r)/gm,"");
            separador = definirSeparador(pythonPath);
            executavel = pythonPath.indexOf("bin") < 0 ? "python.exe" : "python"
            pythonPath += separador + executavel;
            console.log("pythonPath:", pythonPath);
        }
    });   
}

// Executando python com parâmetros

function ativarPython(){

    console.log("ATIVANDO O PYTHON");

    if(pythonPath.indexOf("bin") < 0) mudarVersaoPython(pyVersao);

    console.log("pythonPath atual:", pythonPath);

    setTimeout(()=>{
        spawn(pythonPath, ["src/python_r/main.py", dict.metrica, dict.componente, dict.idTorre, dict.idServidor, dict.ano, dict.mes]);
        apagarImagens();
    }, 1000);

}

function mudarVersaoPython(versao){
    var novaVersao = "Python" + versao

    console.log(novaVersao)
    if(pythonPath.indexOf("bin") < 0){
        if(pythonPath.indexOf(novaVersao) < 0){
            var separador = definirSeparador(pythonPath);
            
            pythonPath = pythonPath.split(separador);
            pythonPath[pythonPath.length - 2] = novaVersao;
            pythonPath = pythonPath.join(separador);
    
            console.log(pythonPath);
        }  
    }
}

function definirSeparador(pathAtual){
    var separador;
    if(pathAtual.indexOf("/") >= 0){
        separador = "/";
    }else{
        separador = "\\";
    }
    return separador;
}


// Apagando imagens desnecessárias 

function apagarImagens(){

    fs.readdir(diretorioGraficos, function (err, files) {
        if (err) {
            return console.log('Não foi possível escanear o diretório: ' + err);
        } 
        files.forEach(function (file) {
                console.log(file); 
                fs.unlink(diretorioGraficos + "/" + file, function(err){
                    if(err != null){
                        console.log("Não foi possível excluir o arquivo:", file)
                    }else{
                        console.log("Arquivo excluido com sucesso:", file)
                    }
                });
            
            });
        });
}

module.exports = {
    iniciar,
}