CREATE PROCEDURE "DBA"."recupererCarnet"(@userID int)
RESULT (libPays varchar(30), notes varchar(300))
BEGIN
    call sa_set_http_header('Content-Type','application:json; charset=utf-8');
     call sa_set_http_header('Access-Control-Allow-Origin', '*');
    SELECT paysLib, note
    FROM tbPays
    JOIN tbCarnets ON tbPays.paysID = tbCarnets.paysID
    WHERE usrID = @userID;
END


CREATE SERVICE "recupererCarnet"
    TYPE 'JSON'
    AUTHORIZATION OFF
    USER "DBA"
    URL ON
    METHODS 'GET'
AS call dba.recupererCarnet(:userID)