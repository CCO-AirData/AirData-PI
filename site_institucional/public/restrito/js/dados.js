function obterDadosLeitura(func, idMaquina, metrica, limite){
    fetch(`/medidas/tempo-real/${idMaquina}/${metrica}/${limite}`)
            .then(response => {
                if (response.ok) {
                    response.json().then(resposta => {

                        console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                        console.log(typeof resposta)
                        console.log(resposta)
                        setTimeout(()=>{
                            switch(func){
                                case 'cards':
                                    // Dados para os cards da dash
                                    plotarCards(metrica, resposta);
                                    break;
                                case 'grafico':
                                    // Dados para o gráfico de linha da dash
                                    plotarGrafico(metrica, resposta.reverse(), limite);
                                    break;
                                case 'atualizarGrafico':
                                    // Dados para atualizar o gráfico de linha da dash
                                    atualizarGrafico(metrica, resposta.reverse())
                                    break;
                            }
                        },1000);
                       
                    });
                } else {

                    console.error('Nenhum dado encontrado ou erro na API');
                }
            })
            .catch(function (error) {
                console.error(`Erro na obtenção dos dados do aquario p/ gráfico: ${error.message}`);
            });

            
}