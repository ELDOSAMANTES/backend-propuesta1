// src/controllers/documento.controller.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuración necesaria para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generarPdf = async (req, res, next) => {
  try {
    // 1. Recibir datos del Frontend
    const { plantilla, datos } = req.body;

    if (!plantilla || !datos) {
      return res.status(400).json({ message: "Faltan datos: 'plantilla' y 'datos' son requeridos." });
    }

    // 2. Ubicar el script de Python
    // Estamos en src/controllers, subimos 2 niveles para llegar a la raíz
    const scriptPath = path.join(__dirname, '../../main.py');
    
    // Convertir el objeto de datos a string para pasarlo por la terminal
    const datosString = JSON.stringify(datos);

    console.log(`📄 Generando documento con plantilla: ${plantilla}...`);

    // 3. Ejecutar Python
    const pythonProcess = spawn('python', [scriptPath, plantilla, datosString]);

    let rutaPdfGenerado = ''; // Aquí se acumula lo que Python imprime con print()
    let errorPython = '';     // Aquí se acumulan los errores y warnings

    // Capturar stdout (Lo que esperamos que sea la ruta del PDF o un mensaje "ERROR: ...")
    pythonProcess.stdout.on('data', (data) => {
      rutaPdfGenerado += data.toString();
    });

    // Capturar stderr (Errores del sistema o warnings de librerías)
    pythonProcess.stderr.on('data', (data) => {
      errorPython += data.toString();
    });

    // Cuando Python termina...
    pythonProcess.on('close', (code) => {
      rutaPdfGenerado = rutaPdfGenerado.trim();

      // LOGICA DE ERROR MEJORADA
      // Si el código no es 0 O si el texto que imprimió Python empieza con "ERROR"
      if (code !== 0 || rutaPdfGenerado.startsWith('ERROR')) {
        
        console.error("❌ FALLO EL SCRIPT DE PYTHON.");
        console.error("👉 Código de salida:", code);
        console.error("👉 Mensaje del Script (stdout):", rutaPdfGenerado); // AQUÍ DEBE SALIR EL ERROR REAL
        console.error("👉 Errores/Warnings (stderr):", errorPython);

        return res.status(500).json({ 
          message: 'Error al generar el documento.', 
          error_principal: rutaPdfGenerado, // El mensaje de error controlado desde main.py
          detalle_tecnico: errorPython      // El stacktrace o warnings
        });
      }

      // 4. Enviar el archivo al Frontend
      if (fs.existsSync(rutaPdfGenerado)) {
        console.log("✅ Archivo generado con éxito:", rutaPdfGenerado);
        
        res.download(rutaPdfGenerado, (err) => {
          if (err) {
            console.error("Error enviando archivo al cliente:", err);
            // No podemos responder con json aquí porque ya empezamos la descarga
          } else {
             // Opcional: Borrar archivo temporal
             // setTimeout(() => fs.unlinkSync(rutaPdfGenerado), 5000); 
          }
        });
      } else {
        console.error("❌ El script terminó bien, pero no encuentro el archivo:", rutaPdfGenerado);
        res.status(500).json({ message: 'El archivo PDF no se generó en la ruta esperada.' });
      }
    });

  } catch (error) {
    next(error);
  }
};