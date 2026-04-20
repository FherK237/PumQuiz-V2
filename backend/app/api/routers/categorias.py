from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.crud import categoria as crud_categoria
from app.schemas.categoria import CategoriaCreate, CategoriaResponse

# Con prefixo ahorra escribir "/categorias" en cada ruta
router = APIRouter(prefix="/categorias", tags=["Categorias"])

# Ruta para CREAR (POST) una nueva categoria
# response_model asegura que la respuesta se ajuste al esquema definido, incluyendo el ID generado y el conteo de trivias
@router.post("/", response_model=CategoriaResponse)
def create_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
  # Verificar si ya existe una categoría con el mismo nombre para evitar duplicados
  categoria_existente = crud_categoria.get_categoria_by_name(db, name=categoria.categoria_name)
  
  # Si ya existe, devolver un error 400: Bad Request
  if categoria_existente:
    raise HTTPException(status_code=400, detail="Ya existe una categoría con ese nombre.")
  
  # Si no existe, crear la nueva categoría y devolverla al cliente
  return crud_categoria.create_categoria(db=db, categoria=categoria)

# Ruta para OBTENER (GET) todas las categorias
# response_model=List[CategoriaResponse] indica que se devuelve una lista de categorias
@router.get("/all", response_model=List[CategoriaResponse])
def read_categorias(db: Session = Depends(get_db)):
  return crud_categoria.get_categorias(db=db)