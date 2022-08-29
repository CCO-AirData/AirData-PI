
function obterDadosSession(){
    var json = JSON.parse(sessionStorage.getItem("dadosUsuario"));
    return json;
}


// JSON.parse json -> string javascript
// JSON.stringify String -> json