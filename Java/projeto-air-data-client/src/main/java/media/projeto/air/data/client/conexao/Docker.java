        /*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package media.projeto.air.data.client.conexao;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author
 */
public class Docker {
    // Criando o construtor para identificar o banco
  public Connection Docker() throws IOException {
  Connection conn = null;
        String ipv4 = getIpv4();
        
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        
        try {
            conn = DriverManager.getConnection("jdbc:mysql://" + ipv4 + "/airData", "root", "urubu100");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return conn;
  }
  public Boolean getConexao(){
      try {
          Connection conn = null;
        String ipv4 = getIpv4();
        
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        
        try {
            conn = DriverManager.getConnection("jdbc:mysql://" + ipv4 + "/airData", "root", "urubu100");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return true;
      } catch (Exception e) {
          return false;
      }
  }
  
   private String getIpv4() throws MalformedURLException, IOException{
        
        String urlString = "http://checkip.amazonaws.com/";
        URL url = new URL(urlString);
        try (BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()))) {
        
            return br.readLine();
        }
    }
}

