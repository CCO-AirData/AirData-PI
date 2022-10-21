/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package media.projeto.air.data.client;

/**
 *
 * @author Victor
 */

// Java program to access the MAC address of the
// localhost machine

import com.github.britooo.looca.api.core.Looca;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import oshi.hardware.platform.windows.WindowsHardwareAbstractionLayer;
import oshi.hardware.platform.linux.LinuxHardwareAbstractionLayer;


public class MacAddress {
    Looca looca = new Looca();
            
    WindowsHardwareAbstractionLayer windows = new WindowsHardwareAbstractionLayer();    
    LinuxHardwareAbstractionLayer linux = new LinuxHardwareAbstractionLayer();

    public String Placa() throws UnknownHostException, SocketException{
        InetAddress localHost = Inet4Address.getLocalHost();
NetworkInterface networkInterface = NetworkInterface.getByInetAddress(localHost);        
        return networkInterface.getDisplayName();
    }
    
    public String Host() throws UnknownHostException{
        InetAddress localHost = Inet4Address.getLocalHost();
    return localHost.getHostName();
    }
    
    public String IP() throws UnknownHostException{
        InetAddress localHost = Inet4Address.getLocalHost();
    return localHost.getHostAddress();
    }
    
    
    
  public String Mac(){
      String sistema = looca.getSistema().toString();
      String rede;
      if (sistema.contains("Windows")) {
       rede = windows.getNetworkIFs(false).get(0).getMacaddr();
      }
      else{
      rede = linux.getNetworkIFs(false).get(0).getMacaddr();
      }
      return rede;
}

  

}