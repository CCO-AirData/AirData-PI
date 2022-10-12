import psutil
import mysql.connector
import os
import getmac
import datetime
from time import sleep
from dashing import HSplit, VSplit, VGauge, HGauge


#pip install mysql-connector-python
#pip install psutil
#pip install wmi
#pip install getmac

#Conexão com o banco de dadosz
try:
    conector = mysql.connector.connect(user='root', password='Alfajor12',host='localhost',database='airdata')
    bd = conector.cursor()
except mysql.connector.Error as err:
    if err.errno == mysql.connector.errorcode.ER_ACCESS_DENIED_ERROR:
        print("Há algo de errado com o usuario/senha")
    elif err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
        print("Banco de Dados não existe")
    else:
        print(err)



#Consulta de MAC Address
macaddress = getmac.get_mac_address()

so = os.name

#Consulta de Serial Number
if so == 'nt':
    import wmi

    SN = wmi.WMI()
    serialN = SN.Win32_BaseBoard()[0].SerialNumber
else:
    serialN = "Lnx6210987645678"

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
            print("Digite um Serial Number (Até 45 caracteres)")
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
bd.execute("SELECT * FROM blacklist WHERE macAddresMaquina = '"+str(macaddress)+"' OR serialNumberMaquina = '"+str(serialN)+"'")
idMaquina = 0
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
            bd.execute("SELECT * FROM torre WHERE loginTorre = '"+str(loginTorre)+"' AND senhaTorre = '"+str(senhaTorre)+"'")
            for select in bd:
                if select[0] != 0:
                    torreId = select[0]
                    nomeTorre = select[1]
            if torreId == 0:
                os.system('cls' if os.name == 'nt' else 'clear')
                print("Login e/ou senha incorretos!")
                now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                comandoI = "INSERT INTO logTorre VALUES (NULL,'1','"+loginTorre+"','"+senhaTorre+"','"+now+"','"+macaddress+"','"+serialN+"');"           
                bd.execute(comandoI)    
                conector.commit()
                # verificar se a maquina será bloqueada (3 tentativas incorretas dentro de 7 dias)
                bd.execute("SELECT COUNT(macAddressMaquina) FROM logTorre WHERE macAddressMaquina = '"+macaddress+"' AND momentoTentativa > (NOW() - INTERVAL 7 DAY)")
                for select in bd:
                    if select[0] >= 3:
                        #maquina bloqueada, cadastrando ela no sistema de blacklist
                        now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        comandoI = "INSERT INTO blacklist VALUES (NULL, '"+str(serialN)+"','"+str(macaddress)+"' ,'1')"           
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
bd.execute("SELECT * FROM maquina WHERE macAddressMaquina = '"+str(macaddress)+"'")
idMaquina = 0
for select in bd:
    if select[0] != 0:
        idMaquina = select[0]
        nomeMaquina = select[1]

os.system('cls' if os.name == 'nt' else 'clear')

if idMaquina == 0:
    #Configuração de maquina
    while(True):
        print("Primeiro acesso!\nInforme o nome da maquina (MAC Address: "+macaddress+", Serial Number: "+serialN+")")
        nomeMaquina = input()
        if(nomeMaquina != ""):
            break
        else:
            os.system('cls' if os.name == 'nt' else 'clear')
            print("O nome da maquina não pode estar vazio!")
    comandoI = "INSERT INTO maquina VALUES (NULL, "+str(torreId)+", '"+str(nomeMaquina)+"','"+str(so)+"','"+str(serialN)+"' , '"+str(macaddress)+"')"           
    bd.execute(comandoI)   
    conector.commit() 

    bd.execute("SELECT * FROM maquina WHERE macAddressMaquina = '"+str(macaddress)+"'")
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
        VGauge(title='Memória Virtual'), # ui.items[0].items[1]
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

if os.name == 'nt':
    caminhoDisco = 'C:\\'
else:
    caminhoDisco = '/'


while True:
    # # Memória
    mem_tui = ui.items[0]

    # % RAM
    percRAM = psutil.virtual_memory().percent
    totalRAM = float((psutil.virtual_memory().total)/(1024**3))
    dispRAM = (round((totalRAM-(totalRAM * percRAM)/100), 2))

    ram_tui = mem_tui.items[0]
    ram_tui.value = percRAM
    ram_tui.title = f'RAM {ram_tui.value} %'

    # Memória Virtual
    swap_tui = mem_tui.items[1]
    swap_tui.value = psutil.swap_memory().percent
    swap_tui.title = f'Memória Virtual {swap_tui.value} %'

    # CPU
    totalCPU = (psutil.cpu_freq().max/1000)
    percCPU = psutil.cpu_percent(interval=None, percpu=False)
    dispCPU = (round((totalCPU-(totalCPU * percCPU)/100), 2))

    cpu_tui = ui.items[1]

    cpu_percent_tui = cpu_tui.items[0]
    ps_cpu_percent = percCPU
    cpu_percent_tui.value = ps_cpu_percent
    cpu_percent_tui.title = f'CPU {ps_cpu_percent}%'

    # # DISCO
    totalDisco = round((psutil.disk_usage(caminhoDisco).total)/(1024**3), 0)
    usadoDisco = round((psutil.disk_usage(caminhoDisco).used)/(1024**3), 0)
    livreDisco = totalDisco-usadoDisco
    percDisco = (psutil.disk_usage(caminhoDisco).percent)

    diskT_tui = ui.items[2]

    # # DISCO_USO
    disk_tui = diskT_tui.items[0]
    ps_disk_percent = percDisco
    disk_tui.value = ps_disk_percent
    disk_tui.title = f'Uso {ps_disk_percent}%'
    #Inserindo no banco

    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    comandoI = "INSERT INTO monitoramento VALUES (NULL, "+ str(idMaquina) +" ,'"+str(now)+"',"+str(dispCPU)+" , "+str(livreDisco)+" , "+str(dispRAM)+" )"           
    bd.execute(comandoI)    
    conector.commit()             
    bd.execute("SELECT * FROM monitoramento WHERE fkMaquina = '"+str(idMaquina)+"' ORDER BY  idMonitoramento DESC LIMIT 1")

    for select in bd:
        if select[0] != 0:
            idMonitoramento = select[0]

    if(percRAM>60):
        comandoI = "INSERT INTO alerta VALUES (NULL, 'RAM' ,"+ str(idMonitoramento) +")"           
        bd.execute(comandoI)    
        conector.commit()   
    os.system('cls' if os.name == 'nt' else 'clear')

    try:
        ui.display()
        sleep(5)
    except KeyboardInterrupt:
        break

