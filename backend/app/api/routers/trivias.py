from sqlalchemy import func, desc
from pydantic import BaseModel
from app.models.trivia import HistorialPartida
from app.api.deps import get_current_activate_user
from app.models.user import User

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.crud import trivia as crud_trivia
from app.schemas.trivia import TriviaCreate, TriviaResponse, TriviaJugar, RespuestaJugador, VeredictoRespuesta

router = APIRouter(prefix="/trivias", tags=["Trivias"])

class GuardarPuntosRequest(BaseModel):
  trivia_id: int
  puntos: int

#Ruta para CREAR (POST) una nueva trivia
@router.post("/", response_model=TriviaResponse)
def create_trivia(trivia: TriviaCreate, db: Session = Depends(get_db)):
  
  # Crear la trivia y devolverla al cliente
  return crud_trivia.create_trivia(db=db, trivia=trivia)

# Ruta para OBTENER (GET) las trivias disponibles de una categoría específica
@router.get("/categoria/{categoria_id}", response_model=List[TriviaResponse])
def get_trivias_por_categoria(categoria_id: int, db: Session = Depends(get_db)):        #EL NOMBRE DE LA FUNCION ES EL NOMBRE QUE SE MUESTRA EN LA DOCUMENTACION DE FASTAPI (SWAGGER)
  trivias = crud_trivia.get_trivias_by_categoria(db=db, categoria_id=categoria_id)
  if not trivias:
    raise HTTPException(status_code=404, detail="No se encontraron trivias para la categoría especificada.")
  return trivias

# Ruta para que react pida el juego sin las respuestas
@router.get("/{trivia_id}/jugar", response_model=TriviaJugar)
def jugar_trivia(trivia_id: int, db: Session = Depends(get_db)):
  trivia = crud_trivia.get_trivia(db=db, trivia_id=trivia_id)
  if not trivia:
    raise HTTPException(status_code=404, detail="Trivia no encontrada.")
  
  # Con Pydantic al devolver la trivia sin las respuestas correctas
  # se omiten automáticamente los campos que no están definidos en el esquema TriviaJugar, quita el "es_correcta" antes de enviarlo por internet
  return trivia

# Ruta del Juez
@router.post("/calificar", response_model=VeredictoRespuesta)
def calificar_respuesta(respuesta: RespuestaJugador, db: Session = Depends(get_db)):
  resultado = crud_trivia.evaluar_respuesta(db=db, pregunta_id=respuesta.pregunta_id, opcion_id=respuesta.opcion_id)
  
  if not resultado:
    raise HTTPException(status_code=400, detail="Error al evaluar la respuesta. Verifique que la pregunta tenga una opción correcta definida.")
  
  return resultado 

@router.post("/finalizar-partida")
def finalizar_partida(
  datos: GuardarPuntosRequest,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_activate_user) # Ruta protegida, solo usuarios autenticados pueden guardar puntos
):
  nueva_partida = HistorialPartida(
    user_id=current_user.user_id,
    trivia_id=datos.trivia_id,
    puntos_obtenidos=datos.puntos
  )
  db.add(nueva_partida)
  db.commit()
  return {"status": "Puntos guardados correctamente", "puntos": datos.puntos}

@router.get("/leaderboard/top")
def get_leaderboard(db: Session = Depends(get_db)):
  # Consulta que suma todos lo spuntos de cada usuario, y ordena de mayor a menor, limitando a los top 10
  query = db.query(
    User.username,
    func.sum(HistorialPartida.puntos_obtenidos).label("puntos")
  ).join(HistorialPartida).group_by(User.username).order_by(desc("puntos")).limit(10).all() 
  
  ranking = [{"username": row.username, "puntos": row.puntos} for row in query]
  return ranking