import psutil
import mysql.connector
from mysql.connector import errorcode
import os
# import wmi
import getmac
import time
import datetime 

#pip install mysql-connector-python
#pip install psutil
#pip install wmi
#pip install getmac

#Conexão com o banco de dados
try:
  conector = mysql.connector.connect(user='aluno', password='sptech',
                              host='localhost',
                              database='airdata')
except mysql.connector.Error as err:
  if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
    print("Problema na conexão")
  elif err.errno == errorcode.ER_BAD_DB_ERROR:
    print("Banco de dados não existe")
  else:
    print(err)
bd = conector.cursor()

#Consulta de MAC Address
macaddress = getmac.get_mac_address()

#Consulta de Serial Number
## SN = wmi.WMI()
## serialN = SN.Win32_BaseBoard()[0].SerialNumber
serialN = "254123652698569"

while(True):
    print('(DEMO)\nO MAC Address da sua maquina é: '+ macaddress + "\nDeseja utilizar um MAC Address personalizado(s/n)?")
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

while(True):
    print('(DEMO)\nO Serial Number da sua maquina é: '+ serialN + "\nDeseja utilizar um Serial Number personalizado(s/n)?")
    a = input()
    if a == 's' or a == 'S':
        while(True):
            print("Digite um Serial Number")
            serialN = input()
            #len(string) = string.length
            if len(serialN) <= 45:
                os.system('cls' if os.name == 'nt' else 'clear')
                break
        break
    elif a == 'n' or a == 'N':
        break
    else:
        os.system('cls' if os.name == 'nt' else 'clear')
        print("Digite uma resposta válida!")

# Verificando se a maquina está na black list
bd.execute("select * from blacklist where macAddress = '"+str(macaddress)+"' or serialNumber = '"+str(serialN)+"'")
for select in bd:
    if select[0] != 0:
        os.system('cls' if os.name == 'nt' else 'clear')
        print("Maquina Bloqueada!\nContate seu Gestor")
        input()
        exit()

# Validação de torre
os.system('cls' if os.name == 'nt' else 'clear')
print("""

██████╗ ███████╗███╗   ███╗    ██╗   ██╗██╗███╗   ██╗██████╗  ██████╗     ██╗
██╔══██╗██╔════╝████╗ ████║    ██║   ██║██║████╗  ██║██╔══██╗██╔═══██╗    ██║
██████╔╝█████╗  ██╔████╔██║    ██║   ██║██║██╔██╗ ██║██║  ██║██║   ██║    ██║
██╔══██╗██╔══╝  ██║╚██╔╝██║    ╚██╗ ██╔╝██║██║╚██╗██║██║  ██║██║   ██║    ╚═╝
██████╔╝███████╗██║ ╚═╝ ██║     ╚████╔╝ ██║██║ ╚████║██████╔╝╚██████╔╝    ██╗
╚═════╝ ╚══════╝╚═╝     ╚═╝      ╚═══╝  ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝     ╚═╝
""")

torreId = 0                                                                 
while(torreId == 0):
    print("""Selecione uma opção:
[1] Entrar no sistema
[2] Sair""")

    escolha = input()
    if escolha == '1':
        # Entrar no sistema
        os.system('cls' if os.name == 'nt' else 'clear')
        while(torreId == 0):
            print("Insira o login da torre que deseja entrar:")
            loginTorre = input()
            print("Insira a senha da torre que deseja entrar:")
            senhaTorre = input()
            # validação de login na torre
            bd.execute("select * from torre where login = '"+str(loginTorre)+"' and senha = '"+str(senhaTorre)+"'")
            for select in bd:
                if select[0] != 0:
                    torreId = select[0]
                    nomeTorre = select[1]
            if torreId == 0:
                os.system('cls' if os.name == 'nt' else 'clear')
                print("Login e/ou senha incorretos!")
                now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                comandoI = "insert into logTorre values ('"+macaddress+"','"+serialN+"','"+now+"','"+loginTorre+"','"+senhaTorre+"');"           
                bd.execute(comandoI)    
                conector.commit()
                # verificar se a maquina será bloqueada (3 tentativas incorretas dentro de 7 dias)
                bd.execute("select count(macAddress) from logTorre where macaddress = '"+macaddress+"' and momentologin > (NOW() - INTERVAL 7 DAY)")
                for select in bd:
                    if select[0] >= 3:
                        #maquina bloqueada, cadastrando ela no sistema de blacklist
                        now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        comandoI = "insert into blacklist values (null, '"+str(macaddress)+"' , '"+str(serialN)+"','"+str(now)+"')"           
                        bd.execute(comandoI)   
                        conector.commit()
                        print("Maquina Bloqueada!\nContate seu Gestor")
                        input()
                        exit()
                        
                    

    elif escolha == '2':
        exit()
    else:
        os.system('cls' if os.name == 'nt' else 'clear')
        print("Escolha uma opção válida!") 


#Consulta se o MAC Address já consta na base, caso não, pede para fazer a configuração
bd.execute("select * from maquina where macAddress = '"+str(macaddress)+"'")
idMaquina = 0
for select in bd:
    if select[0] != 0:
        idMaquina = select[0]
        nomeMaquina = select[1]


if idMaquina == 0:
    #Configuração de maquina
    while(True):
        print("Primeiro acesso!\nInforme o nome da maquina (MAC Address: "+macaddress+", Serial Number: "+macaddress+")")
        nomeMaquina = input()
        if(nomeMaquina != ""):
            break
        else:
            os.system('cls' if os.name == 'nt' else 'clear')
            print("O nome da maquina não pode estar vazio!")
    comandoI = "insert into maquina values (null, "+str(torreId)+", '"+ str(nomeMaquina) +"' , '"+str(macaddress)+"' , '"+str(serialN)+"')"           
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
    # % RAM
    percRAM = psutil.virtual_memory().percent
    # RAM Disponivel
    totalRAM = float((psutil.virtual_memory().total)/(1024**3))
    dispRAM = (round((totalRAM-(totalRAM * percRAM)/100), 2))
    # CPU
    totalCPU = (psutil.cpu_freq().max/1000)
    # % CPU
    percCPU = psutil.cpu_percent(interval=None, percpu=False)
    # CPU Disponivel
    dispCPU = (round((totalCPU-(totalCPU * percCPU)/100), 2))
    # Disco
    totalDisco = round((psutil.disk_usage('/').total)/(1024**3), 0)
    usadoDisco = round((psutil.disk_usage('/').used)/(1024**3), 0)
    # Disco Livre
    livreDisco = totalDisco-usadoDisco
    # % Disco
    percDisco = (psutil.disk_usage('/').percent)

    
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    comandoI = "insert into monitoramento values (null, "+ str(idMaquina) +" , "+str(percRAM)+" , "+str(dispRAM)+" , "+str(percCPU)+" , "+str(dispCPU)+" , "+str(livreDisco)+" , "+str(percDisco)+" , '"+str(now)+"')"           
    bd.execute(comandoI)    
    conector.commit()             


    #Temp -- informando os dados q foram inseridos
    print("Memória RAM Consumida: " + str(percRAM) + "%")
    print("Memória RAM Disponível: " + str(dispRAM) + " GB")
    print("Memória CPU Consumida: " + str(percCPU) + "%")
    print("Memória CPU Disponível: " + str(dispCPU) + " GHz")
    print("Total Livre Disco Rígido: " + str(livreDisco) + " GB")
    print("Pocentagem Ocupado Disco Rígido: " + str(percDisco) + "%")

    time.sleep(5)
    os.system('cls' if os.name == 'nt' else 'clear')