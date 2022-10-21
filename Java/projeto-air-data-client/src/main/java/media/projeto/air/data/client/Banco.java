/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package media.projeto.air.data.client;

import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 *
 * @author ivanm
 */
public class Banco {
    
   
 private JdbcTemplate connection;


    // Criando o construtor para identificar o banco
  public Banco() {



    BasicDataSource dataSource = new BasicDataSource();

    dataSource​.setDriverClassName("com.mysql.jdbc.Driver");
    
    // Colocar aqui o caminho do banco e o nome do database -- padrão = localhost:3306
    dataSource​.setUrl("jdbc:mysql://127.0.0.1:3306/airdata");
    
    // Nome do usuário da conexão 
    dataSource​.setUsername("airdata_client");
    
    // Senha da conexão 
    dataSource​.setPassword("sptech");

    this.connection = new JdbcTemplate(dataSource);

  }
  
  
  public String criptografia(String passwordToHash){
    String generatedPassword = null;
    try {
        MessageDigest md = MessageDigest.getInstance("SHA-512");
        byte[] bytes = md.digest(passwordToHash.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for(int i=0; i< bytes.length ;i++){
            sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
        }
        generatedPassword = sb.toString();
    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
    }
    return generatedPassword;
}
  
 
  
  public Boolean select(String email, String senha){
      String senhaCriptografada = criptografia(senha);
      String conexao = String.format("SELECT * FROM vw_iniciarSessao WHERE emailUsuario = '%s' AND senhaUsuario = '%s';",email,senhaCriptografada);
   List <Banco> resultado = connection.query(conexao, new BeanPropertyRowMapper(Banco.class));
      System.out.println(resultado);
      
      if (resultado.size() == 0) {
          return false;
      }
      else{
      return true;
      }
  }
  
  public Boolean select(){
   MacAddress rede = new MacAddress();
   
   
       String conexao = String.format("SELECT * FROM servidor where idServidor = '%s'",rede.Mac());
       List <Banco> resultado = connection.query(conexao, new BeanPropertyRowMapper(Banco.class));
       if (resultado.size() == 0) {
          return false;
      }
      else{
      return true;
      }
      
  }
 
  
  public JdbcTemplate getConnection() {

    return connection;

  }

   
  

}