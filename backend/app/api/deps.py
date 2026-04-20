import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.security import SECRET_KEY, ALGORITHM

# Ruta para iniciar sesion
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str =Depends(oauth2_scheme), db: Session = Depends(get_db)):
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="No se pudo validar las credenciales",
    headers={"WWW-Authenticate": "Bearer"},
  )
  
  try:
    # Decodificar el token JWT
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    # Extraer id directamente
    user_id: int = payload.get("user_id")
    
    if user_id is None:
      raise credentials_exception
    
  except jwt.InvalidTokenError:
    raise credentials_exception
  
  # Buscar usuario por id
  user = db.query(User).filter(User.user_id == user_id).first()
  
  if user is None:
    raise credentials_exception
  
  return user

def get_current_activate_user(current_user: User = Depends(get_current_user)):
  return current_user
