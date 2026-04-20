from fastapi import FastAPI, Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from app.database import get_db
from pydantic import BaseModel, EmailStr
from app.crud import user as crud_user
from app.core import security

router = APIRouter(tags=["Login"])

# Esquema para la solicitud de inicio de sesión
class UserLogin(BaseModel):
    user_email: EmailStr
    user_pass: str
    
@router.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
  # 1. Autenticar al usuario usando el email y la contraseña
  user = crud_user.authenticate_user(db, email=user_credentials.user_email, password=user_credentials.user_pass)
  
  if not user:
    # Error 401: Unauthorized
    raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos.")

  # 2 Fabricar el token JWT con la información del usuario
  access_token = security.create_access_token(data={"sub": user.user_email, "user_id": user.user_id})
  
  # 3. Devolver el token al cliente
  return {"access_token": access_token, "token_type": "bearer"}