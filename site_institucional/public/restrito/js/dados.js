function obterDadosCards(idMaquina, metrica){        
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
            
function obterDadosGrafico(idMaquina, metrica, isPrimeiroPlot) {
    var limite;
    isPrimeiroPlot ? limite = 12 : limite = 1

    fetch(`/medidas/grafico-tempo-real/${idMaquina}/${metrica}/${limite}`)
            .then(response => {
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