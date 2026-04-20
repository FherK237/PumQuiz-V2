from sqlalchemy.orm import Session
from app.models.trivia import Categoria
from app.schemas.categoria import CategoriaCreate

# Funcion 1: Guardar una nueva categoria en la base de datos
def create_categoria(db: Session, categoria: CategoriaCreate):
    # Crear una caja de categoria usando el esquema recibido
    db_categoria = Categoria(categoria_name=categoria.categoria_name)
      
    # Guardar la nueva categoria en la base de datos
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria) # Actualizar el objeto con el ID generado por la base de datos
    return db_categoria
  
# Funcion 2: Obtener todas las categorias con el conteo de trivias asociadas
def get_categorias(db: Session):
    # Hacer una consulta para obtener todas las categorias y contar las trivias asociadas
    return db.query(Categoria).all()
  
# Función para buscar si una categoría ya existe por su nombre
def get_categoria_by_name(db: Session, name: str):
    return db.query(Categoria).filter(Categoria.categoria_name == name).first()
    