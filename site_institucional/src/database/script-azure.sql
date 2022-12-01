CREATE TABLE empresa (
    idEmpresa INT PRIMARY KEY IDENTITY(1,1),
    cnpjEmpresa CHAR(18) NOT NULL,
    nomeEmpresa VARCHAR(45) NOT NULL,
    telefoneEmpresa CHAR(14)
);

CREATE TABLE aeroporto (
    idAeroporto INT PRIMARY KEY IDENTITY(1,1),
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
	idUsuario INT PRIMARY KEY IDENTITY(1,1),
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
    idTorre INT PRIMARY KEY IDENTITY(1,1),
    fkAeroporto INT NOT NULL,
    FOREIGN KEY(fkAeroporto) REFERENCES aeroporto(idAeroporto)
);

CREATE TABLE servidor (
	idServidor VARCHAR(17) PRIMARY KEY,
    fkTorre INT NOT NULL,
    FOREIGN KEY(fkTorre) REFERENCES torre(idTorre)
);

CREATE TABLE componente (
	idComponente INT IDENTITY(1,1),
    fkServidor VARCHAR(17) NOT NULL,
    tipoComponente VARCHAR(45) NOT NULL,
    nomeComponente VARCHAR(50) NOT NULL,
    memoria DECIMAL(5,2),
    tipoMemoria VARCHAR(30),
    FOREIGN KEY (fkServidor) REFERENCES servidor(idServidor),
    PRIMARY KEY(idComponente, fkServidor)
);

CREATE TABLE alerta(
	idAlerta INT PRIMARY KEY IDENTITY(1,1),
	statusAlerta VARCHAR(45) NOT NULL,
	momentoAlerta DATETIME NOT NULL,
	fkComponente INT NOT NULL,
	fkServidor VARCHAR(17) NOT NULL,
	FOREIGN KEY (fkComponente, fkServidor) references componente(idComponente, fkServidor)
);

CREATE TABLE metrica (
	idMetrica INT PRIMARY KEY,
    nomeComponente VARCHAR(40) NOT NULL,
    nomeMetrica VARCHAR(40) NOT NULL,
    nomeView VARCHAR(40) NOT NULL,
    comando VARCHAR(50) NOT NULL,
    unidadeMedida VARCHAR(10) NOT NULL,
    isTupla BIT NOT NULL
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

CREATE VIEW vw_iniciarSessao AS
SELECT idUsuario, nomeUsuario, emailUsuario, senhaUsuario, tipoUsuario, idTorre, torre.fkAeroporto, nomeEmpresa, nomeAeroporto, fkGestor, fkSupervisor
FROM usuario, aeroporto, torre, empresa
WHERE usuario.fkAeroporto = idAeroporto 
AND torre.fkAeroporto = idAeroporto
AND fkEmpresa = idEmpresa;

CREATE VIEW vw_cpuPercent AS 
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE idMetrica = 1;

CREATE VIEW vw_ramPercent AS 
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE idMetrica = 2;

CREATE VIEW vw_diskPercent AS 
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE idMetrica = 3;

CREATE VIEW vw_cpuTemp AS 
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE idMetrica = 4;

CREATE VIEW vw_alertas as
SELECT TOP 150 idAlerta, statusAlerta, momentoAlerta, fkTorre, tipoComponente, idServidor
FROM alerta
JOIN componente ON fkComponente = idComponente
JOIN servidor ON alerta.fkServidor = idServidor
JOIN torre ON fkTorre = idTorre
ORDER BY momentoAlerta DESC;

CREATE VIEW vw_onlineServers AS	
	SELECT servidor.fkTorre, fkComponente_fkServidor AS idServidor, MAX(horario) AS ultimaLeitura, DATEDIFF(MINUTE, MAX(horario), DATEADD(HOUR, -3, GETDATE())) AS minutosDesdeUltimaLeitura, 
		CASE WHEN DATEDIFF(MINUTE, MAX(horario), DATEADD(HOUR, -3, GETDATE())) > 1 THEN 'OFFLINE'
		ELSE 'ONLINE'
		END AS estado
	FROM leitura
    INNER JOIN servidor ON servidor.idServidor = leitura.fkComponente_fkServidor
	GROUP BY fkComponente_fkServidor, fkTorre;
    
CREATE VIEW vw_componenteMetrica AS
SELECT TOP 50 idComponente, fkServidor, tipoComponente, componente.nomeComponente, tipoMemoria, nomeMetrica, unidadeMedida, nomeView, idMetrica
FROM componente 
JOIN parametro ON fkComponente_idComponente = idComponente 
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
ORDER BY idComponente, fkServidor; 

CREATE VIEW vw_maquinasMaiorUsoCpu AS 	
	SELECT TOP 3 idComponente, fkServidor, MAX(horario) AS ultimoHorario, valorLido, nomeComponente, idServidor, fkTorre FROM leitura 
    INNER JOIN componente ON leitura.fkComponente_idComponente = componente.idComponente AND leitura.fkComponente_fkServidor = componente.fkServidor 
    INNER JOIN servidor ON componente.fkServidor = servidor.idServidor 
    WHERE tipoComponente = 'CPU' AND valorLido != 0.0 AND fkMetrica = 1
    GROUP BY idComponente, fkServidor, valorLido, componente.nomeComponente, servidor.idServidor, servidor.fkTorre
    ORDER BY valorLido DESC;

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
    GROUP BY YEAR(l.horario), MONTH(l.horario), DAY(l.horario), l.fkComponente_idComponente, l.fkComponente_fkServidor, m.idMetrica, unidadeMedida
) a
GROUP BY a.Ano, a.Mes, a.Dia, a.Reviews, a.Media, a.idComponente, a.idServidor, a.unidadeMedida, a.idMetrica;

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
GROUP BY MONTH(l.horario), t.idTorre, l.fkComponente_fkServidor, l.fkComponente_idComponente, l.fkMetrica, m.unidadeMedida;
    


-- 0 = false
-- 1 = true

INSERT INTO metrica VALUES (1, 'CPU', 'Porcentagem de uso', 'cpuPercent', 'psutil.cpu_percent(interval=0.1)', '%', 0);
INSERT INTO metrica VALUES (2, 'RAM', 'Porcentagem de uso', 'ramPercent', 'psutil.virtual_memory().percent', '%', 0);
INSERT INTO metrica VALUES (3, 'DISCO', 'Porcentagem de uso', 'diskPercent', 'psutil.disk_usage("/").percent', '%', 0);
INSERT INTO metrica VALUES (4, 'CPU', 'Temperatura', 'cpuTemp', 'psutil.sensors_temperatures()', '°C', 0);
