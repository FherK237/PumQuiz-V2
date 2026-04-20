from app.api.routers import categorias, trivias, users
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth
from app.database import engine, Base

# Importar los modelos para que SQLAlchemy los reconozca
from app.models import user, trivia

# crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# inicializar la aplicación FastAPI
app = FastAPI(title="PumQuiz API", description="API para la aplicación PumQuiz", version="1.0.0")

# Configurar CORS para permitir solicitudes desde el frontend
origins = [
    "http://localhost:5173", # puerto del front
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*'],
)

# incluir los routers
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(categorias.router)
app.include_router(trivias.router)


@app.get("/")
def read_root():
  return {"mensaje": "Backend de PumQuiz!"}