import os
import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

# Configuración de PassLib para el hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Función para hashear una contraseña
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Función para verificar una contraseña
def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)
  
# Función para crear un token JWT
SECRET_KEY = os.getenv("SECRET_KEY", "secreto_de_respaldo")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 # Duración del token en minutos

def create_access_token(data: dict):
  to_encode = data.copy()
  # calcular la fecha de expiración del token
  expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  to_encode.update({"exp": expire})
  
  # Firmar el token con la clave secreta y el algoritmo especificado
  encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  return encoded_jwt
