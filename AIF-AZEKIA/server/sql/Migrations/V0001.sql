USE [app_aif]
GO

CREATE TABLE [Empresa](
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

ALTER TABLE [dbo].[Proyecto]
ADD CONSTRAINT FK_Proyecto_Empresa 
FOREIGN KEY ([empresaCod]) 
REFERENCES [dbo].[Empresa] ([empresaCod]);

ALTER TABLE [dbo].[Proyecto]
ADD CONSTRAINT FK_Proyecto_Cliente 
FOREIGN KEY ([clienteCod]) 
REFERENCES [dbo].[Cliente] ([clienteCod]);

GO

CREATE TABLE [dbo].[ProyectoProducido](
	[proyectoProducidoNum] [int] NOT NULL,
	[proyectoCod] [varchar](20) NOT NULL,
	[fecha] [date] NOT NULL,
	[importe] [decimal](10, 2) NOT NULL,
 CONSTRAINT [PK_ProyectoProducido] PRIMARY KEY CLUSTERED 
(
	[proyectoProducidoNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProyectoProducido]
ADD CONSTRAINT FK_ProyectoProducido_Proyecto 
FOREIGN KEY ([proyectoCod]) 
REFERENCES [dbo].[Proyecto] ([proyectoCod]);

GO

CREATE TABLE [dbo].[ProyectoCertificado](
	[proyectoCertificadoNum] [int] NOT NULL,
	[proyectoCod] [varchar](20) NOT NULL,
	[fecha] [date] NOT NULL,
	[importe] [decimal](10, 2) NOT NULL,
 CONSTRAINT [PK_ProyectoCertificado] PRIMARY KEY CLUSTERED 
(
	[proyectoCertificadoNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProyectoCertificado]
ADD CONSTRAINT FK_ProyectoCertificado_Proyecto 
FOREIGN KEY ([proyectoCod]) 
REFERENCES [dbo].[Proyecto] ([proyectoCod]);

GO

CREATE TABLE [dbo].[Serie](
	[serieCod] [varchar](10) NOT NULL,
	[descripcion] [varchar](100) NOT NULL,
	[ultimoNumUsado] [int] NOT NULL,
 CONSTRAINT [PK_Serie] PRIMARY KEY CLUSTERED 
(
	[serieCod] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[FacturaVenta](
	[empresaCod] [varchar](20) NOT NULL,
	[clienteCod] [varchar](20) NOT NULL,
	[serieCod] [varchar](10) NOT NULL,
	[facturaVentaNum] [INT] NOT NULL,
	[bloqueada] [bit] NOT NULL,
	[fechaEmision] [date] NOT NULL,
 CONSTRAINT [PK_FacturaVenta] PRIMARY KEY CLUSTERED 
(
	[facturaVentaNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[FacturaVenta]
ADD CONSTRAINT FK_FacturaVenta_Empresa 
FOREIGN KEY ([empresaCod]) 
REFERENCES [dbo].[Empresa] ([empresaCod]);

ALTER TABLE [dbo].[FacturaVenta]
ADD CONSTRAINT FK_FacturaVenta_Cliente 
FOREIGN KEY ([clienteCod]) 
REFERENCES [dbo].[Cliente] ([clienteCod]);

ALTER TABLE [dbo].[FacturaVenta]
ADD CONSTRAINT FK_FacturaVenta_Serie 
FOREIGN KEY ([serieCod]) 
REFERENCES [dbo].[Serie] ([serieCod]);

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

CREATE TABLE [dbo].[FacturaVentaLinea](
	[empresaCod] [varchar](20) NOT NULL,
	[serieCod] [varchar](10) NOT NULL,
	[facturaVentaNum] [int] NOT NULL,
	[facturaVentaLineaNum] [int] NOT NULL,
	[proyectoCod] [varchar](20) NOT NULL,
	[texto] [varchar](150) NOT NULL,
	[cantidad] [int] NOT NULL,
	[precio] [decimal](10, 2) NOT NULL,
	[importeBruto] [decimal](10, 0) NOT NULL,
	[descuento] [decimal](10, 2) NOT NULL,
	[importeDescuento] [decimal](10, 2) NOT NULL,
	[importeNeto] [decimal](10, 2) NOT NULL,
	[tipoIVACod] [varchar](10) NOT NULL,
	[tipoIRPFCod] [varchar](10) NOT NULL,
 CONSTRAINT [PK_FacturaVentaLinea] PRIMARY KEY CLUSTERED 
(
	[facturaVentaLineaNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[FacturaVentaLinea]
ADD CONSTRAINT FK_FacturaVentaLinea_Proyecto 
FOREIGN KEY ([proyectoCod]) 
REFERENCES [dbo].[Proyecto] ([proyectoCod]);

ALTER TABLE [dbo].[FacturaVentaLinea]
ADD CONSTRAINT FK_FacturaVentaLinea_IVA 
FOREIGN KEY ([tipoIVACod]) 
REFERENCES [dbo].[Impuesto] ([impuestoCod]);

ALTER TABLE [dbo].[FacturaVentaLinea]
ADD CONSTRAINT FK_FacturaVentaLinea_IRPF 
FOREIGN KEY ([tipoIRPFCod]) 
REFERENCES [dbo].[Impuesto] ([impuestoCod]);

GO

