
package media.projeto.air.data.client.monitoramento;

import java.awt.BorderLayout;
import java.awt.Color;
import java.util.Timer;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import static javax.swing.WindowConstants.EXIT_ON_CLOSE;
import media.projeto.air.data.client.AirDataMenu;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.data.xy.XYDataset;
import org.jfree.ui.RefineryUtilities;
import school.sptech.jfreechart.sample.GraficoCPUxMEMORIA;
import school.sptech.jfreechart.sample.GraficoCPUxMEMORIATask;

public final class CPUxMEMORIA extends javax.swing.JFrame {

           GraficoCPUxMEMORIA grafico = new GraficoCPUxMEMORIA("Monitoramento CPU X Memória Ram");
    public CPUxMEMORIA() {

        initComponents();

        RefineryUtilities.centerFrameOnScreen(grafico);
        Grafico();
//        grafico.pack();

        
        GraficoCPUxMEMORIATask task = new GraficoCPUxMEMORIATask(grafico);
        
        Timer timer = new Timer("Grafico linha");
        
        timer.schedule(task, 0, 3000);
         getContentPane().setBackground(Color.WHITE);
        try {
            UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | UnsupportedLookAndFeelException ex) {
            Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }

     public void Grafico()  {

        setDefaultCloseOperation(EXIT_ON_CLOSE);

        final XYDataset dataset = grafico.gerarDataSetInicial();

        JFreeChart chart = grafico.gerarGrafico(dataset);
                grafico1.setVisible(true);

                ChartPanel pane = new ChartPanel(chart);
                pane.setDomainZoomable(true);
                
                pane.setVisible(true);
                
                   grafico1.setLayout(new BorderLayout());
                   
                     grafico1.add(pane, BorderLayout.NORTH);
                
    }
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jButton1 = new javax.swing.JButton();
        grafico1 = new javax.swing.JPanel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setBackground(new java.awt.Color(255, 255, 255));
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jButton1.setText("Voltar");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });
        getContentPane().add(jButton1, new org.netbeans.lib.awtextra.AbsoluteConstraints(410, 430, -1, -1));

        javax.swing.GroupLayout grafico1Layout = new javax.swing.GroupLayout(grafico1);
        grafico1.setLayout(grafico1Layout);
        grafico1Layout.setHorizontalGroup(
            grafico1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 880, Short.MAX_VALUE)
        );
        grafico1Layout.setVerticalGroup(
            grafico1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 420, Short.MAX_VALUE)
        );

        getContentPane().add(grafico1, new org.netbeans.lib.awtextra.AbsoluteConstraints(2, 3, 880, 420));

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        AirDataMenu menu = new AirDataMenu();
        menu.setVisible(true);
        this.setVisible(false);
    }//GEN-LAST:event_jButton1ActionPerformed

    public static void main(String args[]) {
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(CPUxMEMORIA.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(CPUxMEMORIA.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(CPUxMEMORIA.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(CPUxMEMORIA.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new CPUxMEMORIA().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    public javax.swing.JPanel grafico1;
    private javax.swing.JButton jButton1;
    // End of variables declaration//GEN-END:variables
}
