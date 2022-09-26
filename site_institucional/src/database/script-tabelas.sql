CREATE USER 'airdata_client'@'localhost' IDENTIFIED BY 'sptech';
GRANT SELECT, UPDATE, INSERT, DELETE, EXECUTE, SHOW VIEW ON TechBerry.* TO 'airdata_client'@'localhost';

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
  nomeTorre VARCHAR(45) NOT NULL,
  tipoTorre CHAR(1) NOT NULL,
  senhaTorre VARCHAR(45) NOT NULL,
  loginTorre VARCHAR(45) NOT NULL,
  FOREIGN KEY(fkAeroporto) REFERENCES aeroporto(idAeroporto)
);

CREATE TABLE maquina(
  idMaquina INT PRIMARY KEY AUTO_INCREMENT,
  fkTorre INT NOT NULL,
  FOREIGN KEY(fkTorre) REFERENCES torre(idTorre),
  nomeMaquina VARCHAR(45),
  soMaquina VARCHAR(50) NOT NULL,
  serialNumberMaquina VARCHAR(45) NOT NULL,
  macAddressMaquina VARCHAR(45) NOT NULL
);

CREATE TABLE monitoramento(
  idMonitoramento INT PRIMARY KEY AUTO_INCREMENT,
  fkMaquina INT NOT NULL,
  FOREIGN KEY(fkMaquina) REFERENCES maquina(idMaquina),
  horarioMonitoramento DATETIME NOT NULL,
  cpuMaquinaGhz DECIMAL(5,2) NOT NULL,
  discoMaquinaGb DECIMAL(5,2) NOT NULL,
  memoriaMaquinaGb DECIMAL(5,2) NOT NULL
);

CREATE TABLE alerta (
  idAlerta INT PRIMARY KEY AUTO_INCREMENT,
  tipoAlerta VARCHAR(5) NOT NULL CHECK (tipoAlerta IN('DISCO', 'RAM', 'CPU')),
  fkMonitoramento INT NOT NULL,
  FOREIGN KEY (fkMonitoramento) REFERENCES monitoramento(idMonitoramento)
);

CREATE TABLE blackList (
  idBlackList INT PRIMARY KEY AUTO_INCREMENT,
  serialNumberMaquina VARCHAR(45) NOT NULL,
  macAddresMaquina VARCHAR(45) NOT NULL,
  fkTorre INT NOT NULL,
  FOREIGN KEY (fkTorre) REFERENCES torre(idTorre)
);

CREATE TABLE logTorre(
  idLogTorre INT PRIMARY KEY AUTO_INCREMENT,
  fkTorre INT,
  FOREIGN KEY (fkTorre) REFERENCES torre(idTorre),
  tentativaLogin VARCHAR(45) NOT NULL,
  tentaviaSenha VARCHAR(45) NOT NULL,
  momentoTentativa DATETIME NOT NULL,
  macAddressMaquina VARCHAR(45) NOT NULL,
  serialNumberMaquina VARCHAR(45) NOT NULL
);

SELECT * FROM empresa;
SELECT * FROM aeroporto;
SELECT * FROM usuario;
select * from maquina;
select * from torre;
select * from monitoramento;
select * from alerta;