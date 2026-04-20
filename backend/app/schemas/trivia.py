from pydantic import BaseModel, ConfigDict
from typing import Optional

class OpcionBase(BaseModel):
  opcion_texto: str
  es_correcta: bool

class OpcionCreate(OpcionBase):
  pass

class OpcionResponse(OpcionBase):
  opcion_id: int
  model_config = ConfigDict(from_attributes=True)

# ESQUEMAS DE PREGUNTAS

class PreguntaBase(BaseModel):
  pregunta_texto: str
  
class PreguntaCreate(PreguntaBase):
  # Una pregunta tiene una lista de opciones
  opciones: list[OpcionCreate]
  
class PreguntaResponse(PreguntaBase):
  pregunta_id: int
  opciones: list[OpcionResponse]

  model_config = ConfigDict(from_attributes=True)
  
# ESQUEMAS DE TRIVIAS

class TriviaBase(BaseModel):
  trivia_titulo: str
  dificultad: str
  trivia_descripcion: Optional[str] = None
  imagen_url: Optional[str] = None
  categoria_id: int
  
class TriviaCreate(TriviaBase):
  # La trivia exige una lista de preguntas para ser creada
  preguntas: list[PreguntaCreate]

class TriviaResponse(TriviaBase):
  trivia_id: int
  plays: int
  is_active: bool
  num_preguntas: int
  preguntas: list[PreguntaResponse] # Cuando se consulte una trivia, se devolverán también sus preguntas y opciones

  model_config = ConfigDict(from_attributes=True)
  
class OpcionCiega(BaseModel):
  opcion_id: int
  opcion_texto: str
  
  model_config = ConfigDict(from_attributes=True)
  
class PreguntaCiega(BaseModel):
  pregunta_id: int
  pregunta_texto: str
  opciones: list[OpcionCiega]
  
  model_config = ConfigDict(from_attributes=True)
  
class TriviaJugar(BaseModel):
  trivia_id: int
  trivia_titulo: str
  num_preguntas: int
  preguntas: list[PreguntaCiega]

  model_config = ConfigDict(from_attributes=True)
  
class RespuestaJugador(BaseModel):
  pregunta_id: int
  opcion_id: int

class VeredictoRespuesta(BaseModel):
  es_correcta: bool
  opcion_correcta_id: int
  puntos_ganados: int