# coding: utf-8
import requests
import datetime
from time import sleep
# Váriaveis ambiente
AMBIENTE_PRODUCAO = True
# AMBIENTE_PRODUCAO = False


def main():
    import hashlib
    bdsql, mycursor = conectar()

    email = input("Email: ")
    senha = input("Senha: ")

    senha = hashlib.sha512(senha.encode()).hexdigest()

    if AMBIENTE_PRODUCAO:
        query = ("SELECT emailUsuario, senhaUsuario, idTorre FROM vw_iniciarSessao WHERE emailUsuario = %s AND senhaUsuario = %s")
    else:
        query = ("SELECT emailUsuario, senhaUsuario, idTorre FROM vw_iniciarSessao WHERE emailUsuario = %s AND senhaUsuario = %s")

    params = (email, senha)

    mycursor.execute(query, params)

    resposta = mycursor.fetchall()

    if(len(resposta) > 0):
        print("Logado com sucesso!")
        sleep(2)

        selecionarServidor(resposta[0][2])
    else:
        print("Usuario não cadastrado, mande seu gestor cadastrar!")
        sleep(3)


def selecionarServidor(torre):
    from getmac import get_mac_address as mac

    bdsql, mycursor = conectar()
    
    if AMBIENTE_PRODUCAO:
        query = ('SELECT * FROM servidor WHERE idServidor = %s') 
    else:
        query = ('SELECT * FROM servidor WHERE idServidor = %s') 

    params = (mac(), )
    
    mycursor.execute(query, params)

    resposta = mycursor.fetchall()

    if(len(resposta) > 0):
        selecionarParametro(mac())
    else :
        cadastrarServidor(bdsql, mycursor, mac(), torre)

def cadastrarServidor(bdsql, cursor, mac, torre):
    import platform
    print("Cadastrando servidor...")

    if AMBIENTE_PRODUCAO:
        query = ("INSERT INTO servidor(idServidor, fkTorre) VALUES (%s, %s)")
        query2 = ("INSERT INTO dim_servidor(mac, modelo, SO, status_servidor) VALUES (%s, %s, %s, %s)")
    else:
        query = ("INSERT INTO servidor(idServidor, fkTorre) VALUES (%s, %s)")
    
    dadosMaquina = platform.uname()
    modelo = dadosMaquina[1]
    so = dadosMaquina[0]
    
    params = (mac, torre, )
    params2 = (mac, modelo, so, "Ativo", )
    cursor.execute(query, params)
    bdsql.commit()
    cursor.execute(query2, params2)
    bdsql.commit()
    
    sleep(2)
    print(f"Servidor cadastrado com sucesso!\n MAC: {mac}\n Torre: {torre}")
    selecionarParametro(mac)

def selecionarParametro(mac):
    bdsql, cursor = conectar()
    if AMBIENTE_PRODUCAO:
        query = ("SELECT * from parametro WHERE fkComponente_fkServidor = %s")
    else:
        query = ("SELECT * from parametro WHERE fkComponente_fkServidor = %s")

    
    params = (mac, )
    cursor.execute(query, params)

    resposta = cursor.fetchall()

    if(len(resposta) > 0):
        executarMonitoramento(resposta, mac, len(resposta))
    else:
        print("Nenhuma componente cadastrado para monitoramento, cadastre na sua dashboard!")
        sleep(3)
        selecionarParametro(mac)

def executarMonitoramento(resposta, mac, qtdParametros):
    print("Executando monitoramento...")
    isWorking = True
    while isWorking:
        script = """
import threading   
        """

        i=1
        for row in resposta:
            script += f"""
def executar_{i}(servidor, componente, metrica):
    import psutil
    from time import sleep
    from json import loads
    from urllib3 import PoolManager
    import platform
    from operator import itemgetter

    bdsql, cursores = conectar()

    if AMBIENTE_PRODUCAO:
        query = ("SELECT comando, isTupla FROM metrica WHERE idMetrica = %s")
    else:
        query = ("SELECT comando, isTupla FROM metrica WHERE idMetrica = %s")
    
    val = (metrica, )    
    cursores.execute(query, val)    

    resposta = cursores.fetchall() # resposta retorna isto [(comando, isTupla)]
    isTupla = resposta[0][1]

    comando = resposta[0][0] 
    leitura = None

    def conversor(valor):
        return float(valor[0:4].replace(",", '.'))

    if metrica == 4:
        if platform.system() == 'Linux':
            try:
                leitura = eval(comando)
            except:
                print('Erro ao capturar os dados')
                return
        else:
            # USAR OPHM PARA VISUALIZAR SOMENTE CPU
            with PoolManager() as pool:
                response = pool.request('GET', 'http://localhost:9000/data.json')
                data = loads(response.data.decode('utf-8'))
                temp_value = data['Children'][0]['Children'][0]['Children'][1]['Children'][0]['Value']
                
                leitura = conversor(temp_value)
                sleep(1)
    else:
        leitura = eval(comando)    

    if metrica == 5:
        nome = list(leitura.keys())[0]
        leitura = leitura[nome][0][0]

    if isTupla == 0:
        if AMBIENTE_PRODUCAO:
            query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(%s, DATEADD(HOUR, -3, GETDATE()), %s, %s, %s)")
        else:
            query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(%s, now(), %s, %s, %s)")
            
        val = (metrica, leitura, componente, servidor, )
            
        cursores.execute(query, val)
        bdsql.commit()

    else: 
        for row in leitura:
            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(%s, DATEADD(HOUR, -3, GETDATE()), %s, %s, %s)")   
            else:
                query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(%s, now(), %s, %s, %s)")   

            val = (metrica, row, componente, servidor, ) 

            cursores.execute(query, val)
            bdsql.commit()
            
    data = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    if metrica == 1:
        if leitura >= 70.0 and leitura <= 75.0:
            reportarAlerta(servidor, componente, "o uso de CPU está acima de 70%", data)
        
        elif leitura > 75.0 and leitura <= 85.0:
            reportarAlerta(servidor, componente, "o uso de CPU está acima de 75%", data)
            
        elif leitura > 85.0 and leitura <= 95.0:
            reportarAlerta(servidor, componente, "o uso de CPU está acima de 85%", data)

        elif leitura > 95.0:
            reportarAlerta(servidor, componente, "o uso de CPU está acima de 95%", data)        
            
    elif metrica == 2:
        
        if leitura >= 70.0 and leitura <= 75.0:
            reportarAlerta(servidor, componente, "o uso de RAM está acima de 70%", data)          
        
        elif leitura > 75.0 and leitura <= 85.0:
            reportarAlerta(servidor, componente, "o uso de RAM está acima de 75%", data)         
            
        elif leitura > 85.0 and leitura <= 95.0:
            reportarAlerta(servidor, componente, "o uso de RAM está acima de 85%", data)        
            
        elif leitura > 95.0:
            reportarAlerta(servidor, componente, "o uso de RAM está acima de 95%", data)    
            
    elif metrica == 3:
        
        if leitura >= 70.0 and leitura <= 75.0:
            reportarAlerta(servidor, componente, "o uso de Disco está acima de 70%", data)        
        
        elif leitura > 75.0 and leitura <= 85.0:
            reportarAlerta(servidor, componente, "o uso de Disco está acima de 75%", data)
            
        elif leitura > 85.0 and leitura <= 95.0:
            reportarAlerta(servidor, componente, "o uso de Disco está acima de 85%", data)
            
        elif leitura > 95.0:
            reportarAlerta(servidor, componente, "o uso de Disco está acima de 95%", data)

    elif metrica == 4:
        if leitura >= 70.0 and leitura <= 75.0:
            reportarAlerta(servidor, componente, "a temperatura da CPU está acima de 70°", data)           
        
        elif leitura > 75.0 and leitura <= 90.0:
            reportarAlerta(servidor, componente, "a temperatura da CPU está acima de 75°", data)        
            
        elif leitura > 90.0:
            reportarAlerta(servidor, componente, "a temperatura da CPU está acima de 90°", data)
    elif metrica == 5:
        if leitura < 100:
            reportarAlerta(servidor, componente, "a fan está parada", data)

        elif leitura < 1400:
            reportarAlerta(servidor, componente, "a fan está com velocidade abaixo do normal", data)
    
    lista_processos = []

    for processos in psutil.process_iter():
        # print(processos)
        processos_info = processos.as_dict(['name', 'cpu_percent', 'pid', 'username'])
        if processos_info['cpu_percent'] > 0 and processos_info['username'] != "root" and processos_info['username'] != "NT AUTHORITY\SYSTEM":
            # print(processos_info)
            lista_processos.append(processos_info)
            
    lista_processos.sort(key=itemgetter('cpu_percent'), reverse=True)

    for p in lista_processos:
            
        pid = p['pid']
        usuario = p['username']
        nome = p['name']
        porcentagemProcesso = p['cpu_percent']

        if AMBIENTE_PRODUCAO:
            sql = "select * from processos_proibidos WHERE fkServidor = '%s';"
        else:
            sql = "select * from processos_proibidos WHERE fkServidor = %s;"

        val = (servidor, )
        cursores.execute(sql % val)

        proc_proibido = cursores.fetchall()
        # print(resposta)

        if(len(proc_proibido) > 0):
            for proc in proc_proibido:
                if(nome == proc[1]):
                    matarProcesso(pid)
                else:
                    if AMBIENTE_PRODUCAO:
                        sql = "INSERT INTO processos(nome, porcentagemCpu, pid, usuario, fkServidor, horario) VALUES (%s, %s, %s, %s, %s, DATEADD(HOUR, -3, CURRENT_TIMESTAMP))"
                    else:
                        sql = "INSERT INTO processos(nome, porcentagemCpu, pid, usuario, fkServidor, horario) VALUES (%s, %s, %s, %s, %s, now())"
                    val = (nome, porcentagemProcesso, pid, usuario, servidor)
                    cursores.execute(sql, val)

                    bdsql.commit()
                    sleep(1)

        else:
            if AMBIENTE_PRODUCAO:
                sql = "INSERT INTO processos(nome, porcentagemCpu, pid, usuario, fkServidor, horario) VALUES (%s, %s, %s, %s, %s, DATEADD(HOUR, -3, CURRENT_TIMESTAMP))"
            else:
                sql = "INSERT INTO processos(nome, porcentagemCpu, pid, usuario, fkServidor, horario) VALUES (%s, %s, %s, %s, %s, now())"
            val = (nome, porcentagemProcesso, pid, usuario, servidor)
            cursores.execute(sql, val)

            bdsql.commit()
            sleep(1)

    if AMBIENTE_PRODUCAO:
        sql = "select pid from deletarPid WHERE fkServidor = '%s';"
    else:
        sql = "select pid from deletarPid WHERE fkServidor = %s;"

    val = (servidor, )
    cursores.execute(sql % val)

    resposta = cursores.fetchall()
    # print(resposta)

    if(len(resposta) > 0):

        for row in resposta:
            
            pid = row[0]
            if AMBIENTE_PRODUCAO:
                sql = "select nome from processos where pid = '%s' AND horario BETWEEN DATEADD(HOUR, -3, DATEADD(SECOND, -10, CURRENT_TIMESTAMP)) AND DATEADD(HOUR, -3, DATEADD(SECOND, 0, CURRENT_TIMESTAMP)) AND fkServidor = '%s';"
            else:
                sql = "select nome from processos where pid = %s AND DAY(horario) >= DAY(now()) AND HOUR(horario) >= HOUR(now()) AND MINUTE(horario) >= MINUTE(now()) AND fkServidor = %s;"
                
            val = (pid, servidor, )
            cursores.execute(sql % val)
            nomeProcesso = cursores.fetchall()
            # print(nomeProcesso)
            
            if(len(nomeProcesso) > 0):
                if AMBIENTE_PRODUCAO:
                    sql = "select pid from processos where nome = '%s' AND horario BETWEEN DATEADD(HOUR, -3, DATEADD(SECOND, -3, CURRENT_TIMESTAMP)) AND DATEADD(HOUR, -3, DATEADD(SECOND, 0, CURRENT_TIMESTAMP)) AND fkServidor = '%s';"
                else:
                    sql = "select pid from processos where nome = %s AND DAY(horario) >= DAY(now()) AND HOUR(horario) >= HOUR(now()) AND MINUTE(horario) >= MINUTE(now()) AND fkServidor = %s;"
                val = (nomeProcesso[0][0], servidor, )
                cursores.execute(sql % val)
                processosDeletados = cursores.fetchall()
                # print(processosDeletados)

            if(len(processosDeletados) > 0):
                for row2 in processosDeletados:
                    
                    pidDeletado = row2[0]
                    matarProcesso(pidDeletado)
                    
                    if AMBIENTE_PRODUCAO:
                        sql = "delete from processos where pid = '%s' AND fkServidor = '%s';"
                    else:
                        sql = "delete from processos where pid = %s AND fkServidor = %s;"
                    val = (pidDeletado, servidor, )
                    cursores.execute(sql % val)
                    bdsql.commit()
                
                    if AMBIENTE_PRODUCAO:
                        sql = "delete from deletarPid where pid = '%s' AND fkServidor = '%s';"
                    else:
                        sql = "delete from deletarPid where pid = %s AND fkServidor = %s;"
                    val = (pid, servidor, )
                    cursores.execute(sql % val)
                    bdsql.commit()
            
threading.Thread(target=executar_{i}, args=('{row[2]}', {row[1]}, {row[0]},)).start()
    """
        i += 1
        if script != None:
            exec(script)
            # capturarProcessos(mac)

        sleep(3)
        print("Executando...")

        isWorking = verificarAtualizacaoParametros(mac, qtdParametros)

    selecionarParametro(mac)

def verificarAtualizacaoParametros(mac, qtdParametros):
    bdsql, cursor = conectar()

    if AMBIENTE_PRODUCAO:
        query = ("SELECT * from parametro WHERE fkComponente_fkServidor = %s")
    else:
        query = ("SELECT * from parametro WHERE fkComponente_fkServidor = %s")

    
    params = (mac, )
    cursor.execute(query, params)

    resposta = cursor.fetchall()

    if(len(resposta) > qtdParametros):
        return False
    else:
        return True


def matarProcesso(pid):
    from sys import platform
    import os
    if platform == "linux" or platform == "linux2":
        os.system('kill '+str(pid))
    elif platform == "win32":
        os.system('TASKKILL /PID ' + str(pid) + ' /F')


def reportarAlerta(mac, componente, mensagem, horario):
    url = "https://api.pipefy.com/graphql"

    payload = {"query": "mutation {createCard(input: {pipe_id: 302843636,title: \"Problema na maquina\",fields_attributes:[{field_id: \"what_is_your_request\", field_value: \"" + f"A maquina {mac} apresentou um erro de {mensagem} no componente {componente} às {horario}" + "\"}]}) {card {title}}}"}
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDIyMTE4NDUsImVtYWlsIjoiMjIyLTFjY28tZ3J1cG84QGJhbmR0ZWMuY29tLmJyIiwiYXBwbGljYXRpb24iOjMwMDIxNjM0N319.jSLkT6f8zxLjfQSM9v033CcMIIOfldcJ9pvqaS8Hwy-XV2T9i7tdf-sB7-ndq-vOp-TtQFbh4BFj5Oy4juZDYQ"
    }
    

    response = requests.post(url, json=payload, headers=headers)


def conectar():
    if AMBIENTE_PRODUCAO:
        import pymssql 

        bdsql = pymssql.connect("airdataserver.database.windows.net", "CloudSA9549f82c", "pi-airdata2022", "airdata")
        mycursor = bdsql.cursor()

    else:
        import mysql.connector

        bdsql = mysql.connector.connect(host="localhost", user="airdata_client", password="sptech", database="airData")
        mycursor = bdsql.cursor()

    return (bdsql, mycursor)


if __name__ == '__main__':
    main()
