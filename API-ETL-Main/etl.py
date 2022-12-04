# pip install petl
import petl as etl
import os
from time import sleep
from getmac import get_mac_address as mac

mac = mac()

def extract():
  bdsql = conectar()
  os.system('clear')
  print('Iniciando processo de ETL')

  try:
    table = etl.fromdb(bdsql, f"SELECT * FROM vw_leitura WHERE fkComponente_fkServidor = '{mac}'")

    if table.nrows() > 0:
        print("Dados extraídos com sucesso!")
        sleep(1)
        transform(table)
    else:
        print("Não há dados para serem extraídos!")
  except:
    print("Erro ao extrair dados!")
    

def transform(table):
  os.system('clear')
  table_rename = etl.setheader(table, ['fk_servidor', 'fk_componente', 'fk_empresa', 'fk_aeroporto', 'fk_metrica', 'horario', 'valor_leitura'])

  table2 = etl.convertnumbers(table_rename)

  print("Dados transformados com sucesso!")
  sleep(2)
  load(table2)

def load(table):
  bdsql = conectar()

  os.system('clear')
  print("Iniciando processo de carregamento")

  try:
    etl.appenddb(table, bdsql, 'fact_historico_leitura', commit=True)
    print("Dados carregados com sucesso!")
    bdsql.cursor().execute("DELETE FROM leitura WHERE fkComponente_fkServidor = '%s'", mac)
  except:
    print("Erro ao carregar dados!")

def conectar():
  # pip install pymysql
  import pymssql 

  server = "airdataserver.database.windows.net"
  database = "airdata"
  user = "CloudSA9549f82c"
  password = "pi-airdata2022"

  bdsql = pymssql.connect(server, user, password, database)

  return bdsql

if __name__ == "__main__":
  extract()