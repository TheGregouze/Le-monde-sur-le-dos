CREATE procedure "dba"."resetCarnet" (@userID int)
BEGIN
     call sa_set_http_header('Access-Control-Allow-Origin', '*');
    DELETE FROM tbCarnets WHERE usrID = @userID;
END


CREATE SERVICE "resetCarnet"
    TYPE 'RAW'
    AUTHORIZATION OFF
    USER "DBA"
    URL ON
    METHODS 'GET'
AS call dba.resetCarnet(:userID);