
USE [app_aif]

GO
/****** Object:  Table [dbo].[Dominio]    Script Date: 06/05/2024 10:18:55 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Dominio](
	[dominio] [varchar](50) NOT NULL,
	[codigo] [varchar](50) NOT NULL,
	[descripcion] [varchar](100) NOT NULL,
	
 CONSTRAINT [PK_Dominio] PRIMARY KEY CLUSTERED 
(
	[dominio] ASC,
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
-- Script de inserciones para la tabla Dominio
INSERT INTO [dbo].[Dominio] ([dominio], [codigo], [descripcion])
VALUES
    ('TIPOIMPUESTO', 'IVA', 'I.V.A.'),
    ('TIPOIMPUESTO', 'IRPF', 'I.R.P.F.'),
    ('COLOR', 'RED', 'rojo'),
    ('COLOR', 'GREEN', 'verde'),
    ('COLOR', 'BLUE', 'azul');

GO