function obterDadosGraficoFan() {
  fetch(`/medidas/pegarDadosGrafico/${idMaquina}`, {
    cache: 'no-store',
  }).then(
    function (response) {
      console.log(response);
      if (response.ok) {
        response.json().then(
          function (resultado) {
            configurarDados(resultado);
          })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Está maquina não possui dados suficientes para gerar o gráfico!',
          showConfirmButton: false,
          timer: 3000
        })
      }
    }).catch(
      function (error) {
        console.error('Não foi possível obter os dados do gráfico', error.message);
      }
    );
}

function configurarDados(resultado) {
  var dadosScatter = [];
  var valoresTemp = [];
  var valoresRPM = [];
  var horarios = [];
  for (let i = 0; i < resultado.length; i++) {
    if (resultado[i].metrica === 5) {
      for (let j = i + 1; j < resultado.length; j++) {
        if (resultado[j].metrica === 4) {
          dadosScatter.push({ x: resultado[j].valor, y: resultado[i].valor });
          horarios.push(resultado[j].horario);
          valoresTemp.push(parseFloat(resultado[j].valor));
          valoresRPM.push(parseFloat(resultado[i].valor));
        } else {
          break;
        }
      }
    }
  }

  //console.log(dadosScatter.length);

  obterRegressao(valoresTemp, valoresRPM, dadosScatter, horarios);
}

function obterRegressao(temp, rpm, dadosScatter, horarios) {
  console.log('Obtendo regressão linear...');
  console.log('Temp: ' + temp);
  console.log('RPM: ' + rpm);
  fetch(`/regressao/get-rls/${temp}&${rpm}`, {
    cache: 'no-store',
  }).then(
    function (response) {
      if (response.ok) {
        response.json().then(
          function (resultado) {
            renderizarGraficoFan(dadosScatter, resultado, horarios);
          })
      } else {
        console.error('Não foi possível obter os dados do gráfico');
      }
    }).catch(
      function (error) {
        console.error('Não foi possível obter os dados do gráfico', error.message);
      }
    );
}

function renderizarGraficoFan(dadosScatter, lm, horarios) {
  document.getElementById('section-choose').style.display = 'none';
  document.getElementById('section-analytics').style.display = 'none';
  document.getElementById('section-analytics-fan').style.display = 'block';

  var informacoes;
  var intercept = lm[0];
  var slope = lm[1];

  function obterProcessosFan(horarioInicio, horarioFim) {
    fetch(`/processos/obter-processos/${horarioInicio}&${horarioFim}&${idMaquina}`, {
      cache: 'no-store',
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json())
      .then(res => {
        informacoes = [];
        informacoes.push(`Processo: ${res[0].nome} - CPU %: ${res[0].usoCpu}`);
        informacoes.push(`Processo: ${res[1].nome} - CPU %: ${res[1].usoCpu}`);
        informacoes.push(`Processo: ${res[2].nome} - CPU %: ${res[2].usoCpu}`);
        // console.log(informacoes);
      })
  }

  var regressionLine = [];
  for (let i = 0; i < dadosScatter.length; i++) {
    regressionLine.push({ x: dadosScatter[i].x, y: slope * dadosScatter[i].x + intercept });
  }

  const colorDados = dadosScatter.map(item => item.x > 65 && item.y < 2920 ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)');
  const data = {
    datasets: [{
      label: 'Scatter Dataset',
      data: dadosScatter,
      backgroundColor: colorDados,
    }, {
      label: 'regressão linear',
      data: regressionLine,
      backgroundColor: 'transparent',
      borderColor: 'rgb(75, 192, 192)',
      type: 'line',
      pointRadius: 0,
    }]
  };

  const config = {
    type: 'scatter',
    data: data,
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            title: function (context) {
              return 'Temp: ' + context[0].raw.x + ' RPM: ' + context[0].raw.y;
            },
            afterTitle: function (context) {
              return '--------------------------------------------------------------------------';
            },
            label: function (context) {
              return '';
            },
            beforeBody: function (context) {
              var horarioInicio = horarios[context[0].dataIndex];
              var horarioFim = horarios[context[0].dataIndex + 1];

              obterProcessosFan(horarioInicio, horarioFim);

              return informacoes;
            },
            beforeFooter: function(content){
              return '--------------------------------------------------------------------------';
            },
            footer: function(context){
              const horario = new Date(horarios[context[0].dataIndex]).toUTCString();

              return 'Data: ' + horario;
            },
          }
        },
        title: {
          display: true,
          text: 'Temperatura',
          position: 'bottom',
        },
        subtitle: {
          display: true,
          text: 'RPM',
          position: 'left'
        },
      },
      scales: {
        x: {
          title: 'RPM',
          type: 'linear',
          position: 'bottom'
        }
      }
    }
  };

  new chartPedro(
    document.getElementById('myChart'),
    config
  );
}