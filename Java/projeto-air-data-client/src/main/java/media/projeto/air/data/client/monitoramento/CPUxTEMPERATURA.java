
package media.projeto.air.data.client.monitoramento;

import java.awt.BorderLayout;
import java.util.Timer;
import static javax.swing.WindowConstants.EXIT_ON_CLOSE;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.data.xy.XYDataset;
import org.jfree.ui.RefineryUtilities;
import school.sptech.jfreechart.sample.GraficoCPUxTEMPERATURA;
import school.sptech.jfreechart.sample.GraficoCPUxTEMPERATURATask;


public final class CPUxTEMPERATURA extends javax.swing.JFrame {

           GraficoCPUxTEMPERATURA grafico = new GraficoCPUxTEMPERATURA("Monitoramento CPU X Temperatura");
    
    public CPUxTEMPERATURA() {

        initComponents();
        grafico.pack();

        RefineryUtilities.centerFrameOnScreen(grafico);
        Grafico();

        
        GraficoCPUxTEMPERATURATask task = new GraficoCPUxTEMPERATURATask(grafico);
        
        Timer timer = new Timer("Grafico linha");
        
        timer.schedule(task, 0, 3000);
        
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

        jButton1.setText("Voltar");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout grafico1Layout = new javax.swing.GroupLayout(grafico1);
        grafico1.setLayout(grafico1Layout);
        grafico1Layout.setHorizontalGroup(
            grafico1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 694, Short.MAX_VALUE)
        );
        grafico1Layout.setVerticalGroup(
            grafico1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 421, Short.MAX_VALUE)
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addGap(316, 316, 316)
                        .addComponent(jButton1))
                    .addGroup(layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(grafico1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(26, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(grafico1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(18, 18, 18)
                .addComponent(jButton1)
                .addGap(25, 25, 25))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
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
            java.util.logging.Logger.getLogger(CPUxTEMPERATURA.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(CPUxTEMPERATURA.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(CPUxTEMPERATURA.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(CPUxTEMPERATURA.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new CPUxTEMPERATURA().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    public javax.swing.JPanel grafico1;
    private javax.swing.JButton jButton1;
    // End of variables declaration//GEN-END:variables
}
