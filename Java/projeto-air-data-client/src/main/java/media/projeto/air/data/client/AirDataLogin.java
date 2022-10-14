/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
package media.projeto.air.data.client;

/**
 *
 * @author Victor
 */

import javax.swing.*;



public class AirDataLogin extends javax.swing.JFrame {

    String email;
    String senha;
 

    public AirDataLogin() {
        initComponents();
        String email = "" ;
        String senha = "";
        

    }

    AirDataDash dash = new AirDataDash();
    

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        SejaBemVindo = new javax.swing.JLabel();
        iptSenha = new javax.swing.JTextField();
        TextoSenha = new javax.swing.JLabel();
        TextoEmail = new javax.swing.JLabel();
        iptEmail = new javax.swing.JTextField();
        entrar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        SejaBemVindo.setForeground(new java.awt.Color(0, 0, 255));
        SejaBemVindo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        SejaBemVindo.setText("LOGIN");

        iptSenha.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                iptSenhaActionPerformed(evt);
            }
        });

        TextoSenha.setText("Sua Senha:");

        TextoEmail.setText("Seu Email:");

        iptEmail.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                iptEmailActionPerformed(evt);
            }
        });

        entrar.setText("Logar");
        entrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                entrarActionPerformed(evt);
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
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(TextoSenha, javax.swing.GroupLayout.PREFERRED_SIZE, 147, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(iptSenha, javax.swing.GroupLayout.PREFERRED_SIZE, 147, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(iptEmail, javax.swing.GroupLayout.PREFERRED_SIZE, 147, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(TextoEmail, javax.swing.GroupLayout.PREFERRED_SIZE, 147, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(SejaBemVindo, javax.swing.GroupLayout.PREFERRED_SIZE, 147, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addGroup(layout.createSequentialGroup()
                        .addGap(183, 183, 183)
                        .addComponent(entrar)))
                .addContainerGap(158, Short.MAX_VALUE))
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
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(iptSenha, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(entrar)
                .addContainerGap(127, Short.MAX_VALUE))
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void iptSenhaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_iptSenhaActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_iptSenhaActionPerformed

    private void iptEmailActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_iptEmailActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_iptEmailActionPerformed

    private void entrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_entrarActionPerformed
        // TODO add your handling code here:
        Banco banco = new Banco();
        
         
        email = iptEmail.getText();

        senha = iptSenha.getText();

        
        if (banco.select(email, senha)) {
              this.setVisible(false);
            dash.setVisible(true);
        }
        else{
              JOptionPane.showMessageDialog(null, "Erro ao realizar Login");
        }
    }//GEN-LAST:event_entrarActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[])  {
       
       
      
      
        
        
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
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
        //</editor-fold>
        //</editor-fold>
        

        /* Create and display the form */
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
    private javax.swing.JTextField iptSenha;
    // End of variables declaration//GEN-END:variables
}
