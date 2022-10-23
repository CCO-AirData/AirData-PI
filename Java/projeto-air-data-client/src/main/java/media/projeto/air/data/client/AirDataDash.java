/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
package media.projeto.air.data.client;

import com.github.britooo.looca.api.core.Looca;
import com.github.britooo.looca.api.group.discos.Volume;
import com.github.britooo.looca.api.group.processador.Processador;
import java.awt.Color;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 *
 * @author Victor
 */
public class AirDataDash  extends javax.swing.JFrame {

    Looca looca = new Looca();

    Timer time = new Timer();

    final long segundos = (1000 * 1);

    final long tempo = (1000 * 5);

    long giga = Math.round(Math.pow(1024, 3));

    TimerTask monitoramento;

    TimerTask insert;

    public AirDataDash() throws UnknownHostException, SocketException {
        getContentPane().setBackground(Color.WHITE);
        try {
            UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(AirDataDash.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            Logger.getLogger(AirDataDash.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            Logger.getLogger(AirDataDash.class.getName()).log(Level.SEVERE, null, ex);
        } catch (UnsupportedLookAndFeelException ex) {
            Logger.getLogger(AirDataDash.class.getName()).log(Level.SEVERE, null, ex);
        }
        
MacAddress rede = new MacAddress();
        this.monitoramento = new TimerTask() {
            @Override
            public void run() {
                //repetindo

                
                Processador processador = looca.getProcessador();

                Double processadorUso = looca.getProcessador().getUso();

                Long memoriaUso = (looca.getMemoria().getEmUso() * 100) / looca.getMemoria().getTotal();

                List<Volume> discoTotal = looca.getGrupoDeDiscos().getVolumes();

                Integer respostaCPU = processadorUso.intValue();

                Integer respostaMemoria = memoriaUso.intValue();

                String sistema = looca.getSistema().toString();

                String memoria = looca.getMemoria().toString();

                ram.setValue(respostaMemoria);

                cpu.setValue(respostaCPU);

                try {
                    resultadoRede.setText("Placa: " + rede.Placa() + "\n" + "HostName: " + rede.Host() + "\n" + "IP: " + rede.IP() + "\n" + "Endereço Mac: " + rede.Mac());
                } catch (UnknownHostException ex) {
                    Logger.getLogger(AirDataDash.class.getName()).log(Level.SEVERE, null, ex);
                } catch (SocketException ex) {
                    Logger.getLogger(AirDataDash.class.getName()).log(Level.SEVERE, null, ex);
                }

                resultadoProcessador.setText(processador.toString());

                resultadoSistema.setText(sistema);

                resultadoDisco.setText("Informações do Disco:\n Disco: " + discoTotal.get(0).getPontoDeMontagem() + " \n Tamanho Total: " + discoTotal.get(0).getTotal() / giga + " GiB" + "\n" + "Tamanho Disponível: " + discoTotal.get(0).getDisponivel() / giga + " GiB");

                resultadoMemoria.setText(memoria);

            }
        };

        this.insert = new TimerTask() {
            @Override
            public void run() {
                Banco banco = new Banco();
                
                String MacAddres = rede.Mac();
                Double processadorUso = looca.getProcessador().getUso();
                Integer respostaCPU = processadorUso.intValue();
                Long memoriaUso = (looca.getMemoria().getEmUso() * 100) / looca.getMemoria().getTotal();
List<Volume> discoTotal = looca.getGrupoDeDiscos().getVolumes();
                JdbcTemplate connection = banco.getConnection();
              
                String CPU = String.format("insert into leitura values(1,GETDATE(),%d,29,'%s')",respostaCPU, MacAddres);
                String RAM = String.format("insert into leitura values(2,GETDATE(),%d,31,'%s')",memoriaUso, MacAddres);
                String DISCO = String.format("insert into leitura values(3,GETDATE(),%d,30,'%s')",discoTotal.get(0).getDisponivel()/giga, MacAddres);
                
                connection.update(CPU);
                connection.update(RAM);
                connection.update(DISCO);
                
            }
        };
        initComponents();

        resultadoSistema.setEditable(false);
        resultadoMemoria.setEditable(false);
        resultadoDisco.setEditable(false);
        resultadoRede.setEditable(false);
        time.scheduleAtFixedRate(monitoramento, 0, segundos);
        time.scheduleAtFixedRate(insert, 0,segundos);
    }

//    time.scheduleAtFixedRate (monitoramento,0,segundos);
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jScrollPane1 = new javax.swing.JScrollPane();
        resultadoMemoria = new javax.swing.JTextArea();
        cpu = new javax.swing.JProgressBar();
        ram = new javax.swing.JProgressBar();
        jScrollPane2 = new javax.swing.JScrollPane();
        resultadoDisco = new javax.swing.JTextArea();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        sistema = new javax.swing.JScrollPane();
        resultadoSistema = new javax.swing.JTextArea();
        jLabel7 = new javax.swing.JLabel();
        jScrollPane3 = new javax.swing.JScrollPane();
        resultadoProcessador = new javax.swing.JTextArea();
        jLabel8 = new javax.swing.JLabel();
        jScrollPane4 = new javax.swing.JScrollPane();
        resultadoRede = new javax.swing.JTextArea();
        jLabel9 = new javax.swing.JLabel();

        jPanel1.setOpaque(false);

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 100, Short.MAX_VALUE)
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 100, Short.MAX_VALUE)
        );

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setBackground(new java.awt.Color(82, 185, 217));
        setForeground(new java.awt.Color(82, 185, 217));
        setMinimumSize(new java.awt.Dimension(883, 580));
        setResizable(false);

        resultadoMemoria.setColumns(20);
        resultadoMemoria.setRows(5);
        resultadoMemoria.setToolTipText("");
        resultadoMemoria.setMargin(new java.awt.Insets(3, 3, 0, 0));
        jScrollPane1.setViewportView(resultadoMemoria);

        cpu.setBackground(new java.awt.Color(255, 255, 255));
        cpu.setForeground(new java.awt.Color(82, 185, 217));
        cpu.setToolTipText("");
        cpu.setStringPainted(true);

        ram.setBackground(new java.awt.Color(255, 255, 255));
        ram.setForeground(new java.awt.Color(82, 185, 217));
        ram.setStringPainted(true);

        resultadoDisco.setColumns(20);
        resultadoDisco.setRows(5);
        resultadoDisco.setMargin(new java.awt.Insets(3, 3, 0, 0));
        jScrollPane2.setViewportView(resultadoDisco);

        jLabel1.setBackground(new java.awt.Color(255, 255, 255));
        jLabel1.setFont(new java.awt.Font("Algerian", 0, 12)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(82, 185, 217));
        jLabel1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel1.setText("Porcentagem de uso da CPU");

        jLabel2.setFont(new java.awt.Font("Algerian", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(82, 185, 217));
        jLabel2.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel2.setText("Porcentagem de uso da Memória");

        jLabel3.setFont(new java.awt.Font("Algerian", 0, 24)); // NOI18N
        jLabel3.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel3.setText("Monitoramento Air-Data");

        jLabel4.setFont(new java.awt.Font("Algerian", 0, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(82, 185, 217));
        jLabel4.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel4.setText("Informações do Disco");

        jLabel5.setFont(new java.awt.Font("Algerian", 0, 12)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(82, 185, 217));
        jLabel5.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel5.setText("Informações da Memória");

        resultadoSistema.setColumns(20);
        resultadoSistema.setRows(5);
        resultadoSistema.setMargin(new java.awt.Insets(3, 3, 0, 0));
        sistema.setViewportView(resultadoSistema);

        jLabel7.setFont(new java.awt.Font("Algerian", 0, 12)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(82, 185, 217));
        jLabel7.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel7.setText("Informações do Sistema");

        resultadoProcessador.setColumns(20);
        resultadoProcessador.setRows(5);
        resultadoProcessador.setMargin(new java.awt.Insets(3, 3, 0, 0));
        jScrollPane3.setViewportView(resultadoProcessador);

        jLabel8.setFont(new java.awt.Font("Algerian", 0, 12)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(82, 185, 217));
        jLabel8.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel8.setText("Informações do Processador");

        resultadoRede.setColumns(20);
        resultadoRede.setRows(5);
        resultadoRede.setMargin(new java.awt.Insets(3, 3, 0, 0));
        jScrollPane4.setViewportView(resultadoRede);

        jLabel9.setFont(new java.awt.Font("Algerian", 0, 12)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(82, 185, 217));
        jLabel9.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel9.setText("Informações da Rede");

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(cpu, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(ram, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(layout.createSequentialGroup()
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 234, Short.MAX_VALUE)
                                    .addComponent(jLabel5, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(jScrollPane2))
                                .addGap(7, 7, 7))
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                                .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 234, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)))
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(jScrollPane4, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 281, Short.MAX_VALUE)
                            .addComponent(sistema)
                            .addComponent(jLabel7, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(jLabel9, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jScrollPane3)
                            .addComponent(jLabel8, javax.swing.GroupLayout.DEFAULT_SIZE, 304, Short.MAX_VALUE))
                        .addGap(10, 10, 10)))
                .addContainerGap())
            .addGroup(layout.createSequentialGroup()
                .addGap(268, 268, 268)
                .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 334, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(18, 18, 18)
                .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addComponent(cpu, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel2)
                .addGap(18, 18, 18)
                .addComponent(ram, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(34, 34, 34)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel5)
                    .addComponent(jLabel7)
                    .addComponent(jLabel8))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 103, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(sistema, javax.swing.GroupLayout.PREFERRED_SIZE, 118, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(18, 18, 18)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel9)
                            .addComponent(jLabel4))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 118, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                                .addComponent(jScrollPane4, javax.swing.GroupLayout.PREFERRED_SIZE, 118, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(11, 11, 11))))
                    .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 189, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
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
            java.util.logging.Logger.getLogger(AirDataDash.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(AirDataDash.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(AirDataDash.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(AirDataDash.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                try {
                    new AirDataDash().setVisible(true);
                } catch (UnknownHostException ex) {
                    Logger.getLogger(AirDataDash.class.getName()).log(Level.SEVERE, null, ex);
                } catch (SocketException ex) {
                    Logger.getLogger(AirDataDash.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JProgressBar cpu;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JScrollPane jScrollPane4;
    private javax.swing.JProgressBar ram;
    private javax.swing.JTextArea resultadoDisco;
    private javax.swing.JTextArea resultadoMemoria;
    private javax.swing.JTextArea resultadoProcessador;
    private javax.swing.JTextArea resultadoRede;
    private javax.swing.JTextArea resultadoSistema;
    private javax.swing.JScrollPane sistema;
    // End of variables declaration//GEN-END:variables
}
