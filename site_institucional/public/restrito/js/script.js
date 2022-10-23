function iniciarSessao(pagina){
    var span_userName = document.getElementById("username");
    var usuarioLink = document.getElementById("usuario-link");
    var tipoUsuario = sessionStorage.TIPO_USUARIO;

    var tituloPagina = document.getElementById("titulo-pagina");
    var tituloDash = document.getElementById("titulo-macAdress");
    var macAdress = sessionStorage.MAC_SERVIDOR;

    span_userName.innerText = sessionStorage.NOME_USUARIO;

    if(tipoUsuario != 'G' && tipoUsuario != 'S') {
        usuarioLink.style.display = 'none';
    } else {
        usuarioLink.style.display = 'block';
    }

    if(pagina == 'usuarios') {
        receberDadosUsuários(sessionStorage.ID_AEROPORTO);
    } else if(pagina == 'maquinas') {
        receberDadosMaquinas(sessionStorage.ID_TORRE);
    } else if(pagina == 'dashboard') {
        var mac = macAdress.replace(/:/g, "-").toUpperCase();
        tituloPagina.innerText = `Dashboard | ${mac}`
        tituloDash.innerText = mac;
        criarGrafico()
        receberDadosAlertas(sessionStorage.ID_TORRE, 3);
    } else if(pagina == 'alertas' || pagina == 'painelAlertas'){
        receberDadosAlertas(sessionStorage.ID_TORRE, 4);
        receberOpcoesFiltros(sessionStorage.ID_TORRE);
    } else if(pagina == 'componentes'){
        receberDadosComponentes(macAdress);
    }
}

var dropdownUser = document.getElementById("dropdownUser");
var areaUser = document.getElementById("area_user");

isDropdownUserOpen = false;

areaUser.addEventListener('click', () => {
    if(isDropdownUserOpen) {
        dropdownUser.style.display = 'none';
        isDropdownUserOpen = false;
    } else {
        dropdownUser.style.display = 'block';
        isDropdownUserOpen = true;
    }
})

function receberDadosUsuários(fkAeroporto) {
    fetch("/usuarios/listar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkAeroportoServer: fkAeroporto,
        })
    }).then(function (resposta) {
        console.log("resposta: ", resposta);
        if (resposta.ok) {
            resposta.json().then(json => {
                console.log(json)

                listarTabelaUsuarios(json)
            });
        } else {
            console.log('ERRO - não foi possível receber os dados dos usuários')
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}

function receberDadosMaquinas(fkTorre){
    fetch("/maquinas/listar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkTorreServer: fkTorre,
        })
    }).then(function (resposta) {
        console.log("resposta: ", resposta);
        if (resposta.ok) {
            resposta.json().then(json => {
                console.log(json)

                listarTabelaMaquinas(json)
            });
        } else {
            console.log('ERRO - não foi possível receber os dados das máquinas')
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });

}

function receberDadosAlertas(fkTorre, limite){
    fetch("/alertas/receberDadosAlertas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkTorreServer: fkTorre,
            limiteServer: limite,
        })
    }).then(function (resposta) {
        console.log("resposta: ", resposta);
        if (resposta.ok) {
            resposta.json().then(json => {
                console.log(json)

                listarTabelaAlertas(json)
            });
        } else {
            console.log('ERRO - não foi possível receber os dados dos alertas')
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}

function receberDadosComponentes(fkServidor){
    fetch("/metricas/listarComponentes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkServidorServer: fkServidor,
        })
    }).then(function (resposta) {
        console.log("resposta: ", resposta);
        if (resposta.ok) {
            resposta.json().then(json => {
                console.log(json)
                listarTabelaComponentes(json)
            });
        } else {
            console.log('ERRO - não foi possível receber os dados dos componentes')
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}

function receberOpcoesComponentes(tipo, componente) {
    fetch("/metricas/listarOpcoesComponentes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeComponenteServer: componente
        })
    }).then(function (resposta) {
        console.log("resposta: ", resposta);
        if (resposta.ok) {
            resposta.json().then(json => {
                console.log(json)
                if(tipo == 'componente') {
                    listarOpcoesComponentes(json)
                } else {
                    listarOpcoesParametro(json)
                }
            });
        } else {
            console.log('ERRO - não foi possível receber as opções de filtragem')
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });

}

function receberOpcoesFiltros(fkTorre){
    fetch("/alertas/receberOpcoesFiltros", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkTorreServer: fkTorre,
        })
    }).then(function (resposta) {
        console.log("resposta: ", resposta);
        if (resposta.ok) {
            resposta.json().then(json => {
                console.log(json)

                listarFiltros(json)
            });
        } else {
            console.log('ERRO - não foi possível receber as opções de filtragem')
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}