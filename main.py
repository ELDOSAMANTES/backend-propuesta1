import os
from datetime import datetime
from typing import List, Dict, Any, Optional

# --- Imports de FastAPI ---
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse  # <--- Esencial para la descarga

# --- Imports de Base de Datos (SQLAlchemy) ---
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# --- Imports para procesar Word y Modelos ---
from docxtpl import DocxTemplate
from pydantic import BaseModel

app = FastAPI()

# --- Configuración de CORS ---
# Permite que tu frontend (ej. localhost:5173 o 8080) se comunique con este backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, cambia "*" por la URL de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuración de Base de Datos (Placeholder) ---
# Descomenta y configura cuando tengas tu URL de conexión
# DATABASE_URL = "mysql+mysqlconnector://usuario:password@localhost/nombre_db"
# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Modelos de Datos (Pydantic) ---
# Definimos la estructura de datos que envía el frontend
class RequisicionData(BaseModel):
    requisicion_id: int or str
    folio: str
    focon_type: str  # Ej: "focon1" (debe coincidir con el nombre del archivo en /plantillas)
    usuario_nombre: str
    partidas: List[Any]
    datos_generales: Dict[str, Any]

# --- Rutas / Endpoints ---

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API de Generación de Formatos Activa"}

@app.post("/generar-formato")
async def generar_formato(req: RequisicionData):
    try:
        # 1. Verificar/Crear carpeta de salida 'generados'
        if not os.path.exists("generados"):
            os.makedirs("generados")

        # 2. Validar ruta de la plantilla
        # El archivo debe existir en la carpeta 'plantillas' al mismo nivel que main.py
        template_path = f"./plantillas/{req.focon_type}.docx"
        
        if not os.path.exists(template_path):
            raise HTTPException(
                status_code=404, 
                detail=f"No se encontró la plantilla: {req.focon_type}.docx en {template_path}"
            )

        # 3. Cargar plantilla y preparar contexto
        doc = DocxTemplate(template_path)
        
        # Preparamos los datos para reemplazar las variables {{variable}} en el Word
        contexto = {
            "folio": req.folio,
            "fecha": datetime.now().strftime("%d/%m/%Y"),
            "usuario": req.usuario_nombre,
            "partidas": req.partidas,
            # Desempaquetamos datos_generales para que sus claves queden en el nivel raíz del contexto
            **req.datos_generales 
        }

        # 4. Renderizar y guardar temporalmente
        doc.render(contexto)
        
        output_filename = f"{req.focon_type}_{req.requisicion_id}.docx"
        output_path = f"generados/{output_filename}"
        
        doc.save(output_path)

        # 5. RETORNAR EL ARCHIVO (Modificación solicitada por Lovable)
        # Esto envía el archivo como blob al navegador
        return FileResponse(
            path=output_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"{req.focon_type}_{req.folio}.docx"
        )

    except Exception as e:
        print(f"Error detectado en generar-formato: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))