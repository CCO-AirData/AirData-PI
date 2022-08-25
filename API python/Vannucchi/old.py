import psutil
import mysql.connector
import os
from mysql.connector import errorcode
#pip install mysql-connector-python
#pip install psutil

#Conexão com o banco de dados
try:
  conector = mysql.connector.connect(user='root', password='sptech',
                              host='localhost',
                              database='airdata')
except mysql.connector.Error as err:
  if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
    print("Something is wrong with your user name or password")
  elif err.errno == errorcode.ER_BAD_DB_ERROR:
    print("Database does not exist")
  else:
    print(err)
bd = conector.cursor()

#Consulta de MAC Address Windows
iface = 'Ethernet'
import psutil
nics = psutil.net_if_addrs()
if iface in nics:
    nic = nics[iface]
    for i in nic:
        if i.family == psutil.AF_LINK:
            macaddress = i.address
else:
    print('Erro ao consultar o MAC Address')


while(True):
    print('O MAC Address da sua maquina é: '+ macaddress + "\nDeseja utilizar um MAC Address personalizado(s/n)?")
    a = input()
    if a == 's' or a == 'S':
        while(True):
            print("Digite um MAC Address (17 caracteres)")
            macaddress = input()
            #len(string) = string.length
            if len(macaddress) <= 17:
                os.system('cls' if os.name == 'nt' else 'clear')
                break
        break
    elif a == 'n' or a == 'N':
        break
    else:
        os.system('cls' if os.name == 'nt' else 'clear')
        print("Digite uma resposta válida!")


#Consulta se o MAC Address já consta na  base, caso não, pede para fazer a configuração
bd.execute("select * from maquina where macAddress = '"+str(macaddress)+"'")
idMaquina = 0
for select in bd:
    if select[0] != 0:
        idMaquina = select[0]
        nomeMaquina = select[1]

if idMaquina == 0:
    #Configuração de maquina
    print("Primeiro acesso!\nInforme o nome da maquina (MAC Address: "+macaddress+")")
    nomeMaquina = input()
    comandoI = "insert into maquina values (null, '"+ str(nomeMaquina) +"' , '"+str(macaddress)+"')"           
    bd.execute(comandoI)   
    conector.commit() 

    bd.execute("select * from maquina where macAddress = '"+str(macaddress)+"'")
    for select in bd:
        if select[0] != 0:
            idMaquina = select[0]
            nomeMaquina = select[1]

#Coletando dados
os.system('cls' if os.name == 'nt' else 'clear')
print("Iniciando coleta de dados...")
while(True):
    coreperc = psutil.cpu_percent(interval=1, percpu=False)
    comandoI = "insert into monitoramento values (null, "+ str(idMaquina) +" , "+str(coreperc)+")"           
    bd.execute(comandoI)    
    conector.commit()              
    print(coreperc)
conector.close()