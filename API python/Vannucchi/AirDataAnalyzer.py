import psutil
import mysql.connector
import os
from mysql.connector import errorcode

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

print("Olá! Bem vindo ao Air Data!")

while(True):
    #atualizar o bd
    conector.commit() 
    print("Qual serviço deseja usar?\n[1] Analise geral\n[2] Analise especifica\n[3] Sair")
    opt = input()
    if opt == '1':
        os.system('cls' if os.name == 'nt' else 'clear')
        #########################################################################
        ############################# ANALISE GERAL #############################
        #########################################################################
        bd.execute("SELECT AVG(percCpu) FROM monitoramento")
        for select in bd.fetchone():
            medCpu = select
        
        print("A média da porcentagem de uso de CPU de todas as maquinas é de " + str(round(medCpu, 2)))
        input()
    elif opt == '2':
        os.system('cls' if os.name == 'nt' else 'clear')
        ##########################################################################
        ########################### ANALISE ESPECIFICA ###########################
        ##########################################################################
        maquinas = []
        bd.execute("select * from maquina")
        for select in bd.fetchall():
            maquina = [select[0], select[1], select[2]]
            maquinas.append(maquina)
        
        print("Selecione uma maquina")
        cont = 0
        for maq in maquinas:
            print("["+str(cont)+"] - " + str(maq[1]))
            cont = cont + 1
        opt2 = input()
        bd.execute("SELECT AVG(percCpu) FROM monitoramento where fkmaquina = "+str(maquinas[int(opt2)][0]))
        for select in bd.fetchone():
            medCpu = select
        
        print("A média da porcentagem de uso de CPU da maquina " + str(maquinas[int(opt2)][1]) + " é " + str(round(medCpu, 2)))
        input()
    elif opt == '3':
        os.system('cls' if os.name == 'nt' else 'clear')
        print("Volte sempre!")
        break
    else:
        os.system('cls' if os.name == 'nt' else 'clear')
        print("Digite uma opção válida!")