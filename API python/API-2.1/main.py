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
        query = ("SELECT emailUsuario, senhaUsuario, idTorre FROM vw_iniciarSessao WHERE emailUsuario = ? AND senhaUsuario = ?")
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
        query = ('SELECT * FROM servidor WHERE idServidor = ?') 
    else:
        query = ('SELECT * FROM servidor WHERE idServidor = %s') 

    params = (mac(), )
    mycursor.execute(query, params)

    resposta = mycursor.fetchall()

    if(len(resposta) > 0):
        selecionarParametro(mycursor, mac())
    else :
        cadastrarServidor(bdsql, mycursor, mac(), torre)

def cadastrarServidor(bdsql, cursor, mac, torre):
    print("Cadastrando servidor...")

    if AMBIENTE_PRODUCAO:
        query = ("INSERT INTO servidor(idServidor, fkTorre) VALUES (?, ?)")
    else:
        query = ("INSERT INTO servidor(idServidor, fkTorre) VALUES (%s, %s)")
    
    params = (mac, torre, )
    cursor.execute(query, params)

    bdsql.commit()
    sleep(2)
    print(f"Servidor cadastrado com sucesso!\n MAC: {mac}\n Torre: {torre}")

def selecionarParametro(cursor, mac):

    if AMBIENTE_PRODUCAO:
        query = ("SELECT * from parametro WHERE fkComponente_fkServidor = ?")
    else:
        query = ("SELECT * from parametro WHERE fkComponente_fkServidor = %s")

    
    params = (mac, )
    cursor.execute(query, params)

    resposta = cursor.fetchall()

    if(len(resposta) > 0):
        executarMonitoramento(resposta)
    else:
        print("Nenhuma componente cadastrado para monitoramento, cadastre na sua dashboard!")
        sleep(3)
 
def executarMonitoramento(resposta):
    print("Executando monitoramento...")
    while True:
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

    bdsql, cursores = conectar()

    if AMBIENTE_PRODUCAO:
        query = ("SELECT comando, isTupla FROM metrica WHERE idMetrica = ?")
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

    if comando == "":

        with PoolManager() as pool:
            response = pool.request('GET', 'http://localhost:9000/data.json')
            data = loads(response.data.decode('utf-8'))
        
            temp_value = data['Children'][0]['Children'][1]['Children'][1]['Children'][0]['Value']
            
            leitura = conversor(temp_value)
            print(leitura)
            sleep(1)


    else:
        leitura = eval(comando)    

    if isTupla == 0:
        if AMBIENTE_PRODUCAO:
            query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(?, getdate(), ?, ?, ?)")
        else:
            query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(%s, now(), %s, %s, %s)")
            
        val = (metrica, leitura, componente, servidor, )
            
        cursores.execute(query, val)
        bdsql.commit()

    else: 
        for row in leitura:
            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(?, getdate(), ?, ?, ?)")   
            else:
                query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(%s, now(), %s, %s, %s)")   

            val = (metrica, row, componente, servidor, ) 

            cursores.execute(query, val)
            bdsql.commit()
            
    if metrica == 1:
        
        if leitura >= 70.0 and leitura <= 75.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Perigo", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Perigo", componente), 
            
            cursores.execute(query, val)
            bdsql.commit()
        
        elif leitura > 75.0 and leitura <= 85.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Critico", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Critico", componente)
            
            cursores.execute(query, val)
            bdsql.commit()
            
        elif leitura > 85.0 and leitura <= 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Risco de falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Risco de falha", componente)

            cursores.execute(query, val)
            bdsql.commit()

        elif leitura > 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Falha", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
    elif metrica == 2:
        
        if leitura >= 70.0 and leitura <= 75.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Perigo", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Perigo", componente)

            
            cursores.execute(query, val)
            bdsql.commit()            
        
        elif leitura > 75.0 and leitura <= 85.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Critico", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Critico", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
        elif leitura > 85.0 and leitura <= 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Risco de falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Risco de falha", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
        elif leitura > 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Falha", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
    elif metrica == 3:
        
        if leitura >= 70.0 and leitura <= 75.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Perigo", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Perigo", componente)
            
            cursores.execute(query, val)
            bdsql.commit()            
        
        elif leitura > 75.0 and leitura <= 85.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Critico", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Critico", componente)

            cursores.execute(query, val)
            bdsql.commit()
            
        elif leitura > 85.0 and leitura <= 95.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Risco de falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Risco de falha", componente)

            cursores.execute(query, val)
            bdsql.commit()
            
        elif leitura > 95.0:
            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Falha", componente)
            
            cursores.execute(query, val)
            bdsql.commit()

    elif metrica == 4:
        if leitura >= 45.0 and leitura <= 50.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Perigo", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Perigo", componente)

            
            cursores.execute(query, val)
            bdsql.commit()            
        
        elif leitura > 50.0 and leitura <= 55.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Critico", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Critico", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
        elif leitura > 55.0 and leitura <= 60.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Risco de falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Risco de falha", componente)

            cursores.execute(query, val)
            bdsql.commit()            
            
        elif leitura > 60.0:

            if AMBIENTE_PRODUCAO:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente, fkServidor) VALUES (?, getdate(), ?, ?)")
                val = ("Falha", componente, servidor)
            else:
                query = ("INSERT INTO alerta (statusAlerta, momentoAlerta, fkComponente) VALUES (%s, now(), %s)")
                val = ("Falha", componente)

            cursores.execute(query, val)
            bdsql.commit()          

        
        


threading.Thread(target=executar_{i}, args=('{row[2]}', {row[1]}, {row[0]},)).start()
    """
        i += 1
        if script != None:
            exec(script)

        sleep(2)
        print("Executando...")


def conectar():
    if AMBIENTE_PRODUCAO:
        import pyodbc as pyo 

        # Download driver
        #https://go.microsoft.com/fwlink/?linkid=2202930

        bdsql = pyo.connect("Driver={ODBC Driver 18 for SQL Server};Server=tcp:airdataserver.database.windows.net,1433;Database=airdata;Uid=CloudSA9549f82c;Pwd=pi-airdata2022;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;")
        mycursor = bdsql.cursor()

    else:
        import mysql.connector

        bdsql = mysql.connector.connect(host="localhost", user="airdata_client", password="sptech", database="airData")
        mycursor = bdsql.cursor()

    return (bdsql, mycursor)


if __name__ == '__main__':
    main()