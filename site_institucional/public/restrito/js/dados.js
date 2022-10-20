// Obtendo componentes para criar a tela
function obterComponentes(idMaquina) {
    fetch(`/medidas/getComponentesServidor/${idMaquina}`)
        .then(response => {
            if (response.ok) {
                response.json().then(resposta => {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    console.log(typeof resposta)
                    console.log(resposta)
                    criarCards(resposta)
                });
            } else {

                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados do aquario p/ gráfico: ${error.message}`);
        });
}

function criarCards(vtComponentes){

    var cards = document.getElementById("container_cards") 

    for(var i = 0; i < vtComponentes.length; i++){
        var componente = vtComponentes[i]
        var icone;

        if(componente.nomeMetrica.startsWith("disk")){
            icone = "fas fa-solid fa-hard-drive fa-2x text-warning"
        } else if (componente.nomeMetrica.startsWith("ram")){
            icone = "fas fa-memory fa-2x text-info"
        } else if (componente.nomeMetrica.startsWith("cpu")){
            icone = "fas fa-light fa-microchip fa-2x text-primary"
        }

        console.log(componente)

        cards.innerHTML += `<div class="col-xl-3 col-md-6 mb-4">
        <div class="card h-100">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-uppercase mb-1">${componente.tipoComponente} | ${componente.nomeComponente} (${componente.unidadeMedida})</div>
                        <div id="${tratarId(componente.nomeMetrica)}" class="h5 mb-0 font-weight-bold text-gray-800">0%
                        </div>
                        <div class="mt-2 mb-0 text-muted text-xs">

                            <span>ESTÁVEL</span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <i class="${icone}"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>`

    }
}

// Obtendo dados dos cards
function obterDadosCards(idMaquina, metrica) {
    fetch(`/medidas/cards-tempo-real/${idMaquina}/${metrica}`)
        .then(response => {
            if (response.ok) {
                response.json().then(resposta => {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    console.log(typeof resposta)
                    console.log(resposta)
                    plotarCards(metrica, resposta);
                });
            } else {

                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados do aquario p/ gráfico: ${error.message}`);
        });
}

// Obtendo dados grafico
function obterDadosGrafico(idMaquina, metrica, isPrimeiroPlot) {
    var limite;
    isPrimeiroPlot ? limite = 12 : limite = 1

    fetch("/medidas/grafico", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idMaquina: idMaquina,
            metrica: metrica,
            limite: limite
        })
    }).then(response => {
            if (response.ok) {
                response.json().then(resposta => {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    console.log(typeof resposta)
                    console.log(resposta)

                    isPrimeiroPlot ? plotarGrafico(metrica, resposta, limite) : atualizarGrafico(metrica, resposta)
                });
            } else {

                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados do aquario p/ gráfico: ${error.message}`);
        });

}

function tratarId(metrica){
    return "card_" + metrica.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`); 
}