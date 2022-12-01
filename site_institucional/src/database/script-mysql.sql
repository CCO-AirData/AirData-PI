USE airData;


CREATE TABLE empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    cnpjEmpresa CHAR(18) NOT NULL,
    nomeEmpresa VARCHAR(45) NOT NULL,
    telefoneEmpresa CHAR(14)
);

CREATE TABLE aeroporto (
    idAeroporto INT PRIMARY KEY AUTO_INCREMENT,
    fkEmpresa INT NOT NULL,
    nomeAeroporto VARCHAR(45) NOT NULL,
    cepAeroporto CHAR(9) NOT NULL,
    numeroAeroporto INT NOT NULL,
    ufAeroporto CHAR(2) NULL,
    cidadeAeroporto VARCHAR(45) NOT NULL,
    bairroAeroporto VARCHAR(45) NOT NULL,
    ruaAeroporto VARCHAR(45) NOT NULL,
    FOREIGN KEY(fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE usuario (
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
	nomeUsuario VARCHAR(45) NOT NULL,
	emailUsuario VARCHAR(45) NOT NULL,
	senhaUsuario CHAR(128) NOT NULL,
	cpfUsuario CHAR(14) NOT NULL,
    tipoUsuario CHAR(1) NOT NULL CHECK (tipoUsuario IN('F', 'G', 'S')),
	fkSupervisor INT NULL,
	fkAeroporto INT NOT NULL,
	fkGestor INT NULL,
	FOREIGN KEY(fkAeroporto) REFERENCES aeroporto(idAeroporto),
    FOREIGN KEY(fkSupervisor) REFERENCES usuario(idUsuario),
    FOREIGN KEY(fkGestor) REFERENCES usuario(idUsuario)
);

CREATE TABLE torre (
    idTorre INT PRIMARY KEY AUTO_INCREMENT,
    fkAeroporto INT NOT NULL,
    FOREIGN KEY(fkAeroporto) REFERENCES aeroporto(idAeroporto)
);

CREATE TABLE servidor (
	idServidor VARCHAR(17) PRIMARY KEY,
    fkTorre INT NOT NULL,
    FOREIGN KEY(fkTorre) REFERENCES torre(idTorre)
);

CREATE TABLE componente (
	idComponente INT AUTO_INCREMENT,
    fkServidor VARCHAR(17) NOT NULL,
    tipoComponente VARCHAR(45) NOT NULL,
    nomeComponente VARCHAR(50) NOT NULL,
    memoria DECIMAL(5,2),
    tipoMemoria VARCHAR(30),
    FOREIGN KEY (fkServidor) REFERENCES servidor(idServidor),
    PRIMARY KEY(idComponente, fkServidor)
);

CREATE TABLE alerta(
	idAlerta INT PRIMARY KEY AUTO_INCREMENT,
	statusAlerta VARCHAR(45) NOT NULL,
	momentoAlerta DATETIME NOT NULL,
	fkComponente INT NOT NULL,
	FOREIGN KEY (fkComponente) references componente(idComponente)
);

CREATE TABLE metrica (
	idMetrica INT PRIMARY KEY,
    nomeComponente VARCHAR(40) NOT NULL,
    nomeMetrica VARCHAR(40) NOT NULL,
    nomeView VARCHAR(40) NOT NULL,
    comando VARCHAR(50) NOT NULL,
    unidadeMedida VARCHAR(10) NOT NULL,
    isTupla TINYINT NOT NULL
);

CREATE TABLE leitura (
    fkMetrica INT NOT NULL,
    horario DATETIME NOT NULL,
    valorLido DECIMAL(5,2) NOT NULL,
	fkComponente_idComponente INT NOT NULL,
    fkComponente_fkServidor VARCHAR(17) NOT NULL,
    FOREIGN KEY(fkComponente_idComponente, fkComponente_fkServidor) REFERENCES componente(idComponente, fkServidor)
);

CREATE TABLE parametro (
	fkMetrica INT NOT NULL,
	fkComponente_idComponente INT NOT NULL,
    fkComponente_fkServidor VARCHAR(17) NOT NULL,
    FOREIGN KEY(fkMetrica) REFERENCES metrica(idMetrica),
    FOREIGN KEY(fkComponente_idComponente, fkComponente_fkServidor) REFERENCES componente(idComponente, fkServidor)
);

CREATE TABLE processos(
idProcesso INT PRIMARY KEY auto_increment,
nome VARCHAR(50),
porcentagemCpu DECIMAL(5,2),
pid VARCHAR(10),
usuario VARCHAR(50),
fkServidor VARCHAR(17) NOT NULL,
horario datetime,
FOREIGN KEY (fkServidor) references servidor(idServidor)
);

CREATE TABLE deletarPid(
id INT PRIMARY KEY AUTO_INCREMENT,
pid VARCHAR(10)
);

-- Views
CREATE VIEW vw_iniciarSessao AS
SELECT idUsuario, nomeUsuario, emailUsuario, senhaUsuario, tipoUsuario, idTorre, torre.fkAeroporto, nomeEmpresa, nomeAeroporto, fkGestor, fkSupervisor
FROM usuario, aeroporto, torre, empresa
WHERE usuario.fkAeroporto = idAeroporto 
AND torre.fkAeroporto = idAeroporto
AND fkEmpresa = idEmpresa;

CREATE VIEW vw_cpuPercent AS
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE metrica.nomeComponente = 'CPU'
AND metrica.nomeMetrica = 'Porcentagem de uso'
ORDER BY horario DESC;

CREATE VIEW vw_ramPercent AS
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE metrica.nomeComponente = 'RAM'
AND metrica.nomeMetrica = 'Porcentagem de uso'
ORDER BY horario DESC;

CREATE VIEW vw_diskPercent AS
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE metrica.nomeComponente = 'DISCO'
AND metrica.nomeMetrica = 'Porcentagem de uso'
ORDER BY horario DESC;

CREATE VIEW vw_cpuTemp AS
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE metrica.nomeComponente = 'CPU'
AND metrica.nomeMetrica = 'Temperatura'
ORDER BY horario DESC;

CREATE VIEW vw_alertas as
SELECT idAlerta, statusAlerta, momentoAlerta, fkTorre, tipoComponente, idServidor
FROM alerta
JOIN componente ON fkComponente = idComponente
JOIN servidor ON fkServidor = idServidor
JOIN torre ON fkTorre = idTorre
ORDER BY momentoAlerta DESC;

CREATE VIEW vw_onlineServers AS
	SELECT servidor.fkTorre, fkComponente_fkServidor AS idServidor, MAX(horario) AS ultimaLeitura, TIMESTAMPDIFF(MINUTE, MAX(horario), NOW()) AS minutosDesdeUltimaLeitura, 
		CASE WHEN TIMESTAMPDIFF(MINUTE, MAX(horario), NOW()) > 1 THEN 'OFFLINE'
		ELSE 'ONLINE'
		END AS estado
	FROM leitura
    INNER JOIN servidor ON servidor.idServidor = leitura.fkComponente_fkServidor
	GROUP BY fkComponente_fkServidor;

CREATE VIEW vw_componenteMetrica AS
SELECT idComponente, fkServidor, tipoComponente, componente.nomeComponente, tipoMemoria, nomeMetrica, unidadeMedida, nomeView 
FROM componente 
JOIN parametro ON fkComponente_idComponente = idComponente 
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
ORDER BY idComponente, fkServidor;

CREATE VIEW vw_maquinasMaiorUsoCpu AS 
	SELECT idComponente, fkServidor, MAX(horario) AS ultimoHorario, valorLido, nomeComponente, idServidor, fkTorre FROM leitura 
    INNER JOIN componente ON leitura.fkComponente_idComponente = componente.idComponente AND leitura.fkComponente_fkServidor = componente.fkServidor 
    INNER JOIN servidor ON componente.fkServidor = servidor.idServidor 
    WHERE tipoComponente = 'CPU' AND valorLido != 0.0 AND fkMetrica = 1
    GROUP BY idComponente, fkServidor
    ORDER BY valorLido DESC
    LIMIT 3;
        
CREATE VIEW vw_alertasRecentes AS 
	SELECT * FROM alerta INNER JOIN componente ON alerta.fkComponente = componente.idComponente 
    INNER JOIN servidor ON componente.fkServidor = servidor.idServidor 
    WHERE TIMESTAMPDIFF(MINUTE, momentoAlerta, NOW()) <= 30;

CREATE VIEW vw_mediaPorDia AS
SELECT a.Dia, a.Mes, a.Ano, a.Reviews, a.Media, a.idComponente, a.idServidor, a.unidadeMedida, a.idMetrica
FROM (
    SELECT
        DAY(l.horario) AS Dia,
        MONTH(l.horario) AS Mes,
        YEAR(l.horario) AS Ano,
        COUNT(l.horario) AS Reviews,
        AVG(l.valorLido) AS Media,
        l.fkComponente_idComponente AS idComponente,
        l.fkComponente_fkServidor AS idServidor,
        m.idMetrica AS idMetrica,
        m.unidadeMedida AS unidadeMedida
    FROM leitura l
    INNER JOIN metrica m on idMetrica = fkMetrica
    GROUP BY YEAR(l.horario), MONTH(l.horario), DAY(l.horario), l.fkComponente_idComponente, l.fkComponente_fkServidor, m.idMetrica
) a
ORDER BY a.Ano, a.Mes, a.Dia;

CREATE VIEW vw_getOptMetricas AS
SELECT idComponente, nomeMetrica, nomeView, fkServidor, idMetrica
FROM metrica
JOIN parametro ON fkMetrica = idMetrica
JOIN componente ON idComponente = fkComponente_idComponente;

CREATE VIEW vw_dadosAnalytics AS
SELECT 
	t.idTorre AS idTorre,
	fkComponente_fkServidor AS idServidor,
	fkComponente_idComponente AS idComponente,
	fkMetrica,
	MONTH(l.horario) AS mes,
	AVG(l.valorLido) AS media,
	unidadeMedida,
	(SELECT 
		COUNT(idComponente) 
	FROM metrica
	JOIN parametro ON fkMetrica = idMetrica
	JOIN componente ON idComponente = fkComponente_idComponente
	) AS qtdMetricas
FROM leitura l
JOIN servidor s ON s.idServidor = l.fkComponente_fkServidor 
JOIN torre t ON t.idTorre = s.fkTorre 
JOIN metrica m ON m.idMetrica = l.fkMetrica
GROUP BY mes, idServidor, idComponente, idTorre, fkMetrica
ORDER BY mes;


INSERT INTO metrica (idMetrica, nomeComponente, nomeMetrica, nomeView, comando, unidadeMedida, isTupla) VALUES 
(1, 'CPU', 'Porcentagem de uso', 'cpuPercent', 'psutil.cpu_percent(interval=0.1)', '%', FALSE);
INSERT INTO metrica (idMetrica, nomeComponente, nomeMetrica, nomeView, comando, unidadeMedida, isTupla) VALUES 
(2, 'RAM', 'Porcentagem de uso', 'ramPercent', 'psutil.virtual_memory().percent', '%', FALSE);
INSERT INTO metrica (idMetrica, nomeComponente, nomeMetrica, nomeView, comando, unidadeMedida, isTupla) VALUES 
(3, 'DISCO', 'Porcentagem de uso', 'diskPercent', 'psutil.disk_usage("/").percent', '%', FALSE);
INSERT INTO metrica (idMetrica, nomeComponente, nomeMetrica, nomeView, comando, unidadeMedida, isTupla) VALUES 
(4, 'CPU', 'Temperatura', 'cpuTemp', 'psutil.sensors_temperatures()["coretemp"][0][1]', '°C', FALSE);

-- dimensional --
CREATE TABLE dim_componente(
	id INT PRIMARY KEY AUTO_INCREMENT
    ,nome VARCHAR(50)
    ,tipo VARCHAR(50)
    ,memoria VARCHAR(50)
    ,tipo_memoria VARCHAR(50)
);

INSERT INTO dim_componente(nome, tipo, memoria, tipo_memoria)
	VALUES("PROCESSADOR INTEL CORE I7-10700F, 8-CORE", "CPU", "8", "Registrador")
    ,("Ssd Kingston M.2", "Disco", "1", "tb")
    ,("Memória Gamer Husky Gaming", "RAM", "8", "gb");

CREATE TABLE dim_servidor(
	mac CHAR(17) PRIMARY KEY
    ,modelo VARCHAR(50)
    ,SO VARCHAR(50)
    ,status_servidor VARCHAR(50)
);

INSERT INTO dim_servidor(mac, modelo, SO, status_servidor)
	VALUES("b0:68:e6:f4:e0:29", "teste", "Linux", "Online");

CREATE TABLE dim_empresa(
	id INT PRIMARY KEY AUTO_INCREMENT
    ,nome VARCHAR(50)
    ,cnpj CHAR(18)
);

INSERT INTO dim_empresa(nome, cnpj)
	VALUES("AirData", "35.770.744/0001-70");

CREATE TABLE dim_aeroporto(
	id INT PRIMARY KEY AUTO_INCREMENT
    ,nome VARCHAR(50)
    ,cep CHAR(9)
    ,num INT
    ,uf CHAR(2)
    ,cidade VARCHAR(50)
    ,bairro VARCHAR(50)
    ,rua VARCHAR(50)
);

INSERT INTO dim_aeroporto
	VALUES(NULL, 'AirData', '08461490', 23, 'SP', 'São paulo', 'Jardins sao paulo', 'diogo peneda');


CREATE TABLE fact_historico_leitura(
	fk_servidor CHAR(17)
    ,fk_componente INT
    ,fk_empresa INT
    ,fk_aeroporto INT
    ,horario DATETIME
    ,valor_leitura VARCHAR(15)
    ,FOREIGN KEY (fk_servidor) REFERENCES dim_servidor(mac)
    ,FOREIGN KEY (fk_componente) REFERENCES dim_componente(id)
    ,FOREIGN KEY (fk_empresa) REFERENCES dim_empresa(id)
    ,FOREIGN KEY (fk_aeroporto) REFERENCES dim_aeroporto(id)
    ,PRIMARY KEY(fk_servidor, fk_componente, fk_empresa, fk_aeroporto, horario)
);