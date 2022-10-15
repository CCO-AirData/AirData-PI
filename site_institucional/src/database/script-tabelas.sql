CREATE USER 'airdata_client'@'localhost' IDENTIFIED BY 'sptech';
GRANT SELECT, UPDATE, INSERT, DELETE, EXECUTE, SHOW VIEW ON airData.* TO 'airdata_client'@'localhost';

DROP DATABASE IF EXISTS airData;
CREATE DATABASE airData;
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
	idAlerta INT PRIMARY KEY,
	motivo VARCHAR(45),
	momentoAlerta DATETIME,
	fkComponente INT,
	FOREIGN KEY (fkComponente) references componente(idComponente)
);

CREATE TABLE metrica (
	idMetrica INT PRIMARY KEY AUTO_INCREMENT,
    nomeMetrica VARCHAR(40) NOT NULL,
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

-- Views
CREATE VIEW vw_iniciarSessao AS
SELECT idUsuario, nomeUsuario, emailUsuario, senhaUsuario, tipoUsuario, idTorre, torre.fkAeroporto, fkGestor, fkSupervisor
FROM usuario, aeroporto, torre
WHERE usuario.fkAeroporto = idAeroporto 
AND torre.fkAeroporto = idAeroporto;

CREATE VIEW vw_cpuPercent AS
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE nomeMetrica = 'cpuPercent'
ORDER BY horario DESC;

CREATE VIEW vw_ramPercent AS
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE nomeMetrica = 'ramPercent'
ORDER BY horario DESC;

CREATE VIEW vw_diskPercent AS
SELECT idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE nomeMetrica = 'diskPercent'
ORDER BY horario DESC;

-- Inserts 
INSERT INTO empresa (nomeEmpresa,cnpjEmpresa,telefoneEmpresa) VALUES 
('AirData', '00.000.000/0000-00', '(00) 0000-0000');
INSERT INTO aeroporto (fkEmpresa,nomeAeroporto,cepAeroporto,numeroAeroporto,ufAeroporto,cidadeAeroporto,bairroAeroporto,ruaAeroporto) VALUES 
('1', 'AirData', '01414-000', '123', 'SP', 'São Paulo', 'Cerqueira César', 'Rua Haddock Lobo');
INSERT INTO usuario (nomeUsuario,emailUsuario,senhaUsuario,cpfUsuario,tipoUsuario,fkAeroporto) VALUES 
('Pedro Jesuino', 'pedrojesuino@airdata.com', '1853b8feb6917afbc3ca2b99157583ec7e5698932bd50e9f389a2378a3f6999cf97c4c6c82917ea4955580b9df3c540bcfec50d50b67d4bb0418a09712246e72','000.000.000-00','G','1');
INSERT INTO torre VALUES (null,1);

# antes de inserir esses dados abaixo, 
# cadastre o servidor na API python e 
# mude o endereço mac abaixo para o da sua máquina!!!!

INSERT INTO componente VALUES (null, '00:e0:4c:36:39:83', 'CPU', 'CPU1', 4.00, 'Registrador');
INSERT INTO componente VALUES (null, '00:e0:4c:36:39:83', 'RAM', 'RAM1', 16.00, 'RAM');
INSERT INTO componente VALUES (null, '00:e0:4c:36:39:83', 'DISK', 'DISK1', 500.00, 'HD');
INSERT INTO metrica VALUES (null, 'cpuPercent', 'psutil.cpu_percent(interval=0.1)', '%', FALSE);
INSERT INTO metrica VALUES (null, 'ramPercent', 'psutil.virtual_memory().percent', '%', FALSE);
INSERT INTO metrica VALUES (null, 'diskPercent', 'psutil.disk_usage("/").percent', '%', FALSE);
INSERT INTO parametro VALUES (1, 1, "00:e0:4c:36:39:83");
INSERT INTO parametro VALUES (2, 2, "00:e0:4c:36:39:83");
INSERT INTO parametro VALUES (3, 3, "00:e0:4c:36:39:83");

-- Selects
SELECT * FROM usuario;
SELECT * FROM empresa;
SELECT * FROM aeroporto;
SELECT * FROM torre;
SELECT * FROM servidor;
SELECT * FROM componente;
SELECT * FROM metrica;
SELECT * FROM leitura;
SELECT * FROM parametro;

SELECT * FROM vw_iniciarSessao;
SELECT * FROM vw_cpuPercent;
SELECT * FROM vw_ramPercent;
SELECT * FROM vw_diskPercent;

-- ************************* SCRIPT SQL SERVER *****************************

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

CREATE TABLE metrica (
	idMetrica INT PRIMARY KEY IDENTITY(1,1),
    nomeMetrica VARCHAR(40) NOT NULL,
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

CREATE VIEW vw_iniciarSessao AS
SELECT idUsuario, nomeUsuario, emailUsuario, senhaUsuario, tipoUsuario, idTorre, torre.fkAeroporto, fkGestor, fkSupervisor
FROM usuario, aeroporto, torre
WHERE usuario.fkAeroporto = idAeroporto 
AND torre.fkAeroporto = idAeroporto;

CREATE VIEW vw_cpuPercent AS
SELECT TOP 12 idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE nomeMetrica = 'cpuPercent'
ORDER BY horario DESC;

CREATE VIEW vw_ramPercent AS
SELECT TOP 12 idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE nomeMetrica = 'ramPercent'
ORDER BY horario DESC;

CREATE VIEW vw_diskPercent AS
SELECT TOP 12 idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida 
FROM leitura
JOIN componente ON fkComponente_idComponente = idComponente
AND fkComponente_fkServidor = fkServidor
JOIN metrica ON fkMetrica = idMetrica
WHERE nomeMetrica = 'diskPercent'
ORDER BY horario DESC;

SELECT TOP ${limite} * FROM vw_${metrica} WHERE idServidor = "${idMaquina}";





