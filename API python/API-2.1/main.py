# coding: utf-8
from time import sleep

# Váriaveis ambiente
# AMBIENTE_PRODUCAO = True
AMBIENTE_PRODUCAO = False


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
    print("Cadastrando servidor...")

    if AMBIENTE_PRODUCAO:
        query = ("INSERT INTO servidor(idServidor, fkTorre) VALUES (%s, %s)")
    else:
        query = ("INSERT INTO servidor(idServidor, fkTorre) VALUES (%s, %s)")
    
    params = (mac, torre, )
    cursor.execute(query, params)

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
            leitura = eval(comando)
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
            
    if metrica == 1:
        
        if leitura >= 70.0 and leitura <= 75.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Perigo", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Perigo", componente), 
            
            cursores.execute(query, val)
            bdsql.commit()
        
        elif leitura > 75.0 and leitura <= 85.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Critico", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Critico", componente)
            
            cursores.execute(query, val)
            bdsql.commit()
            
        elif leitura > 85.0 and leitura <= 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Risco de falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Risco de falha", componente)

            cursores.execute(query, val)
            bdsql.commit()

        elif leitura > 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Falha", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
    elif metrica == 2:
        
        if leitura >= 70.0 and leitura <= 75.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Perigo", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Perigo", componente)

            
            cursores.execute(query, val)
            bdsql.commit()            
        
        elif leitura > 75.0 and leitura <= 85.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Critico", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Critico", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
        elif leitura > 85.0 and leitura <= 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Risco de falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Risco de falha", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
        elif leitura > 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Falha", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
    elif metrica == 3:
        
        if leitura >= 70.0 and leitura <= 75.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Perigo", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Perigo", componente)
            
            cursores.execute(query, val)
            bdsql.commit()            
        
        elif leitura > 75.0 and leitura <= 85.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Critico", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Critico", componente)

            cursores.execute(query, val)
            bdsql.commit()
            
        elif leitura > 85.0 and leitura <= 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Risco de falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Risco de falha", componente)

            cursores.execute(query, val)
            bdsql.commit()
            
        elif leitura > 95.0:
            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Falha", componente)
            
            cursores.execute(query, val)
            bdsql.commit()

    elif metrica == 4:
        if leitura >= 70.0 and leitura <= 75.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Perigo de superaquecimento", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Perigo de superaquecimento", componente)

            
            cursores.execute(query, val)
            bdsql.commit()            
        
        elif leitura > 75.0 and leitura <= 90.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Superaquecimento", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Superaquecimento", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
        elif leitura > 90.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (%s, DATEADD(HOUR, -3, GETDATE()), %s, %s)")
                val = ("Temperatura muito elevada", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Temperatura muito elevada", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
threading.Thread(target=executar_{i}, args=('{row[2]}', {row[1]}, {row[0]},)).start()
    """
        i += 1
        if script != None:
            exec(script)
            capturarProcessos(mac)

        sleep(5)
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
        
def capturarProcessos(mac):
    bdsql, cursor = conectar()
    import psutil
    while True:
        lista_processos = []
        for processos in psutil.process_iter():
            # print(processos)
            processos_info = processos.as_dict(['name', 'cpu_percent', 'pid', 'username'])
            if processos_info['cpu_percent'] > 0 and processos_info['username'] != "root":
                # print(processos_info)
                lista_processos.append(processos_info)
                pid = processos_info['pid']
                usuario = processos_info['username']
                nome = processos_info['name']
                porcentagemProcesso = processos_info['cpu_percent'] 
                if AMBIENTE_PRODUCAO:
                    sql = "INSERT INTO processos(nome, porcentagemCpu, pid, usuario, fkServidor, horario) VALUES (%s, %s, %s, %s, %s, DATEADD(HOUR, -3, CURRENT_TIMESTAMP))"
                else:
                    sql = "INSERT INTO processos(nome, porcentagemCpu, pid, usuario, fkServidor, horario) VALUES (%s, %s, %s, %s, %s, now())"
                val = (nome, porcentagemProcesso, pid, usuario, mac)
                cursor.execute(sql, val)

                bdsql.commit()
                # sleep(1)
                    
                
        sql = "select pid from deletarPid;"

        cursor.execute(sql)

        resposta = cursor.fetchall()
        # print(resposta)

        if(len(resposta) > 0):

            for row in resposta:
                
                pid = row[0]
                sql = "select nome from processos where pid = %s;"
                val = (pid, )
                cursor.execute(sql,val)
                nomeProcesso = cursor.fetchall()
                # print(nomeProcesso)
                
                if(len(nomeProcesso) > 0):
                    sql = "select pid from processos where nome = %s AND DAY(horario) >= DAY(now()) AND HOUR(horario) >= HOUR(now()) AND MINUTE(horario) >= MINUTE(now()) AND fkServidor = %s;"
                    val = (nomeProcesso[0][0], mac, )
                    cursor.execute(sql,val)
                    processosDeletados = cursor.fetchall()
                    # print(processosDeletados)
                
                if(len(processosDeletados) > 0):
                    for row2 in processosDeletados:
                        
                        pidDeletado = row2[0]
                        # print("aaaa",pidDeletado)
                        matarProcesso(pidDeletado)
                        sql = "delete from processos where pid = %s;"
                        val = (pidDeletado, )
                        cursor.execute(sql,val)
                        bdsql.commit()
                        
                
                    sql = "delete from deletarPid where pid = %s;"
                    val = (pid, )
                    cursor.execute(sql,val)
                    bdsql.commit()


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