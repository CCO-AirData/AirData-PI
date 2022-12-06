from time import sleep
import numpy as np
import matplotlib.pyplot as plt
from wordcloud import WordCloud
from datetime import date
import pymssql 

bdsql = pymssql.connect("airdataserver.database.windows.net", "CloudSA9549f82c", "pi-airdata2022", "airdata")
mycursor = bdsql.cursor()

# while True:

mac = "00:e0:4c:36:39:83"
querry = "SELECT TOP 10 nome, MAX(porcentagemCpu) as usoCpu FROM [dbo].[processos] GROUP BY nome ORDER BY MAX(porcentagemCpu) DESC;"

mycursor.execute(querry)

resposta = mycursor.fetchall()

processos = []
for row in resposta:
    for row2 in range(0, int(row[1])):
        processos.append(str(row[0]))


# print(processos)

texto = " ".join(processos)

word_cloud = WordCloud(collocations = False,
                    width=800, height=800,
                    background_color = 'white').generate(texto)

plt.imshow(word_cloud)
plt.axis("off")

fig1 = plt.gcf()
plt.show()

fig1.savefig("site_institucional/public/assets/img/" + "wordcloudProcessos.png", dpi=100)

sleep(1)