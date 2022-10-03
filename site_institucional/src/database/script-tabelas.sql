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
	idServidor VARCHAR(17) PRIMARY KEY,
    fkTorre INT NOT NULL,
    FOREIGN KEY(fkTorre) REFERENCES torre(idTorre)
);

CREATE TABLE componente (
	idComponente INT AUTO_INCREMENT,
    fkServidor INT NOT NULL,
    tipoComponente VARCHAR(45) NOT NULL,
    nomeComponente VARCHAR(50) NOT NULL,
    memoria DECIMAL(5,2),
    tipoMemoria VARCHAR(30),
    PRIMARY KEY(idComponente, fkServidor)
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
    fkComponente_fkServidor INT NOT NULL,
    FOREIGN KEY(fkComponente) REFERENCES componente(idComponente)
);

CREATE TABLE parametro (
	fkMetrica INT NOT NULL,
	fkComponente_idComponente INT NOT NULL,
    fkComponente_fkServidor INT NOT NULL,
    FOREIGN KEY(fkMetrica) REFERENCES metrica(idMetrica),
    FOREIGN KEY(fkComponente_idComponente) REFERENCES componente(idComponente),
    FOREIGN KEY(fkComponente_fkServidor) REFERENCES componente(fkServidor)
);

INSERT INTO empresa (nomeEmpresa,cnpjEmpresa,telefoneEmpresa) VALUES 
('Guaraná', '12.321.232/1232-12', '(17) 8278-9387');
INSERT INTO usuario (nomeUsuario,emailUsuario,senhaUsuario,cpfUsuario,tipoUsuario,fkAeroporto) VALUES 
('Hugo Hanashiro', 'hugo@hanashiro.com', '1853b8feb6917afbc3ca2b99157583ec7e5698932bd50e9f389a2378a3f6999cf97c4c6c82917ea4955580b9df3c540bcfec50d50b67d4bb0418a09712246e72','486.502.048-99','G','1');
