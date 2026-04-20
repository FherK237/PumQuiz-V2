from sqlalchemy.orm import Session
from app.models.trivia import Trivia, Pregunta, Opcion
from app.schemas.trivia import TriviaCreate

# Funcion 1: Crear una nueva trivia en la base de datos
def create_trivia(db: Session, trivia: TriviaCreate):
  # 1. Convertir el esqueme Pydantic en un diccionario de Python
  trivia_data = trivia.model_dump()
  
  # 2. Exraer las preguntas y opciones del diccionario para crear los objetos relacionados
  preguntas_data = trivia_data.pop("preguntas")

  # 3. Crear el objeto Trivia usando el diccionario restante
  db_trivia = Trivia(**trivia_data)
  
  db_trivia.num_preguntas = len(preguntas_data) # Guardar el número de preguntas en la trivia
  
  #4. Iterar sobre cada pregunta que incluye el JSON
  for preg_data in preguntas_data:
    opciones_data = preg_data.pop("opciones") # Extraer las opciones de la pregunta
    db_pregunta = Pregunta(**preg_data) # Crear el objeto Pregunta
    
    # Iterar sobre cada opción de la pregunta
    for opc_data in opciones_data:
      db_opcion = Opcion(**opc_data) # Crear el objeto Opcion
      db_pregunta.opciones.append(db_opcion) # Agregar la opción a la pregunta
    
    db_trivia.preguntas.append(db_pregunta) # Agregar la pregunta a la trivia
  
  # 7. Guardar la nueva trivia (con sus preguntas y opciones) en la base de datos
  # SQLAlchemy se encargará de guardar todo correctamente gracias a las relaciones definidas entre los modelos
  # y por detras se ejecutarán las consultas necesarias para insertar la trivia, sus preguntas y opciones en las tablas correspondientes
  db.add(db_trivia)
  db.commit()
  db.refresh(db_trivia) # Actualizar el objeto con el ID generado por la base de datos
  return db_trivia

# Funcion 2: Obtener todas las trivias de una categoría específica
def get_trivias_by_categoria(db: Session, categoria_id: int):
  return db.query(Trivia).filter(Trivia.categoria_id == categoria_id).all()

# 3: Traer una trivia especifica para jugar
def get_trivia(db: Session, trivia_id: int):
  return db.query(Trivia).filter(Trivia.trivia_id == trivia_id).first()

# 4: Juez
def evaluar_respuesta(db: Session, pregunta_id: int, opcion_id: int):
  # Buscar en la bd la respuesta correcta
  opcion_verdadera = db.query(Opcion).filter(
    Opcion.pregunta_id == pregunta_id,
    Opcion.es_correcta == True
  ).first()
  
  if not opcion_verdadera:
    return None #Proteccion por si la pregunta no tiene una opción marcada como correcta
  
  # Comparar la opción seleccionada por el usuario con la opción correcta
  es_correcta = (opcion_verdadera.opcion_id == opcion_id)
  
  # Asignar puntos (10 o 100)
  puntos = 10 if es_correcta else 0
  
  # Devolver un veredicto con la información relevante para el frontend
  return {
    "es_correcta": es_correcta,
    "opcion_correcta_id": opcion_verdadera.opcion_id, # Devolver el ID de la opción correcta para que el frontend pueda mostrarla
    "puntos_ganados": puntos
  }