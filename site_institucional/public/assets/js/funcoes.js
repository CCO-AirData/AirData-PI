
function obterDadosSession(){
    var json = JSON.parse(sessionStorage.getItem("dadosUsuario"));
    return json;
}
function setarNomeUsuario(){
    var dadosJson = JSON.parse(sessionStorage.dadosUsuario)
    var nomeUsuario = dadosJson.nomeUsuario.split(" ")[0]

    username.innerHTML = nomeUsuario
}

// JSON.parse json -> string javascript
// JSON.stringify String -> json