from pydantic import BaseModel, ConfigDict
from typing import Optional

# Esquemas para categorias

# 1. Lo que se necesita para crear una categoria
class CategoriaBase(BaseModel):
    categoria_name: str

# 2. Lo que el cliente envía para crear una categoria
class CategoriaCreate(CategoriaBase):
    pass # "pass" se usa para indicar que no se agrega nada nuevo a la clase

# 3. Lo que se le responde al cliente después de crear una categoria incluyendo el ID generado
class CategoriaResponse(CategoriaBase):
    categoria_id: int
    num_trivias: Optional[int] = 0
    
    class Config:
        from_attributes = True

    # Esto permite que Pydantic lea la respuesta directamente de un modelo SQLAlchemy sin necesidad de convertirlo a un diccionario primero
    model_config = ConfigDict(from_attributes=True)