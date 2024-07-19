USE [app_aif]
GO

/****** Object:  Table [dbo].[FacturaVentaImpuesto]    Script Date: 29/05/2024 12:35:45 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FacturaVentaImpuesto](
	[empresaCod] [varchar](20) NOT NULL,
	[serieCod] [varchar](10) NOT NULL,
	[facturaVentaNum] [int] NOT NULL,
	[impuestoCod] [varchar](10) NOT NULL,
	[base] [decimal](10, 2) NULL,
	[cuota] [decimal](10, 2) NULL,
 CONSTRAINT [PK_FacturaVentaImpuesto] PRIMARY KEY CLUSTERED 
(
	[empresaCod] ASC,
	[serieCod] ASC,
	[facturaVentaNum] ASC,
	[impuestoCod] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[FacturaVentaImpuesto]  WITH CHECK ADD  CONSTRAINT [FK_FacturaVentaImpuesto_FacturaVenta] FOREIGN KEY([empresaCod], [serieCod], [facturaVentaNum])
REFERENCES [dbo].[FacturaVenta] ([empresaCod], [serieCod], [facturaVentaNum])
GO

ALTER TABLE [dbo].[FacturaVentaImpuesto] CHECK CONSTRAINT [FK_FacturaVentaImpuesto_FacturaVenta]
GO

ALTER TABLE [dbo].[FacturaVentaImpuesto]  WITH CHECK ADD  CONSTRAINT [FK_FacturaVentaImpuesto_Impuesto] FOREIGN KEY([impuestoCod])
REFERENCES [dbo].[Impuesto] ([impuestoCod])
GO

ALTER TABLE [dbo].[FacturaVentaImpuesto] CHECK CONSTRAINT [FK_FacturaVentaImpuesto_Impuesto]
GO

