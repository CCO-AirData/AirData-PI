import psutil
import mysql.connector
import os
import time
import wmi
import getmac
import datetime 
from mysql.connector import errorcode
import psutil
import mysql.connector
import datetime
import os
import platform

from turtle import title
from typing import Text
from time import sleep
from dashing import HSplit, VSplit, VGauge, HGauge
from psutil import(
 virtual_memory,
 swap_memory,
 cpu_times,
cpu_percent,
disk_partitions,
disk_io_counters,
disk_usage,
)
#pip install mysql-connector-python
#pip install psutil
#pip install wmi
#pip install getmac

#Conexão com o banco de dados
try:
  conector = mysql.connector.connect(user='root', password='10688159818',
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

#Consulta de MAC Address
macaddress = getmac.get_mac_address()

#Consulta de Serial Number
SN = wmi.WMI()
serialN = SN.Win32_BaseBoard()[0].SerialNumber

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
            print("Digite um Serial Number (15 caracteres)")
            serialN = input()
            #len(string) = string.length
            if len(serialN) <= 15:
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
idMaquina = 0
for select in bd:
    if select[0] != 0:
        os.system('cls' if os.name == 'nt' else 'clear')
        print("Maquina Bloqueada!\nContate seu Gestor")
        input()
        exit()

#Consulta se o MAC Address já consta na base, caso não, pede para fazer a configuração
bd.execute("select * from maquina where macAddress = '"+str(macaddress)+"'")
idMaquina = 0
for select in bd:
    if select[0] != 0:
        idMaquina = select[0]
        nomeMaquina = select[1]

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
                    print("foi")
            if torreId == 0:
                os.system('cls' if os.name == 'nt' else 'clear')
                print("Login e/ou senha incorretos!")
                now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                comandoI = "insert into logTorre valnues ('"+macaddress+"','"+serialN+"','"+now+"','"+loginTorre+"','"+senhaTorre+"');"           
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

os.system('cls' if os.name == 'nt' else 'clear')
print("Iniciando coleta de dados...")

# Plotagem de gráfico

ui = HSplit (# ui.items
    HSplit(# ui.items[0]
        VGauge(title='RAM'), # ui.items[0].items[0]
        VGauge(title='SWAP'), # ui.items[0].items[1]
        title='Memória',
        border_color=3
    ),
    VSplit (# ui.items[1]
        HGauge (title='CPU %'),
        title='CPU',
        border_color=5,
    ),
    HSplit (# ui.items[2]
        HGauge (title='DiSCO_USO'),
        title='DISCO',
        border_color=3,
    ),
    
)

#Coletando dados

while True:
    # # Memória
    mem_tui = ui.items[0]

    # RAM
    ram_tui = mem_tui.items[0]
    ram_tui.value = virtual_memory().percent
    ram_tui.title = f'RAM {ram_tui.value} %'

    # SWAPc
    swap_tui = mem_tui.items[1]
    swap_tui.value = swap_memory().percent
    swap_tui.title = f'SWAP {swap_tui.value} %'

    # # CPU
    cpu_tui = ui.items[1]
    # # CPU %
    cpu_percent_tui = cpu_tui.items[0]
    ps_cpu_percent = cpu_percent()
    cpu_percent_tui.value = ps_cpu_percent
    cpu_percent_tui.title = f'CPU {ps_cpu_percent}%'

    # # DISCO

    diskT_tui = ui.items[2]

    # # DISCO_USO
    disk_tui = diskT_tui.items[0]
    ps_disk_percent = disk_usage('/').percent
    disk_tui.value = ps_disk_percent
    disk_tui.title = f'Uso {ps_disk_percent}%'



    try:
        ui.display()
        sleep(5)
    except KeyboardInterrupt:
        break

# Inserção no Banco

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
    totalDisco = round((psutil.disk_usage('C:\\').total)/(1024**3), 0)
    usadoDisco = round((psutil.disk_usage('C:\\').used)/(1024**3), 0)
    # Disco Livre
    livreDisco = totalDisco-usadoDisco
    # % Disco
    percDisco = (psutil.disk_usage('C:\\').percent)

    
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    comandoI = "insert into monitoramento values (null, "+ str(idMaquina) +" , "+str(percRAM)+" , "+str(dispRAM)+" , "+str(percCPU)+" , "+str(dispCPU)+" , "+str(livreDisco)+" , "+str(percDisco)+" , '"+str(now)+"')"           
    bd.execute(comandoI)    
    conector.commit()             


    os.system('cls' if os.name == 'nt' else 'clear')
conector.close()