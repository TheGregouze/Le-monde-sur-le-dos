CREATE PROCEDURE "DBA"."getPays"()
RESULT (idPays int, libPays varchar(20))
BEGIN
     call sa_set_http_header('Access-Control-Allow-Origin', '*');
    call sa_set_http_header('Content-Type','application:json; charset=utf-8');
    SELECT paysId, paysLib
    FROM tbPays
END


CREATE SERVICE "getPays"
    TYPE 'JSON'
    AUTHORIZATION OFF
    USER "DBA"
    URL ON
    METHODS 'GET'
AS call dba.getPays();