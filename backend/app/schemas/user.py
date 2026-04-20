from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

#Esquema base: campos que siempre estan se usan
class UserBase(BaseModel):
    username: str
    user_email: EmailStr #Valida que sea un email válido
    
# Esquema para crear un nuevo usuario: hereda de UserBase y agrega campos necesarios para la creación
class UserCreate(UserBase):
    user_pass: str
    user_birthdate: datetime
    
# Esquema de respuesta: hereda de UserBase y agrega campos que se devuelven al cliente, como el ID y la fecha de creación
class UserResponse(UserBase):
    user_id: int
    is_verified: bool
    created_at: datetime

    # Configuración para que Pydantic pueda crear el modelo a partir de los atributos del modelo SQLAlchemy
    model_config = ConfigDict(from_attributes=True)