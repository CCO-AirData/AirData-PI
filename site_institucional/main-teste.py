import psutil as ps
import mysql.connector 
import os
import datetime
from time import sleep

bdsql = mysql.connector.connect(user='airdata_client', password='sptech', host='localhost', database='airData')
cursor = bdsql.cursor()

while True:
    cpuPercent = ps.cpu_percent(interval=0.1)
    ramPercent = ps.virtual_memory().percent
    diskPercent = ps.disk_usage("/").percent
    
    comando = f'INSERT INTO leitura (fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES (1, now(), {cpuPercent}, 1, "39-FD-83-E4-FB-AB");'

    cursor.execute(comando)
    bdsql.commit()

    comando = f'INSERT INTO leitura (fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES (2, now(), {ramPercent}, 2, "39-FD-83-E4-FB-AB");'

    cursor.execute(comando)
    bdsql.commit()

    comando = f'INSERT INTO leitura (fkMetrica, horario, valorLido, fkComponente_idComponente, fkComponente_fkServidor) VALUES (3, now(), {diskPercent}, 3, "39-FD-83-E4-FB-AB");'

    cursor.execute(comando)
    bdsql.commit()
    
    print(cpuPercent, ramPercent, diskPercent)
    
    sleep(1)
