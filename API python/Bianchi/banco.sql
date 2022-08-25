create database airdata;
use airdata;
create table torre(
	idTorre int primary key auto_increment,
    nome varchar(45),
    tipo varchar(45),
    login varchar(45),
    senha varchar(45)
);
create table maquina(
	idMaquina int primary key auto_increment,
    fkTorre int,
    nomeMaquina varchar(45),
    macAddress char(17),
    serialNumber varchar(22),
    foreign key(fkTorre) references torre(idtorre)
);
create table blacklist(
	idBlacklist int primary key auto_increment,
    macAddress char(17),
    serialNumber varchar(22),
    dataBloqueio datetime
);
create table logTorre(
    macAddress char(17),
    serialNumber varchar(22),    
    momentoLogin datetime,
    login varchar(45),
    senha varchar(45),
    primary key(macAddress, serialNumber, momentoLogin)
);
create table monitoramento(
	idMonitoramento int primary key auto_increment,
    fkMaquina int,
    percRam decimal(5,2),
    dispRam decimal(5,2),
    percCpu decimal(5,2),
    dispCpu decimal(4,2),
    livreDisco decimal(6,2),
    percDisco decimal(5,2),
    momentoCaptura datetime,
    foreign key(fkMaquina) references maquina(idmaquina)
);
insert into torre values
	(null, 'Torre 1', 'Tipo 1', 'teste1', 'admin123'),
    (null, 'Torre 2', 'Tipo 2', 'teste2', 'admin123')
;