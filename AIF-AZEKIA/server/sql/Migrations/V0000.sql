USE [master]
GO

/****** Object:  Database [app_aif]    Script Date: 24/04/2024 10:15:04 ******/
CREATE DATABASE [app_aif]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'app_aif', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\app_aif.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'app_aif_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\app_aif_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO

ALTER DATABASE [app_aif] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [app_aif] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [app_aif] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [app_aif] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [app_aif] SET ARITHABORT OFF 
GO

ALTER DATABASE [app_aif] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [app_aif] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [app_aif] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [app_aif] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [app_aif] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [app_aif] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [app_aif] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [app_aif] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [app_aif] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [app_aif] SET  DISABLE_BROKER 
GO

ALTER DATABASE [app_aif] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [app_aif] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [app_aif] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [app_aif] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [app_aif] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [app_aif] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [app_aif] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [app_aif] SET RECOVERY FULL 
GO

ALTER DATABASE [app_aif] SET  MULTI_USER 
GO

ALTER DATABASE [app_aif] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [app_aif] SET DB_CHAINING OFF 
GO

ALTER DATABASE [app_aif] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [app_aif] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO

ALTER DATABASE [app_aif] SET DELAYED_DURABILITY = DISABLED 
GO

ALTER DATABASE [app_aif] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO

ALTER DATABASE [app_aif] SET QUERY_STORE = ON
GO

ALTER DATABASE [app_aif] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO

ALTER DATABASE [app_aif] SET  READ_WRITE 
GO


/* For security reasons the login is created disabled and with a random password. */
/****** Object:  Login [app_aif]    Script Date: 24/04/2024 10:12:39 ******/
CREATE LOGIN [app_aif] WITH PASSWORD=N'HraB7cbO9rVhcFTzrIJQu2YeuB3mQijueFJXA5+9nMQ=', DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[Español], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO
    
USE [app_aif]

GO
/****** Object:  User [app_aif]    Script Date: 24/04/2024 10:12:15 ******/
CREATE USER [app_aif] FOR LOGIN [app_aif] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_datareader] ADD MEMBER [app_aif]
GO

ALTER ROLE [db_datawriter] ADD MEMBER [app_aif]
GO

SELECT SUSER_NAME();
