CREATE TABLE tbPays(
paysId int NOT NULL,
paysLib varchar(30) NOT NULL,
drapeau varchar(60) NOT NULL,
CONSTRAINT pkPays PRIMARY KEY(paysId),
);

CREATE TABLE tbUsers(
usrId int NOT NULL DEFAULT AUTOINCREMENT,
usrName varchar(30) NOT NULL,
usrKey varchar(20) NOT NULL,
CONSTRAINT pkUsr PRIMARY KEY(usrId),
);

CREATE TABLE tbCarnets(
usrId int NOT NULL,
paysId int NOT NULL,
note varchar(300) NOT NULL,
CONSTRAINT pkCarnets PRIMARY KEY(usrId, paysId),
CONSTRAINT fkPays FOREIGN KEY(paysId) REFERENCES tbPays(paysId) on delete restrict,
CONSTRAINT fkUsr FOREIGN KEY(usrId) REFERENCES tbUsers(usrId) on delete restrict,
);