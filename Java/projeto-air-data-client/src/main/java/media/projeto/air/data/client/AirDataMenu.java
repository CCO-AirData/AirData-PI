package media.projeto.air.data.client;

import com.github.britooo.looca.api.core.Looca;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.logging.Level;
import java.util.logging.Logger;
import media.projeto.air.data.client.monitoramento.AirDataInformacaoDoSistema;
import media.projeto.air.data.client.monitoramento.AirDataProcessos;
import media.projeto.air.data.client.monitoramento.CPUxMEMORIA;
import media.projeto.air.data.client.monitoramento.CPUxTEMPERATURA;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import java.io.File;
import java.nio.file.Paths;
import media.projeto.air.data.client.rede.Rede;

public class AirDataMenu extends javax.swing.JFrame {

    Looca looca = new Looca();

    public AirDataMenu() {
        initComponents();
        String sistema = looca.getSistema().toString();
        
        if (sistema.contains("Windows")) {
            
            CPUxTEMPERATURA.setVisible(false);
            titulo.setSize(392, HEIGHT);
        }
        pack();
    }

    @SuppressWarnings("unchecked")

        
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        titulo = new javax.swing.JLabel();
        sistema = new javax.swing.JButton();
        cpu = new javax.swing.JButton();
        CPUxTEMPERATURA = new javax.swing.JButton();
        processos = new javax.swing.JButton();
        sair = new javax.swing.JButton();
        jLabelQrCode = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        titulo.setFont(new java.awt.Font("Algerian", 0, 24)); // NOI18N
        titulo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        titulo.setText("Monitoramento Air-Data");

        sistema.setText("Informações do Sistema");
        sistema.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                sistemaActionPerformed(evt);
            }
        });

        cpu.setText("CPU X Memória");
        cpu.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cpuActionPerformed(evt);
            }
        });

        CPUxTEMPERATURA.setText("CPU X TEMPERATURA");
        CPUxTEMPERATURA.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                CPUxTEMPERATURAActionPerformed(evt);
            }
        });

        processos.setText("Processos");
        processos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                processosActionPerformed(evt);
            }
        });

        sair.setText("Sair");
        sair.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                sairActionPerformed(evt);
            }
        });

        final String BASE_URL = "airdata.onrender.com";
        File file = new File("./qrCode.jpg");
        if (!file.exists()) {
            Rede rede = new Rede();
            String qrCodeUrl = BASE_URL + "/restrito/dashboard.html?idMaquina=" + rede.Mac() + "&origin=qrCode";
            String path = "./qrCode.jpg";
            try {
                BitMatrix matrix = new MultiFormatWriter().encode(qrCodeUrl, BarcodeFormat.QR_CODE, 58, 58);
                MatrixToImageWriter.writeToPath(matrix, "jpg", Paths.get(path));
            } catch (Exception e) {
                System.out.println("Um erro ocorreu:");
                System.out.println(e);
            }
        }
        jLabelQrCode.setIcon(new javax.swing.ImageIcon("./qrCode.jpg"));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(titulo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(47, 47, 47)
                .addComponent(jLabelQrCode, javax.swing.GroupLayout.PREFERRED_SIZE, 58, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(31, 31, 31))
            .addGroup(layout.createSequentialGroup()
                .addGap(19, 19, 19)
                .addComponent(cpu)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(sistema)
                .addGap(18, 18, 18)
                .addComponent(processos, javax.swing.GroupLayout.PREFERRED_SIZE, 107, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(CPUxTEMPERATURA, javax.swing.GroupLayout.PREFERRED_SIZE, 164, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 12, Short.MAX_VALUE))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(sair, javax.swing.GroupLayout.PREFERRED_SIZE, 107, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(titulo, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabelQrCode, javax.swing.GroupLayout.PREFERRED_SIZE, 58, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(cpu)
                    .addComponent(CPUxTEMPERATURA)
                    .addComponent(sistema)
                    .addComponent(processos))
                .addGap(18, 18, 18)
                .addComponent(sair))
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents


    private void sistemaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_sistemaActionPerformed
        AirDataInformacaoDoSistema dash = null;
        try {
            dash = new AirDataInformacaoDoSistema();
        } catch (UnknownHostException ex) {
            Logger.getLogger(AirDataMenu.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SocketException ex) {
            Logger.getLogger(AirDataMenu.class.getName()).log(Level.SEVERE, null, ex);
        }
        dash.setVisible(true);
    }//GEN-LAST:event_sistemaActionPerformed

    private void cpuActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cpuActionPerformed
        CPUxMEMORIA memoria = new CPUxMEMORIA();
        memoria.setVisible(true);
    }//GEN-LAST:event_cpuActionPerformed

    private void CPUxTEMPERATURAActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_CPUxTEMPERATURAActionPerformed
        CPUxTEMPERATURA temperatura = new CPUxTEMPERATURA();
        temperatura.setVisible(true);
    }//GEN-LAST:event_CPUxTEMPERATURAActionPerformed

    private void processosActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_processosActionPerformed
        AirDataProcessos processos = new AirDataProcessos();
        processos.setVisible(true);
    }//GEN-LAST:event_processosActionPerformed

    private void sairActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_sairActionPerformed
        System.exit(0);
    }//GEN-LAST:event_sairActionPerformed

    public static void main(String args[]) {
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(AirDataMenu.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(AirDataMenu.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(AirDataMenu.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(AirDataMenu.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new AirDataMenu().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton CPUxTEMPERATURA;
    private javax.swing.JButton cpu;
    private javax.swing.JLabel jLabelQrCode;
    private javax.swing.JButton processos;
    private javax.swing.JButton sair;
    private javax.swing.JButton sistema;
    private javax.swing.JLabel titulo;
    // End of variables declaration//GEN-END:variables
}
