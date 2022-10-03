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
  nomeTorre VARCHAR(45) NOT NULL,
  tipoTorre CHAR(1) NOT NULL,
  senhaTorre VARCHAR(45) NOT NULL,
  loginTorre VARCHAR(45) NOT NULL,
  FOREIGN KEY(fkAeroporto) REFERENCES aeroporto(idAeroporto)
);

CREATE TABLE servidor (
	idServidor INT PRIMARY KEY AUTO_INCREMENT,
    fkTorre INT NOT NULL,
    FOREIGN KEY(fkTorre) REFERENCES torre(idTorre)
);

CREATE TABLE componente (
	idComponente INT PRIMARY KEY AUTO_INCREMENT,
    fkServidor INT NOT NULL,
    tipoComponente VARCHAR(45) NOT NULL,
    nomeComponente VARCHAR(50) NOT NULL,
    memoria DECIMAL(5,2),
    tipoMemoria VARCHAR(30)
);

CREATE TABLE metrica (
	idMetrica INT PRIMARY KEY AUTO_INCREMENT,
    nomeMetrica VARCHAR(40) NOT NULL,
    comando VARCHAR(50) NOT NULL,
    unidadeMedida VARCHAR(10) NOT NULL,
    isTupla TINYINT NOT NULL
);

CREATE TABLE leitura (
	fkComponente INT NOT NULL,
    fkMetrica INT NOT NULL,
    horario DATETIME NOT NULL,
    valorLido DECIMAL(5,2) NOT NULL,
    FOREIGN KEY(fkComponente) REFERENCES componente(idComponente)
);

CREATE TABLE parametro (
	fkComponente INT NOT NULL,
    fkMetrica INT NOT NULL,
    FOREIGN KEY(fkComponente) REFERENCES componente(idComponente),
    FOREIGN KEY(fkMetrica) REFERENCES metrica(idMetrica)
);