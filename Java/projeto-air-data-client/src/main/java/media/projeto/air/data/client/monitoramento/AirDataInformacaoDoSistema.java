package media.projeto.air.data.client.monitoramento;

import com.github.britooo.looca.api.core.Looca;
import com.github.britooo.looca.api.group.discos.Volume;
import com.github.britooo.looca.api.group.processador.Processador;
import java.awt.Color;
import java.io.IOException;
import java.net.SocketException;
import java.sql.SQLException;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import media.projeto.air.data.client.conexao.Banco;
import media.projeto.air.data.client.conexao.Docker;
import media.projeto.air.data.client.rede.Rede;
import org.springframework.jdbc.core.JdbcTemplate;

public class AirDataInformacaoDoSistema extends javax.swing.JFrame {

    Looca looca = new Looca();

    Timer time = new Timer();

    final long segundos = (1000 * 1);

    final long tempo = (1000 * 5);

    long giga = Math.round(Math.pow(1024, 3));

    TimerTask monitoramento;

    TimerTask insert;

    public AirDataInformacaoDoSistema() throws UnknownHostException, SocketException {
        getContentPane().setBackground(Color.WHITE);
        try {
            UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(Level.SEVERE, null, ex);
        } catch (UnsupportedLookAndFeelException ex) {
            Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(Level.SEVERE, null, ex);
        }

        Rede rede = new Rede();
        this.monitoramento = new TimerTask() {
            @Override
            public void run() {

                Processador processador = looca.getProcessador();

                List<Volume> discoTotal = looca.getGrupoDeDiscos().getVolumes();

                String sistema = looca.getSistema().toString();

                String memoria = looca.getMemoria().toString();

                try {
                    resultadoRede.setText("Placa: " + rede.Placa() + "\n" + "HostName: " + rede.Host() + "\n" + "IP: " + rede.IP() + "\n" + "Endereço Mac: " + rede.Mac());
                } catch (UnknownHostException | SocketException ex) {
                    Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(Level.SEVERE, null, ex);
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
                Docker docker = new Docker();

                String MacAddres = rede.Mac();

                Double processadorUso = looca.getProcessador().getUso();

                Integer respostaCPU = processadorUso.intValue();

                Long memoriaUso = (looca.getMemoria().getEmUso() * 100) / looca.getMemoria().getTotal();

                List<Volume> discoTotal = looca.getGrupoDeDiscos().getVolumes();

                String fkCPU = String.format("select idComponente from vw_componenteMetrica where fkServidor = '%s' and tipoComponente = 'CPU' and nomeMetrica = 'Porcentagem de uso'", MacAddres);

                String fkRAM = String.format("select idComponente from vw_componenteMetrica where fkServidor = '%s' and tipoComponente = 'RAM' and nomeMetrica = 'Porcentagem de uso'", MacAddres);

                String fkDISCO = String.format("select idComponente from vw_componenteMetrica where fkServidor = '%s' and tipoComponente = 'DISCO' and nomeMetrica = 'Porcentagem de uso'", MacAddres);

                String sistema = looca.getSistema().toString();
                if (sistema.contains("Windows")) {
                    if (banco.getConexao()) {
                        JdbcTemplate connection = banco.getConnection();

                        String CPU = String.format("insert into leitura values(1,GETDATE(),%d,(%s),'%s')", respostaCPU, fkCPU, MacAddres);

                        String RAM = String.format("insert into leitura values(2,GETDATE(),%d,(%s),'%s')", memoriaUso, fkRAM, MacAddres);

                        String DISCO = String.format("insert into leitura values(3,GETDATE(),%d,(%s),'%s')", (discoTotal.get(0).getDisponivel() / giga), fkDISCO, MacAddres);

                        connection.update(CPU);
                        connection.update(RAM);
                        connection.update(DISCO);
                        System.out.println("Inseri na Azure");
                    } else {
                        System.out.println("Não foi possivel inserir na Azure");
                    }
                } else if (sistema.contains("Linux")) {
                    JdbcTemplate connection = banco.getConnection();

                    String CPU = String.format("insert into leitura values(1,GETDATE(),%d,(%s),'%s')", respostaCPU, fkCPU, MacAddres);

                    String RAM = String.format("insert into leitura values(2,GETDATE(),%d,(%s),'%s')", memoriaUso, fkRAM, MacAddres);

                    String DISCO = String.format("insert into leitura values(3,GETDATE(),%d,(%s),'%s')", (discoTotal.get(0).getDisponivel() / giga), fkDISCO, MacAddres);

                    if (banco.getConexao()) {
                        connection.update(CPU);
                        connection.update(RAM);
                        connection.update(DISCO);
                        System.out.println("Inseri na Azure");
                    } else if (docker.getConexao()) {
                        Connection conn = null;
                        PreparedStatement ps = null;

                        try {
                            conn = docker.Docker();
                        } catch (IOException ex) {
                            System.out.println(ex);
                        }
                        String CPU1 = String.format("insert into leitura values(1,now(),%d,(%s),'%s')", respostaCPU, fkCPU, MacAddres);

                        String RAM1 = String.format("insert into leitura values(2,now(),%d,(%s),'%s')", memoriaUso, fkRAM, MacAddres);

                        String DISCO1 = String.format("insert into leitura values(3,now(),%d,(%s),'%s')", (discoTotal.get(0).getDisponivel() / giga), fkDISCO, MacAddres);

                        try {
                            ps = conn.prepareStatement(RAM1);
                            ps.execute();
                            ps = conn.prepareStatement(CPU1);
                            ps.execute();
                            ps = conn.prepareStatement(DISCO1);
                            ps.execute();
                            System.out.println("Inseri no Local");
                        } catch (SQLException ex) {
                        }

                    }

                } else {
                    System.out.println("Sistema não encontrado");
                }
            }
        };
        initComponents();

        resultadoSistema.setEditable(false);
        resultadoMemoria.setEditable(false);
        resultadoDisco.setEditable(false);
        resultadoRede.setEditable(false);
        resultadoProcessador.setEditable(false);
        time.scheduleAtFixedRate(monitoramento, 0, segundos);
        time.scheduleAtFixedRate(insert, 0, tempo);
    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jScrollPane1 = new javax.swing.JScrollPane();
        resultadoMemoria = new javax.swing.JTextArea();
        jScrollPane2 = new javax.swing.JScrollPane();
        resultadoDisco = new javax.swing.JTextArea();
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
        jButton1 = new javax.swing.JButton();

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
        setIconImages(null);
        setMinimumSize(new java.awt.Dimension(883, 410));

        resultadoMemoria.setColumns(20);
        resultadoMemoria.setRows(5);
        resultadoMemoria.setToolTipText("");
        resultadoMemoria.setMargin(new java.awt.Insets(3, 3, 0, 0));
        jScrollPane1.setViewportView(resultadoMemoria);

        resultadoDisco.setColumns(20);
        resultadoDisco.setRows(5);
        resultadoDisco.setMargin(new java.awt.Insets(3, 3, 0, 0));
        jScrollPane2.setViewportView(resultadoDisco);

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

        jButton1.setText("Voltar");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                        .addComponent(jLabel5, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jScrollPane2, javax.swing.GroupLayout.DEFAULT_SIZE, 234, Short.MAX_VALUE))
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 234, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 234, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 281, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jScrollPane4, javax.swing.GroupLayout.PREFERRED_SIZE, 305, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                        .addComponent(jLabel9, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(sistema, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, 299, Short.MAX_VALUE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane3)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addGap(0, 0, Short.MAX_VALUE)
                        .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 83, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(97, 97, 97))
                    .addComponent(jLabel8, javax.swing.GroupLayout.DEFAULT_SIZE, 296, Short.MAX_VALUE))
                .addContainerGap())
            .addComponent(jLabel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(18, 18, 18)
                .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel5)
                            .addComponent(jLabel7))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(sistema, javax.swing.GroupLayout.DEFAULT_SIZE, 130, Short.MAX_VALUE)
                            .addComponent(jScrollPane1))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel9, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(jLabel4))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(jScrollPane2, javax.swing.GroupLayout.DEFAULT_SIZE, 139, Short.MAX_VALUE)
                            .addComponent(jScrollPane4))
                        .addGap(24, 24, 24))
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(jLabel8)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 219, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(35, 35, 35)
                        .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap(31, Short.MAX_VALUE))))
        );

        pack();
        setLocationRelativeTo(null);
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
            java.util.logging.Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                try {
                    new AirDataInformacaoDoSistema().setVisible(true);
                } catch (UnknownHostException | SocketException ex) {
                    Logger.getLogger(AirDataInformacaoDoSistema.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton jButton1;
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
    private javax.swing.JTextArea resultadoDisco;
    private javax.swing.JTextArea resultadoMemoria;
    private javax.swing.JTextArea resultadoProcessador;
    private javax.swing.JTextArea resultadoRede;
    private javax.swing.JTextArea resultadoSistema;
    private javax.swing.JScrollPane sistema;
    // End of variables declaration//GEN-END:variables
}
