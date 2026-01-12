import sys
import json
import os
import pythoncom  # Necesario para Windows y Word
from docxtpl import DocxTemplate
from docx2pdf import convert
import warnings 
warnings.filterwarnings("ignore")

# --- CONFIGURACIÓN DE RUTAS ---
# Usamos rutas absolutas para evitar problemas con Node.js
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PLANTILLAS_DIR = os.path.join(BASE_DIR, 'plantillas')
OUTPUT_DIR = os.path.join(BASE_DIR, 'public', 'temp') 

# Aseguramos que exista la carpeta de salida
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def generar_documento():
    try:
        # Inicializar COM (Obligatorio para manipular Word desde otro proceso)
        pythoncom.CoInitialize()

        # Validación: Node.js debe enviarnos 2 cosas: nombre_plantilla y el JSON de datos
        if len(sys.argv) < 3:
            raise Exception("Faltan argumentos. Uso: python main.py <nombre_plantilla> <json_datos>")

        # 1. Leer argumentos
        nombre_plantilla = sys.argv[1]  # Ej: "focon01" o "focon04"
        datos_raw = sys.argv[2]         # String JSON: '{"folio": "123", ...}'
        
        try:
            contexto = json.loads(datos_raw)
        except json.JSONDecodeError:
            raise Exception("El segundo argumento no es un JSON válido.")

        # 2. Definir rutas de archivos
        ruta_plantilla_docx = os.path.join(PLANTILLAS_DIR, f"{nombre_plantilla}.docx")
        
        # Usamos el folio o un timestamp para que el nombre del archivo sea único
        id_unico = contexto.get('folio', 'generado')
        nombre_archivo_base = f"{nombre_plantilla}_{id_unico}"
        
        ruta_salida_docx = os.path.join(OUTPUT_DIR, f"{nombre_archivo_base}.docx")
        ruta_salida_pdf = os.path.join(OUTPUT_DIR, f"{nombre_archivo_base}.pdf")

        # Verificar que la plantilla exista
        if not os.path.exists(ruta_plantilla_docx):
            raise Exception(f"No se encontró la plantilla en: {ruta_plantilla_docx}")

        # 3. Renderizar el DOCX (Rellenar {{ variables }})
        doc = DocxTemplate(ruta_plantilla_docx)
        doc.render(contexto)
        doc.save(ruta_salida_docx)

        # 4. Convertir a PDF
        # Esto abre Word en segundo plano. Requiere MS Word instalado.
        convert(ruta_salida_docx, ruta_salida_pdf)

        # 5. RETORNAR LA RUTA FINAL
        # Imprimimos SOLO la ruta del PDF. Esto es lo que Node.js leerá.
        print(ruta_salida_pdf)

    except Exception as e:
        # Si algo falla, imprimimos "ERROR:" para que Node.js sepa qué pasó
        print(f"ERROR: {str(e)}")
    finally:
        # Liberar recursos de Windows
        pythoncom.CoUninitialize()

if __name__ == "__main__":
    generar_documento()