function iniciarSessao(pagina){
    var span_userName = document.getElementById("username");
    var usuarioLink = document.getElementById('usuario-link');
    var tipoUsuario = sessionStorage.TIPO_USUARIO;

    span_userName.innerText = sessionStorage.NOME_USUARIO;

    if(tipoUsuario != 'G' && tipoUsuario != 'S') {
        usuarioLink.style.display = 'none';
    } else {
        usuarioLink.style.display = 'block';
    }

    if(pagina == 'usuarios') {
        receberDadosUsuários(sessionStorage.ID_AEROPORTO);
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