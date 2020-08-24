CREATE PROCEDURE "DBA"."ajouterPays"(@userId int, @idPays int, @notes varchar(300))
BEGIN 
     call sa_set_http_header('Access-Control-Allow-Origin', '*');   
    INSERT INTO tbCarnets(usrId, paysId, note) values (@userId, @idPays, @notes);
END


CREATE SERVICE "ajouterPays"
    TYPE 'RAW'
    AUTHORIZATION OFF
    USER "DBA"
    URL ON
    METHODS 'GET'
AS call dba.ajouterPays(:userId, :idPays, :notes)

