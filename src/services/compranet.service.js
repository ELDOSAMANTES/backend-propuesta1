import path from 'path';
import { fileURLToPath } from 'url';
// 1. Importamos el driver de SQLite
import sqlite3 from 'sqlite3';

// Helper para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Definimos la ruta a tu nueva base de datos
const DB_PATH = path.join(__dirname, '../data/compranet.db');


export default class CompranetService {
  
  constructor() {
    // 3. Conectamos con la base de datos AL INICIAR
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error al conectar con la base de datos SQLite:', err.message);
      } else {
        console.log(`✅ Conexión exitosa con SQLite en: ${DB_PATH}`);
      }
    });
  }

  /**
   * Busca en la base de datos SQLite.
   * @param {string} termino - El texto a buscar
   * @param {number} limite - Cantidad de resultados a devolver
   */
  async buscarEnHistorico({ termino = '', limite = 10 }) {
    if (!termino) {
      throw new Error('Se requiere un término de búsqueda');
    }

    // 4. Preparamos la consulta SQL
    // Usamos LIKE ? y pasamos el término con '%' para buscar subcadenas.
    // Usamos LOWER() para que la búsqueda no distinga mayúsculas/minúsculas.
    
    // ! ATENCIÓN AQUÍ !
    // Reemplaza 'proveedor' y 'descripcion_contrato' si tus columnas
    // en el CSV se llamaban diferente.
    const query = `
        SELECT * FROM historico 
        WHERE LOWER(proveedor) LIKE ? OR LOWER(descripcion_contrato) LIKE ?
        LIMIT ?
    `;

    // 5. Preparamos los parámetros de forma segura
    // (Esto evita inyección SQL)
    const params = [
      `%${termino.toLowerCase()}%`,  // Para el primer ? (proveedor)
      `%${termino.toLowerCase()}%`,  // Para el segundo ? (descripcion_contrato)
      parseInt(limite, 10)          // Para el tercer ? (LIMIT)
    ];

    // 6. Ejecutamos la consulta
    // Usamos una Promesa porque 'this.db.all' usa callbacks, 
    // pero nuestro controlador usa async/await.
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          console.error('Error en la consulta SQL:', err.message);
          reject(new Error('Error al realizar la búsqueda en la base de datos.'));
        } else {
          // ¡Éxito! Devolvemos las filas (rows) encontradas
          console.log(`Búsqueda SQL finalizada. Encontrados: ${rows.length}`);
          resolve(rows);
        }
      });
    });
  }
}