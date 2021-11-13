CREATE TABLE datosev(
    id          int(255) AUTO_INCREMENT NOT NULL,
    nodo        VARCHAR(200) NOT NULL,
    nivel       float NOT NULL,
    estado      int(11) NOT NULL,
    hora        TIME NOT NULL,
    fecha       VARCHAR(200) NOT NULL,
    CONSTRAINT pk_datosev PRIMARY KEY(id)
)ENGINE=InnoDB;

CREATE TABLE nodosev(
    id          int(255) NOT NULL AUTO_INCREMENT,
    nodo        VARCHAR(200) NOT NULL,
    estado      VARCHAR(255) NOT NULL,
    espacio       VARCHAR(255) NOT NULL,
    lastact     VARCHAR(255) NOT NULL,
    CONSTRAINT pk_nodosev PRIMARY KEY(id)     
);

CREATE TABLE usuarios(
    id          int(255) NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(200) NOT NULL,
    correo      VARCHAR(200) NOT NULL,
    password    VARCHAR(200) NOT NULL,
    tipo        VARCHAR(20) NOT NULL,
    CONSTRAINT pk_nodosev PRIMARY KEY(id)    
)


|  1 | Carrera 8a #13-03  | Quedan 3 espacios en el contenedor | Hay un espacio disponible de: 0%  |
|  2 | Carrera 15a #13-03 | Quedan 3 espacios en el contenedor | Hay un espacio disponible de: 40% |