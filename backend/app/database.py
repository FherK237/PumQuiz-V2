import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pathlib import Path

# --- SECCIÓN DE DEBUG PARA EL .ENV ---
# Esto calcula la ruta absoluta hacia tu carpeta 'backend'
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)

# Obtenemos la variable
DATABASE_URL = os.getenv("DATABASE_URL")


if not DATABASE_URL:
    raise ValueError("CRÍTICO: No se encontró DATABASE_URL. Revisa que el archivo .env exista en la ruta de arriba y que el texto dentro esté correcto.")

# --- FIN SECCIÓN DE DEBUG ---

# crear el motor de la base de datos
engine = create_engine(DATABASE_URL)

# crear la base declarativa
Base = declarative_base()

# crear una fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# función para obtener una sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()