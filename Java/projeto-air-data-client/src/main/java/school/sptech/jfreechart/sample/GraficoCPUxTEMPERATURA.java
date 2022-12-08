package school.sptech.jfreechart.sample;


import com.github.britooo.looca.api.core.Looca;
import java.awt.Color;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
import org.jfree.data.xy.XYDataset;
import org.jfree.data.xy.XYSeries;
import org.jfree.data.xy.XYSeriesCollection;
import org.jfree.ui.ApplicationFrame;



public class GraficoCPUxTEMPERATURA extends ApplicationFrame{

    private XYSeries series1;
    private XYSeries series2;
    private XYSeriesCollection dataSet;

    Looca looca = new Looca();

    Double processadorUso = looca.getProcessador().getUso();

    Integer respostaCPU = processadorUso.intValue();

    Integer temperatura = looca.getTemperatura().getTemperatura().intValue();
    

    public GraficoCPUxTEMPERATURA(String title)  {
        super(title);
    }
    
   

    //Inicializando dataset
    public XYDataset gerarDataSetInicial() {
        this.series1 = new XYSeries("CPU");
        series1.add(0.0, 0.0);

        this.series2 = new XYSeries("Temperatura");
        series2.add(0.0, 0.0);

        final XYSeriesCollection dataset = new XYSeriesCollection();
        dataset.addSeries(series1);
        dataset.addSeries(series2);

        return dataset;

    }

    // Criando um gráfico de linha 
    public JFreeChart gerarGrafico(final XYDataset dataset) {

        JFreeChart chart = ChartFactory.createXYLineChart(
                "Monitoramento CPU X Temperatura",
                "",
                "",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                true,
                false
        );

        chart.setBackgroundPaint(Color.WHITE);

        final XYPlot plot = chart.getXYPlot();
        plot.setBackgroundPaint(Color.lightGray);
        plot.setDomainGridlinePaint(Color.white);
        plot.setRangeGridlinePaint(Color.white);

        final XYLineAndShapeRenderer renderer = new XYLineAndShapeRenderer();
        plot.setRenderer(renderer);

        final NumberAxis rangeAxis = (NumberAxis) plot.getRangeAxis();
        rangeAxis.setStandardTickUnits(NumberAxis.createIntegerTickUnits());

        return chart;
    }

    // Atualizando os dataset's
    public void atualizarDataSet() {
        processadorUso = looca.getProcessador().getUso();
        respostaCPU = processadorUso.intValue();
        temperatura = looca.getTemperatura().getTemperatura().intValue();

        // pegando o último valor do eixo X
        double maxXSeries1 = series1.getMaxX();
        double maxXSeries2 = series2.getMaxX();

        // pegando o primeiro valor do eixo X
        double minXSeries1 = series1.getMinX();
        double minXSeries2 = series2.getMinX();

        // Incrementando eixo X em +1  e o eixo Y com as leituras feitas pelo looca
        if (maxXSeries1 > 5 && maxXSeries2 > 5) {
            series1.remove(minXSeries1);
            series2.remove(minXSeries2);
        }
        series1.add(maxXSeries1 + 1, respostaCPU);
        series2.add(maxXSeries2 + 1, temperatura);

        // Para atualizar é necessário recriar o dataset
        dataSet = new XYSeriesCollection();

        // adicionando novamente as series
        dataSet.addSeries(series1);
        dataSet.addSeries(series2);
    }


}
