const puppeteer = require('puppeteer');
const fs = require('fs');
const http = require('http');
const path = require('path');

// Leer el HTML desde un archivo externo
const htmlPath = `${process.cwd()}\\data.html`;
let html = fs.readFileSync(htmlPath, 'utf8');

// Obtener la imagen en base64
const imagePath = `${process.cwd()}\\images.png`;
const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

// Modificar el HTML para usar la imagen en base64
html = html.replace('<img src="images.png"', `<img src="data:image/png;base64,${imageBase64}"`);

// Función para generar el PDF
async function generatePDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Configurar la página
    await page.setContent(html);
    
    // Generar PDF
    await page.pdf({ 
      path: 'factura.pdf', 
      format: 'A4', 
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  });

    // Cerrar el navegador
    await browser.close();

    // Servir el PDF en el puerto 3000
    servePDF();
}

// Función para servir el PDF en el puerto 3000
function servePDF() {
    http.createServer(function(req, res) {
        const filePath = path.join(__dirname, 'factura.pdf');
        fs.readFile(filePath, function(err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/pdf' });
            res.end(data);
        });
    }).listen(3000, () => {
        console.log('PDF disponible en el puerto 3000');
    });
}

// Llamar a la función para generar el PDF
generatePDF();