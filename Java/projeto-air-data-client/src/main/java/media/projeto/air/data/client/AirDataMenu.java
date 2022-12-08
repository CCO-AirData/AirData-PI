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
import java.awt.Color;
import java.io.File;
import java.nio.file.Paths;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import media.projeto.air.data.client.rede.Rede;

public class AirDataMenu extends javax.swing.JFrame {

    Looca looca = new Looca();

    public AirDataMenu() {
        initComponents();
        String sistema = looca.getSistema().toString();
        
        if (sistema.contains("Windows")) {
            
            CPUxTEMPERATURA.setVisible(false);
        }
        pack();
        
        
        Color cor = new Color(0,169,169);
         getContentPane().setBackground(cor);
        try {
            UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | UnsupportedLookAndFeelException ex) {
            Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(Level.SEVERE, null, ex);
        }
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
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setAlwaysOnTop(true);
        setBackground(new java.awt.Color(0, 219, 255));
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        titulo.setBackground(new java.awt.Color(255, 255, 255));
        titulo.setFont(new java.awt.Font("Arial", 1, 18)); // NOI18N
        titulo.setForeground(new java.awt.Color(255, 255, 255));
        titulo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        titulo.setText("Monitoramento Air-Data");
        getContentPane().add(titulo, new org.netbeans.lib.awtextra.AbsoluteConstraints(80, 0, 670, 70));

        sistema.setBackground(new java.awt.Color(255, 255, 255));
        sistema.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        sistema.setForeground(new java.awt.Color(0, 0, 0));
        sistema.setText("Informações do Sistema");
        sistema.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                sistemaActionPerformed(evt);
            }
        });
        getContentPane().add(sistema, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 230, -1, -1));

        cpu.setBackground(new java.awt.Color(255, 255, 255));
        cpu.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        cpu.setForeground(new java.awt.Color(0, 0, 0));
        cpu.setText("CPU X Memória");
        cpu.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cpuActionPerformed(evt);
            }
        });
        getContentPane().add(cpu, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 90, -1, -1));

        CPUxTEMPERATURA.setBackground(new java.awt.Color(255, 255, 255));
        CPUxTEMPERATURA.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        CPUxTEMPERATURA.setForeground(new java.awt.Color(0, 0, 0));
        CPUxTEMPERATURA.setText("CPU X TEMPERATURA");
        CPUxTEMPERATURA.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                CPUxTEMPERATURAActionPerformed(evt);
            }
        });
        getContentPane().add(CPUxTEMPERATURA, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 310, 190, -1));

        processos.setBackground(new java.awt.Color(255, 255, 255));
        processos.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        processos.setForeground(new java.awt.Color(0, 0, 0));
        processos.setText("Processos");
        processos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                processosActionPerformed(evt);
            }
        });
        getContentPane().add(processos, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 160, 160, -1));

        sair.setBackground(new java.awt.Color(255, 255, 255));
        sair.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        sair.setForeground(new java.awt.Color(0, 0, 0));
        sair.setText("Sair");
        sair.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                sairActionPerformed(evt);
            }
        });
        getContentPane().add(sair, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 380, 107, -1));

        jLabelQrCode.setOpaque(true);
        final String BASE_URL = "airdata.onrender.com";
        File file = new File("./qrCode.png");
        if (!file.exists()) {
            Rede rede = new Rede();
            String qrCodeUrl = BASE_URL + "/restrito/dashboard.html?idMaquina=" + rede.Mac() + "&origin=qrCode";
            String path = "./qrCode.png";
            try {
                BitMatrix matrix = new MultiFormatWriter().encode(qrCodeUrl, BarcodeFormat.QR_CODE, 340,200);
                MatrixToImageWriter.writeToPath(matrix, "png", Paths.get(path));
            } catch (Exception e) {
                System.out.println("Um erro ocorreu:");
                System.out.println(e);
            }
        }
        jLabelQrCode.setIcon(new javax.swing.ImageIcon("./qrCode.png"));
        getContentPane().add(jLabelQrCode, new org.netbeans.lib.awtextra.AbsoluteConstraints(260, 180, 340, 200));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 18)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setText("Seja Bem Vindo");
        jLabel1.setPreferredSize(new java.awt.Dimension(700, 420));
        getContentPane().add(jLabel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(350, 70, 210, 50));

        jLabel2.setFont(new java.awt.Font("Arial", 1, 18)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Leia o QrCode para executar o monitoramento mobile");
        getContentPane().add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(180, 120, 480, 60));

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void sairActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_sairActionPerformed
        System.exit(0);
    }//GEN-LAST:event_sairActionPerformed

    private void processosActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_processosActionPerformed
        AirDataProcessos processos = new AirDataProcessos();
        processos.setVisible(true);
        this.setVisible(false);
    }//GEN-LAST:event_processosActionPerformed

    private void CPUxTEMPERATURAActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_CPUxTEMPERATURAActionPerformed
        CPUxTEMPERATURA temperatura = new CPUxTEMPERATURA();
        temperatura.setVisible(true);
        this.setVisible(false);
    }//GEN-LAST:event_CPUxTEMPERATURAActionPerformed

    private void cpuActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cpuActionPerformed
        CPUxMEMORIA memoria = new CPUxMEMORIA();
        memoria.setVisible(true);
        this.setVisible(false);
    }//GEN-LAST:event_cpuActionPerformed

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
        this.setVisible(false);
    }//GEN-LAST:event_sistemaActionPerformed


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
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabelQrCode;
    private javax.swing.JButton processos;
    private javax.swing.JButton sair;
    private javax.swing.JButton sistema;
    private javax.swing.JLabel titulo;
    // End of variables declaration//GEN-END:variables
}
