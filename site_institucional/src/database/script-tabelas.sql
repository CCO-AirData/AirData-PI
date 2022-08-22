CREATE DATABASE airData;

USE airData;

CREATE TABLE empresa(
        idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
        cnpjEmpresa CHAR(14),
        telefoneEmpresa CHAR(12)
);
CREATE TABLE aeroporto(
        idAeroporto INT PRIMARY KEY AUTO_INCREMENT,
        fkEmpresa INT,
        FOREIGN KEY(fkEmpresa) REFERENCES empresa (idEmpresa),
        nomeEmpresa VARCHAR(45),   
        numeroEmpresa INT,
        ufAeroporto CHAR(2),
        cidadeAeroporto VARCHAR(45),
        bairroAeroporto VARCHAR(45),
        ruaAeroporto VARCHAR(45)
);
CREATE TABLE usuario(
        idUsuario INT PRIMARY KEY AUTO_INCREMENT,
        nomeUsuario VARCHAR(45),
        emailUsuario VARCHAR(45),
        senhaUsuario VARCHAR(128),  
        cpfUsuario VARCHAR(11),   
        tipoUsuario CHAR(45) CHECK(tipoUsuario IN ('supervisor', 'técnico')),
        fkSupervisor INT,
        FOREIGN KEY (fkSupervisor) REFERENCES usuario (idUsuario),
        fkAeroporto INT,
        FOREIGN KEY (fkAeroporto) REFERENCES aeroporto (idAeroporto)
);