USE [master];
GO

IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'app_aif')
BEGIN
    DROP LOGIN [app_aif];
END
GO

CREATE LOGIN [app_aif] WITH PASSWORD = '12345678', 
    DEFAULT_DATABASE = [master], 
    DEFAULT_LANGUAGE = [Español], 
    CHECK_EXPIRATION = OFF, 
    CHECK_POLICY = OFF;
GO

USE [app_aif];
GO

IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'app_aif')
BEGIN
    DROP USER [app_aif];
END
GO

CREATE USER [app_aif] FOR LOGIN [app_aif] WITH DEFAULT_SCHEMA = [dbo];
GO

ALTER ROLE [db_datareader] ADD MEMBER [app_aif];
GO

ALTER ROLE [db_datawriter] ADD MEMBER [app_aif];
GO
