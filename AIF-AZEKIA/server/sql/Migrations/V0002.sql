USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'app_aif')
BEGIN
    ALTER DATABASE [app_aif] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    -- Verificar si hay conexiones activas
    DECLARE @Connections INT;
    SET @Connections = (
        SELECT COUNT(*)
        FROM sys.dm_exec_sessions
        WHERE database_id = DB_ID('app_aif')
    );

    IF @Connections = 0
    BEGIN
        -- Si no hay conexiones activas, eliminar la base de datos
        DROP DATABASE [app_aif];
    END
    ELSE
    BEGIN
        -- Si hay conexiones activas, esperar un momento y volver a intentarlo
        WAITFOR DELAY '00:00:05'; -- Esperar 5 segundos
        DROP DATABASE [app_aif];
    END
END
GO


/****** Object:  Database [app_aif]    Script Date: 06/05/2024 11:36:55 ******/
CREATE DATABASE [app_aif]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'app_aif', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\app_aif.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'app_aif_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\app_aif_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [app_aif].[dbo].[sp_fulltext_database] @action = 'enable'
end
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

USE [app_aif]

GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 06/05/2024 10:18:55 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Usuario](
	[correo] [varchar](100) NOT NULL,
	[contrasena] [varchar](150) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	
 CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED 
(
	[correo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Cliente]    Script Date: 06/05/2024 10:18:55 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Cliente](
	[clienteCod] [varchar](20) NOT NULL,
	[CIF] [varchar](20) NOT NULL,
	[razonSocial] [varchar](100) NOT NULL,
	[direccion] [varchar](150) NOT NULL,
	[CP] [varchar](50) NOT NULL,
	[municipio] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Cliente] PRIMARY KEY CLUSTERED 
(
	[clienteCod] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[Empresa]    Script Date: 06/05/2024 10:21:20 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Empresa](
	[empresaCod] [varchar](20) NOT NULL,
	[CIF] [varchar](20) NOT NULL,
	[razonSocial] [varchar](100) NOT NULL,
	[direccion] [varchar](150) NOT NULL,
	[CP] [varchar](10) NOT NULL,
	[municipio] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Empresa] PRIMARY KEY CLUSTERED 
(
	[empresaCod] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[Serie]    Script Date: 06/05/2024 10:22:57 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Serie](
	[empresaCod] [varchar](20) NOT NULL,
	[serieCod] [varchar](10) NOT NULL,
	[descripcion] [varchar](100) NOT NULL,
	[ultimoNumUsado] [int] NOT NULL,
 CONSTRAINT [PK_Serie] PRIMARY KEY CLUSTERED 
(
	[empresaCod] ASC,
	[serieCod] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Serie]  WITH CHECK ADD  CONSTRAINT [FK_Serie_Empresa] FOREIGN KEY([empresaCod])
REFERENCES [dbo].[Empresa] ([empresaCod])
GO

ALTER TABLE [dbo].[Serie] CHECK CONSTRAINT [FK_Serie_Empresa]
GO


/****** Object:  Table [dbo].[Proyecto]    Script Date: 06/05/2024 10:22:06 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Proyecto](
	[proyectoCod] [varchar](20) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	[fechaInicio] [date] NOT NULL,
	[fechaFinPrevisto] [date] NOT NULL,
	[empresaCod] [varchar](20) NOT NULL,
	[clienteCod] [varchar](20) NOT NULL,
	[importeTotalPrevisto] [decimal](10, 2) NOT NULL,
	[importeExtraPrevisto] [decimal](10, 2) NOT NULL,
 CONSTRAINT [PK_Proyecto] PRIMARY KEY CLUSTERED 
(
	[proyectoCod] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Proyecto]  WITH CHECK ADD  CONSTRAINT [FK_Proyecto_Cliente] FOREIGN KEY([clienteCod])
REFERENCES [dbo].[Cliente] ([clienteCod])
GO

ALTER TABLE [dbo].[Proyecto] CHECK CONSTRAINT [FK_Proyecto_Cliente]
GO

ALTER TABLE [dbo].[Proyecto]  WITH CHECK ADD  CONSTRAINT [FK_Proyecto_Empresa] FOREIGN KEY([empresaCod])
REFERENCES [dbo].[Empresa] ([empresaCod])
GO

ALTER TABLE [dbo].[Proyecto] CHECK CONSTRAINT [FK_Proyecto_Empresa]
GO


/****** Object:  Table [dbo].[FacturaVenta]    Script Date: 06/05/2024 10:21:34 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FacturaVenta](
	[empresaCod] [varchar](20) NOT NULL,
	[serieCod] [varchar](10) NOT NULL,
	[facturaVentaNum] [int] NOT NULL,
	[clienteCod] [varchar](20) NOT NULL,
	[fechaEmision] [date] NOT NULL,
	[bloqueada] [bit] NOT NULL,
 CONSTRAINT [PK_FacturaVenta] PRIMARY KEY CLUSTERED 
(
	[empresaCod] ASC,
	[serieCod] ASC,
	[facturaVentaNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[FacturaVenta]  WITH CHECK ADD  CONSTRAINT [FK_FacturaVenta_Cliente] FOREIGN KEY([clienteCod])
REFERENCES [dbo].[Cliente] ([clienteCod])
GO

ALTER TABLE [dbo].[FacturaVenta] CHECK CONSTRAINT [FK_FacturaVenta_Cliente]
GO

ALTER TABLE [dbo].[FacturaVenta]  WITH CHECK ADD  CONSTRAINT [FK_FacturaVenta_Serie] FOREIGN KEY([empresaCod], [serieCod])
REFERENCES [dbo].[Serie] ([empresaCod], [serieCod])
GO

ALTER TABLE [dbo].[FacturaVenta] CHECK CONSTRAINT [FK_FacturaVenta_Serie]
GO

/****** Object:  Table [dbo].[Impuesto]    Script Date: 06/05/2024 10:21:55 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Impuesto](
	[impuestoCod] [varchar](10) NOT NULL,
	[tipoImpuesto] [varchar](50) NOT NULL,
	[porcentaje] [decimal](5, 2) NOT NULL,
 CONSTRAINT [PK_Impuesto] PRIMARY KEY CLUSTERED 
(
	[impuestoCod] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[FacturaVentaLinea]    Script Date: 06/05/2024 10:21:46 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FacturaVentaLinea](
	[empresaCod] [varchar](20) NOT NULL,
	[serieCod] [varchar](10) NOT NULL,
	[facturaVentaNum] [int] NOT NULL,
	[facturaVentaLineaNum] [int] NOT NULL,
	[proyectoCod] [varchar](20) NULL,
	[texto] [varchar](150) NULL,
	[cantidad] [int] NULL,
	[precio] [decimal](10, 2) NULL,
	[importeBruto] [decimal](10, 2) NULL,
	[descuento] [decimal](10, 2) NULL,
	[importeDescuento] [decimal](10, 2) NULL,
	[importeNeto] [decimal](10, 2) NULL,
	[tipoIVACod] [varchar](10) NULL,
	[tipoIRPFCod] [varchar](10) NULL,
 CONSTRAINT [PK_FacturaVentaLinea] PRIMARY KEY CLUSTERED 
(
	[empresaCod] ASC,
	[serieCod] ASC,
	[facturaVentaNum] ASC,
	[facturaVentaLineaNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[FacturaVentaLinea]  WITH CHECK ADD  CONSTRAINT [FK_FacturaVentaLinea_FacturaVenta] FOREIGN KEY([empresaCod], [serieCod], [facturaVentaNum])
REFERENCES [dbo].[FacturaVenta] ([empresaCod], [serieCod], [facturaVentaNum])
GO

ALTER TABLE [dbo].[FacturaVentaLinea] CHECK CONSTRAINT [FK_FacturaVentaLinea_FacturaVenta]
GO

ALTER TABLE [dbo].[FacturaVentaLinea]  WITH CHECK ADD  CONSTRAINT [FK_FacturaVentaLinea_ImpuestoIRPF] FOREIGN KEY([tipoIRPFCod])
REFERENCES [dbo].[Impuesto] ([impuestoCod])
GO

ALTER TABLE [dbo].[FacturaVentaLinea] CHECK CONSTRAINT [FK_FacturaVentaLinea_ImpuestoIRPF]
GO

ALTER TABLE [dbo].[FacturaVentaLinea]  WITH CHECK ADD  CONSTRAINT [FK_FacturaVentaLinea_ImpuestoIVA] FOREIGN KEY([tipoIVACod])
REFERENCES [dbo].[Impuesto] ([impuestoCod])
GO

ALTER TABLE [dbo].[FacturaVentaLinea] CHECK CONSTRAINT [FK_FacturaVentaLinea_ImpuestoIVA]
GO

ALTER TABLE [dbo].[FacturaVentaLinea]  WITH CHECK ADD  CONSTRAINT [FK_FacturaVentaLinea_Proyecto] FOREIGN KEY([proyectoCod])
REFERENCES [dbo].[Proyecto] ([proyectoCod])
GO

ALTER TABLE [dbo].[FacturaVentaLinea] CHECK CONSTRAINT [FK_FacturaVentaLinea_Proyecto]
GO


/****** Object:  Table [dbo].[ProyectoCertificado]    Script Date: 06/05/2024 10:22:35 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ProyectoCertificado](
	[proyectoCod] [varchar](20) NOT NULL,
	[fecha] [date] NOT NULL,
	[importe] [decimal](10, 2) NOT NULL,
 CONSTRAINT [PK_ProyectoCertificado_1] PRIMARY KEY CLUSTERED 
(
	[proyectoCod] ASC,
	[fecha] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProyectoCertificado]  WITH CHECK ADD  CONSTRAINT [FK_ProyectoCertificado_Proyecto] FOREIGN KEY([proyectoCod])
REFERENCES [dbo].[Proyecto] ([proyectoCod])
GO

ALTER TABLE [dbo].[ProyectoCertificado] CHECK CONSTRAINT [FK_ProyectoCertificado_Proyecto]
GO


/****** Object:  Table [dbo].[ProyectoProducido]    Script Date: 06/05/2024 10:22:46 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ProyectoProducido](
	[proyectoCod] [varchar](20) NOT NULL,
	[fecha] [date] NOT NULL,
	[importe] [decimal](10, 2) NOT NULL,
 CONSTRAINT [PK_ProyectoProducido_1] PRIMARY KEY CLUSTERED 
(
	[proyectoCod] ASC,
	[fecha] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProyectoProducido]  WITH CHECK ADD  CONSTRAINT [FK_ProyectoProducido_Proyecto] FOREIGN KEY([proyectoCod])
REFERENCES [dbo].[Proyecto] ([proyectoCod])
GO

ALTER TABLE [dbo].[ProyectoProducido] CHECK CONSTRAINT [FK_ProyectoProducido_Proyecto]
GO



