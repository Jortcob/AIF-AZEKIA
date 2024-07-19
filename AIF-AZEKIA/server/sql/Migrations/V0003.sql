GO
-- Eliminar datos de la tabla ProyectoProducido
DELETE FROM [dbo].[ProyectoProducido];

-- Eliminar datos de la tabla ProyectoCertificado
DELETE FROM [dbo].[ProyectoCertificado];

-- Eliminar datos de la tabla FacturaVentaLinea
DELETE FROM [dbo].[FacturaVentaLinea];

-- Eliminar datos de la tabla FacturaVenta
DELETE FROM [dbo].[FacturaVenta];

-- Eliminar datos de la tabla Impuesto
DELETE FROM [dbo].[Impuesto];

-- Eliminar datos de la tabla Proyecto
DELETE FROM [dbo].[Proyecto];

-- Eliminar datos de la tabla Serie
DELETE FROM [dbo].[Serie];

-- Eliminar datos de la tabla Empresa
DELETE FROM [dbo].[Empresa];

-- Eliminar datos de la tabla Cliente
DELETE FROM [dbo].[Cliente];

-- Eliminar datos de la tabla Usuario
DELETE FROM [dbo].[Usuario];
GO
-- Script de inserciones para la tabla Cliente
INSERT INTO [dbo].[Usuario] ([correo], [contrasena], [nombre])
VALUES
    ('juan@example.com', '12345678', 'Juan'),
    ('javi@example.com', '12345678', 'Javier'),
    ('antonio@example.com', '12345678', 'Antonio');

GO

-- Script de inserciones para la tabla Cliente
INSERT INTO [dbo].[Cliente] ([clienteCod], [CIF], [razonSocial], [direccion], [CP], [municipio])
VALUES
    ('CL001', '12345678A', 'Rusvel', 'Avd España, 1', '41701', 'Sevilla'),
    ('CL002', '87654321B', 'Eifagge', 'Avd España, 2', '41701', 'Sevilla'),
    ('CL003', '45678901C', 'Heliopol', 'Avd España, 3', '41701', 'Sevilla');

GO
-- Script de inserciones para la tabla Empresa
INSERT INTO [dbo].[Empresa] ([empresaCod], [CIF], [razonSocial], [direccion], [CP], [municipio])
VALUES
    ('EM001', '87654321A', 'Azekia', 'Avd España, 1', '41701', 'Sevilla'),
    ('EM002', '12345678B', 'ABC', 'Avd España, 2', '41701', 'Sevilla'),
    ('EM003', '45678901D', 'Deloitte', 'Avd España, 3', '41701', 'Sevilla');

GO
-- Script de inserciones para la tabla Serie
INSERT INTO [dbo].[Serie] ([empresaCod], [serieCod], [descripcion], [ultimoNumUsado])
VALUES
    ('EM001', 'S001', 'Serie 1', 4),
    ('EM002', 'S002', 'Serie 2', 2),
    ('EM003', 'S003', 'Serie 3', 1);

GO

-- Script de inserciones para la tabla Proyecto
INSERT INTO [dbo].[Proyecto] ([proyectoCod], [nombre], [fechaInicio], [fechaFinPrevisto], [empresaCod], [clienteCod], [importeTotalPrevisto], [importeExtraPrevisto])
VALUES
    ('PR001', 'Proyecto AIF', '2024-01-01', '2024-06-01', 'EM001', 'CL001', 10000.00, 500.00),
    ('PR002', 'Proyecto eje Z', '2024-02-01', '2024-07-01', 'EM002', 'CL002', 15000.00, 1000.00),
    ('PR003', 'Proyecto Rampage', '2024-03-01', '2024-08-01', 'EM003', 'CL003', 20000.00, 1500.00);

GO

-- Script de inserciones para la tabla FacturaVenta
INSERT INTO [dbo].[FacturaVenta] ([empresaCod], [serieCod], [facturaVentaNum], [clienteCod], [fechaEmision], [bloqueada])
VALUES
    ('EM001', 'S001', 1, 'CL001', '2024-01-15', 0),
    ('EM002', 'S002', 1, 'CL002', '2024-02-15', 1),
    ('EM003', 'S003', 1, 'CL003', '2024-03-15', 0);

GO

-- Script de inserciones para la tabla Impuesto
INSERT INTO [dbo].[Impuesto] ([impuestoCod], [tipoImpuesto], [porcentaje])
VALUES
    ('IVA21', 'IVA', 21.00),
    ('IRPF15', 'IRPF', 15.00);

GO

INSERT INTO [dbo].[FacturaVentaLinea] ([empresaCod], [serieCod], [facturaVentaNum], [facturaVentaLineaNum], [proyectoCod], [texto], [cantidad], [precio], [importeBruto], [descuento], [importeDescuento], [importeNeto], [tipoIVACod], [tipoIRPFCod])
VALUES
    ('EM001', 'S001', 1, 1, 'PR001', 'Línea de factura 1', 2, 50.00, 100.00, 0.00, 0.00, 100.00, 'IVA21', NULL),
    ('EM002', 'S002', 1, 1, 'PR002', 'Línea de factura 2', 3, 40.00, 120.00, 0.00, 0.00, 120.00, 'IVA21', NULL),
    ('EM003', 'S003', 1, 1, 'PR003', 'Línea de factura 3', 4, 30.00, 120.00, 0.00, 0.00, 120.00, 'IVA21', NULL),
    ('EM001', 'S001', 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('EM002', 'S002', 1, 2, NULL, NULL, NULL, NULL, NULL,  NULL, NULL, NULL, NULL, NULL),
    ('EM003', 'S003', 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

GO

-- Script de inserciones para la tabla ProyectoCertificado
INSERT INTO [dbo].[ProyectoCertificado] ([proyectoCod], [fecha], [importe])
VALUES
    ('PR001', '2024-02-01', 5000.00),
    ('PR002', '2024-03-01', 7500.00),
    ('PR003', '2024-04-01', 10000.00);

GO

-- Script de inserciones para la tabla ProyectoProducido
INSERT INTO [dbo].[ProyectoProducido] ([proyectoCod], [fecha], [importe])
VALUES
    ('PR001', '2024-02-01', 5000.00),
    ('PR002', '2024-03-01', 7500.00),
    ('PR003', '2024-04-01', 10000.00);
