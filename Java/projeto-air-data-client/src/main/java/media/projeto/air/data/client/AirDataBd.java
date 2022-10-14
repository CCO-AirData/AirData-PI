/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package media.projeto.air.data.client;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author Victor
 */
public class AirDataBd {
    private Connection connection;

    public AirDataBd() throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.jdbc.Driver");
        connection = DriverManager.getConnection("jdbc:mysql//localhost/airdata", "root", "#Gf52401322833");
        System.out.println("Conectado com sucesso");
  
    }
    
//    public static void main(String[] args) {
//        try {
//            new AirDataBd();
//        } catch (Exception e) {
//            System.out.println("Não conectado...");
//        }
//    }
}
