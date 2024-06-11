CREATE TABLE maestro (
  idmaestro INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  nombremaes VARCHAR(200)  NULL  ,
  correoelecmaes VARCHAR(200)  NULL  ,
  nomusuariomaes VARCHAR(200)  NULL  ,
  contramaestro VARCHAR(200)  NULL    ,
PRIMARY KEY(idmaestro));



CREATE TABLE Videos (
  idVideo INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  maestro_idmaestro INTEGER UNSIGNED  NOT NULL  ,
  titulodeo VARCHAR(200)  NULL  ,
  descripcion VARCHAR(200)  NULL  ,
  size INTEGER UNSIGNED  NULL  ,
  tipo VARCHAR(200)  NULL  ,
  url VARCHAR(200)  NULL    ,
PRIMARY KEY(idVideo)  ,
INDEX Video_FKIndex1(maestro_idmaestro),
  FOREIGN KEY(maestro_idmaestro)
    REFERENCES maestro(idmaestro)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE powerpoin (
  idpowerpoin INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  maestro_idmaestro INTEGER UNSIGNED  NOT NULL  ,
  nombrepower VARCHAR(200)  NULL  ,
  descripcionpower VARCHAR(200)  NULL  ,
  urlpower VARCHAR(200)  NULL    ,
PRIMARY KEY(idpowerpoin)  ,
INDEX powerpoin_FKIndex1(maestro_idmaestro),
  FOREIGN KEY(maestro_idmaestro)
    REFERENCES maestro(idmaestro)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE estudiante (
  idestudiante INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  powerpoin_idpowerpoin INTEGER UNSIGNED  NOT NULL  ,
  Video_idVideo INTEGER UNSIGNED  NOT NULL  ,
  nombreest VARCHAR(200)  NULL  ,
  correoelecest VARCHAR(200)  NULL  ,
  nombreusuarioest VARCHAR(200)  NULL  ,
  contrase VARCHAR(200)  NULL    ,
PRIMARY KEY(idestudiante)  ,
INDEX estudiante_FKIndex1(Video_idVideo)  ,
INDEX estudiante_FKIndex2(powerpoin_idpowerpoin),
  FOREIGN KEY(Video_idVideo)
    REFERENCES Video(idVideo)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(powerpoin_idpowerpoin)
    REFERENCES powerpoin(idpowerpoin)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE resumen (
  idresumen INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  powerpoin_idpowerpoin INTEGER UNSIGNED  NOT NULL  ,
  Video_idVideo INTEGER UNSIGNED  NOT NULL  ,
  tituloresu VARCHAR(200)  NULL  ,
  subtitulos VARCHAR(200)  NULL  ,
  contenido VARCHAR(200)  NULL    ,
PRIMARY KEY(idresumen)  ,
INDEX resumen_FKIndex1(Video_idVideo)  ,
INDEX resumen_FKIndex2(powerpoin_idpowerpoin),
  FOREIGN KEY(Video_idVideo)
    REFERENCES Video(idVideo)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(powerpoin_idpowerpoin)
    REFERENCES powerpoin(idpowerpoin)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);




