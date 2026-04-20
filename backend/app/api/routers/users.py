from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.crud import user as crud_user

# Crear el router especifico para usuarios
router = APIRouter(
    prefix="/register", # todas las rutas de este router comenzarán con /users
    tags=["Registro"] # etiqueta para agrupar las rutas en la documentación
)

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar si el email ya existe
    db_user = crud_user.get_user_by_email(db, email=user.user_email)
    if db_user:
        raise HTTPException(status_code=400, detail="El correo ya ha sido registrado.")
    
    # Crear el nuevo usuario
    return crud_user.create_user(db=db, user=user)