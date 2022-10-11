from time import sleep

def main():
    import hashlib
    bdsql, mycursor = conectar()

    email = input("Email: ")
    senha = input("Senha: ")

    senha = hashlib.sha512(senha.encode()).hexdigest()

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

    query = ("INSERT INTO servidor(idServidor, fkTorre) VALUES (%s, %s)")
    params = (mac, torre, )
    cursor.execute(query, params)

    bdsql.commit()
    sleep(2)
    print(f"Servidor cadastrado com sucesso!\n MAC: {mac}\n Torre: {torre}")

def selecionarParametro(cursor, mac):

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
    bdsql, cursores = conectar()

    query = ("SELECT comando, isTupla FROM metrica WHERE idMetrica = %s")
    val = (metrica, )    
    cursores.execute(query, val)    

    resposta = cursores.fetchall() # resposta retorna isto [(comando, isTupla)]
    isTupla = resposta[0][1]

    comando = resposta[0][0]    
    leitura = eval(comando)    

    if isTupla == 0:
        query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(%s, now(), %s, %s, %s)")    
        val = (metrica, leitura, componente, servidor, )
            
        cursores.execute(query, val)
        bdsql.commit()
    else: 
        for row in leitura:
            query = ("INSERT INTO leitura(fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES(%s, now(), %s, %s, %s)")    
            val = (metrica, row, componente, servidor, ) 

            cursores.execute(query, val)
            bdsql.commit()

threading.Thread(target=executar_{i}, args=('{row[2]}', {row[1]}, {row[0]},)).start()
    """
        i += 1
        if script != None:
            exec(script)

        sleep(10)
        print("Executando...")


def conectar():
    import mysql.connector

    bdsql = mysql.connector.connect(host="localhost", user="root", password="TheKingBox751", database="airData")
    mycursor = bdsql.cursor()

    return (bdsql, mycursor)

if __name__ == '__main__':
    main()