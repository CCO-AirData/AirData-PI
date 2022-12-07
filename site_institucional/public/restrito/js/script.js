setInterval(notificarAcessoPorQrCode, 5000)

function notificarAcessoPorQrCode() {
    fetch('/acessoQrCode/listarAcessosQrCode', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idUsuarioServer: sessionStorage.ID_USUARIO
        })
    }).then(function (resposta) {
        resposta.json().then(function (resJson) {
            //se houver algum acesso para ser notificado
            if (resJson.length > 0) {
                Swal.fire({
                    title: 'Você acessou uma máquina de outro dispositivo',
                    html: `<p>MAC: <b>${resJson[0].fkMaquina}</b></p> <p>Deseja acessá-la agora?</p>`,
                    showDenyButton: true,
                    confirmButtonText: 'Sim',
                    denyButtonText: `Não`,
                    position: 'bottom-end',
                    didOpen: () => {
                        //dando acesso como notificado
                        fetch("/acessoQrCode/setNotificado", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                idAcessoServer: resJson[0].idQrCodeAccess
                            })
                        })
                    },
                }).then((result) => {
                    //levando para a página da dash
                    if (result.isConfirmed) {
                        window.location = `./dashboard.html?idMaquina=${resJson[0].fkMaquina}`
                    }
                })
            }
        })
    })
}

function iniciarSessao(pagina) {
    var span_userName = document.getElementById("username");
    var usuarioLink = document.getElementById("usuario-link");
    var tipoUsuario = sessionStorage.TIPO_USUARIO;

    var tituloPagina = document.getElementById("titulo-pagina");
    var tituloDash = document.getElementById("titulo-macAdress");
    var macAdress = sessionStorage.MAC_SERVIDOR;

    span_userName.innerText = sessionStorage.NOME_USUARIO;

    if (tipoUsuario != 'G' && tipoUsuario != 'S') {
        usuarioLink.style.display = 'none';
    } else {
        usuarioLink.style.display = 'block';
    }

    if (pagina == 'usuarios') {
        receberDadosUsuários(sessionStorage.ID_AEROPORTO);
    } else if (pagina == 'maquinas') {
        receberDadosMaquinas(sessionStorage.ID_TORRE);
    } else if (pagina == 'dashboard') {
        var mac = macAdress.replace(/:/g, "-").toUpperCase();
        tituloPagina.innerText = `Dashboard | ${mac}`
        tituloDash.innerText = mac;
        criarGrafico()
        //receberDadosAlertas(sessionStorage.ID_TORRE, 3);
    } else if(pagina == 'alertas' || pagina == 'painelAlertas'){
        receberDadosAlertas(sessionStorage.ID_TORRE, 4);
        receberOpcoesFiltros(sessionStorage.ID_TORRE);
    } else if (pagina == 'componentes') {
        receberDadosComponentes(macAdress);
    } else if(pagina == 'processos'){
        receberDadosProcessos(sessionStorage.ID_TORRE, 10);
    }
}

var dropdownUser = document.getElementById("dropdownUser");
var areaUser = document.getElementById("area_user");

isDropdownUserOpen = false;

areaUser.addEventListener('click', () => {
    if (isDropdownUserOpen) {
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

function receberDadosMaquinas(fkTorre) {
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

function receberDadosAlertas(fkTorre, limite) {
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

function receberDadosComponentes(fkServidor) {
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
                if (tipo == 'componente') {
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

function receberOpcoesFiltros(fkTorre) {
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

function receberDadosProcessos(fkTorre, limite){
    var fkServidor = sessionStorage.MAC_SERVIDOR;
    fetch("/processos/receberDadosProcessos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkTorreServer: fkTorre,
            limiteServer: limite,
            fkServidorServer: fkServidor
        })
    }).then(function (resposta) {
        console.log("resposta: ", resposta);
        if (resposta.ok) {
            resposta.json().then(json => {
                console.log(json)

                listarTabelaProcessos(json)
            });
        } else {
            console.log('ERRO - não foi possível receber os dados dos Processos')
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}

const openModalButton = document.querySelector("#open-modal");
const closeModalButton = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const toggleModal = () => {
  modal.classList.toggle("hide");
  fade.classList.toggle("hide");
};

[openModalButton, closeModalButton, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModal());
});

const openModalButton2 = document.querySelector("#open-modal2");
const closeModalButton2 = document.querySelector("#close-modal2");
const modal2 = document.querySelector("#modal2");
const fade2 = document.querySelector("#fade2");

const toggleModal2 = () => {
  modal2.classList.toggle("hide2");
  fade2.classList.toggle("hide2");
};

[openModalButton2, closeModalButton2, fade2].forEach((el) => {
  el.addEventListener("click", () => toggleModal2());
});