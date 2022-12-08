package media.projeto.air.data.client;

import java.awt.Color;
import java.awt.GridLayout;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.Buffer;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.*;

import media.projeto.air.data.client.conexao.Banco;
import media.projeto.air.data.client.monitoramento.AirDataInformacaoDoSistema;
import media.projeto.air.data.client.rede.Rede;
import org.springframework.jdbc.core.JdbcTemplate;

public class AirDataLogin extends javax.swing.JFrame {

    String email;
    String senha;

    public AirDataLogin() {
        initComponents();
        String email = "";
        String senha = "";
        Color cor = new Color(0,169,169);
         getContentPane().setBackground(cor);
        try {
            UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | UnsupportedLookAndFeelException ex) {
            Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(Level.SEVERE, null, ex);
        }
        
//        JLabel imagem = new JLabel();
//        BufferedImage icon;
//        try {
//            icon = ImageIO.read(getClass().getResource("LogoEmpresa.png"));
//               imagem.setIcon(new ImageIcon(icon));
//                logo.setLayout(new GridLayout(1, 1));
//        logo.add(imagem);
//        } catch (IOException ex) {
//            Logger.getLogger(AirDataLogin.class.getName()).log(Level.SEVERE, null, ex);
//        }

    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        SejaBemVindo = new javax.swing.JLabel();
        TextoSenha = new javax.swing.JLabel();
        TextoEmail = new javax.swing.JLabel();
        iptEmail = new javax.swing.JTextField();
        entrar = new javax.swing.JButton();
        iptSenha = new javax.swing.JPasswordField();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setMinimumSize(new java.awt.Dimension(447, 388));
        setResizable(false);

        SejaBemVindo.setFont(new java.awt.Font("Arial", 1, 18)); // NOI18N
        SejaBemVindo.setForeground(new java.awt.Color(255, 255, 255));
        SejaBemVindo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        SejaBemVindo.setText("LOGIN");

        TextoSenha.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        TextoSenha.setText("Sua Senha:");

        TextoEmail.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        TextoEmail.setText("Seu Email:");

        iptEmail.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                iptEmailActionPerformed(evt);
            }
        });

        entrar.setBackground(new java.awt.Color(255, 255, 255));
        entrar.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        entrar.setForeground(new java.awt.Color(0, 0, 0));
        entrar.setText("Logar");
        entrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                entrarActionPerformed(evt);
            }
        });

        iptSenha.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                iptSenhaActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addGap(142, 142, 142)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(TextoSenha, javax.swing.GroupLayout.DEFAULT_SIZE, 147, Short.MAX_VALUE)
                            .addComponent(iptEmail, javax.swing.GroupLayout.DEFAULT_SIZE, 147, Short.MAX_VALUE)
                            .addComponent(TextoEmail, javax.swing.GroupLayout.DEFAULT_SIZE, 147, Short.MAX_VALUE)
                            .addComponent(SejaBemVindo, javax.swing.GroupLayout.DEFAULT_SIZE, 147, Short.MAX_VALUE)
                            .addComponent(iptSenha)))
                    .addGroup(layout.createSequentialGroup()
                        .addGap(183, 183, 183)
                        .addComponent(entrar)))
                .addContainerGap(142, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(49, 49, 49)
                .addComponent(SejaBemVindo)
                .addGap(61, 61, 61)
                .addComponent(TextoEmail)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(iptEmail, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(19, 19, 19)
                .addComponent(TextoSenha)
                .addGap(12, 12, 12)
                .addComponent(iptSenha, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(entrar)
                .addContainerGap(25, Short.MAX_VALUE))
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void iptEmailActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_iptEmailActionPerformed
    }//GEN-LAST:event_iptEmailActionPerformed

    private void entrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_entrarActionPerformed

        AirDataMenu menu = new AirDataMenu();
        Banco banco = new Banco();
        JdbcTemplate connection = banco.getConnection();
        Rede rede = new Rede();
        String MacAddres = rede.Mac();
        email = iptEmail.getText();
        senha = iptSenha.getText();
        if (banco.select(email, senha)) {
            if (banco.select()) {
                this.setVisible(false);
                menu.setVisible(true);
            } else {
                this.setVisible(false);
                menu.setVisible(true);
                
                String query = String.format("insert into servidor(idServidor, fkTorre) values ('%s',2);", MacAddres);
                
                connection.update(query);
            }
        } else {
            JOptionPane.showMessageDialog(null, "Erro ao realizar Login");
        }
    }//GEN-LAST:event_entrarActionPerformed

    private void iptSenhaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_iptSenhaActionPerformed
    }//GEN-LAST:event_iptSenhaActionPerformed

    public static void main(String args[]) {

        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(AirDataLogin.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(AirDataLogin.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(AirDataLogin.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(AirDataLogin.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new AirDataLogin().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel SejaBemVindo;
    private javax.swing.JLabel TextoEmail;
    private javax.swing.JLabel TextoSenha;
    private javax.swing.JButton entrar;
    private javax.swing.JTextField iptEmail;
    private javax.swing.JPasswordField iptSenha;
    // End of variables declaration//GEN-END:variables
}
