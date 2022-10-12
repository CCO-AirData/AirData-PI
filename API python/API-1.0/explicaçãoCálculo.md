
## Demonstração Regra de Três

Vamos pegar o exemplo da RAM

Digamos que você tem um computador que possui um total de 8 GB de memória RAM
E agora você está consumindo 70% deste 8 GB
Se a máquina tem no total 8 GB, isso são intrinsecamente 100% da memória da máquina. Agora, se nos sabemos a porcentagem total, a quantidade de GB total e a quantidade de porcentagem de uso, podemos fazer a regra de três

8 GB = 100%  
X GB =  70% 

100 * x = 8*70 

100x = 560  

x = 560/100

x = 5.6 GB

    percRAM = psutil.virtual_memory().percent
    totalRAM = float((psutil.virtual_memory().total)/(1024**3))
    dispRAM = (round((totalRAM-(totalRAM * percRAM)/100), 2))

Logo 70% significa 5.6 GB de uso, sabendo disso, podemos subtrair da quantidade de GB que está em uso 

Assim temos a quantidade de memoria disponivel em GB 

Sim, utilizando apenas as propriedades do psuitl podemos encontrar o tanto de memória RAM disponível (no caso seria o psutil.virtual_memory().free), entretanto este calculo foi feito manualmente de modo a habituar os colegas do grupo com cálculos cotidianos no mundo estático  