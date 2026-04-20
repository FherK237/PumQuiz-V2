from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func 
from app.database import Base

class Categoria(Base):
    __tablename__ = "categoria"
    
    categoria_id = Column(Integer, primary_key=True, index=True)
    categoria_name = Column(String, unique=True, nullable=False)
    num_trivias = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    
    # Relación de una categoría con sus trivias
    trivias = relationship("Trivia", back_populates="categoria")
    
class Trivia(Base):
    __tablename__ = "trivia"
    
    trivia_id = Column(Integer, primary_key=True, index=True)
    trivia_titulo = Column(String, nullable=False)
    dificultad = Column(String, nullable=False)
    trivia_descripcion = Column(String, nullable=True)
    imagen_url = Column(String, nullable=True)
    plays = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    num_preguntas = Column(Integer, default=0)
    
    # Llave foránea a la categoría
    categoria_id = Column(Integer, ForeignKey("categoria.categoria_id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    # Relación de una trivia con su categoría
    categoria = relationship("Categoria", back_populates="trivias")
    preguntas = relationship("Pregunta", back_populates="trivia", cascade="all, delete")
    
class Pregunta(Base):
    __tablename__ = "pregunta"
    
    pregunta_id = Column(Integer, primary_key=True, index=True)
    pregunta_texto = Column(String, nullable=False)
    
    # Llave foránea a la trivia
    trivia_id = Column(Integer, ForeignKey("trivia.trivia_id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    trivia = relationship("Trivia", back_populates="preguntas")
    opciones = relationship("Opcion", back_populates="pregunta", cascade="all, delete")
    
class Opcion(Base):
    __tablename__ = "opcion"
    
    opcion_id = Column(Integer, primary_key=True, index=True)
    opcion_texto = Column(String, nullable=False)
    es_correcta = Column(Boolean, default=False, nullable=False)
    
    # Llave foránea a la pregunta
    pregunta_id = Column(Integer, ForeignKey("pregunta.pregunta_id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    pregunta = relationship("Pregunta", back_populates="opciones")
    
class HistorialPartida(Base):
    __tablename__ = "historial_partidas"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete='CASCADE'))
    trivia_id = Column(Integer, ForeignKey("trivia.trivia_id", ondelete='CASCADE'))
    puntos_obtenidos = Column(Integer, default=0)
    fecha_jugada = Column(DateTime(timezone=True), default=func.now())
    
    usuario = relationship("User")
    trivia = relationship("Trivia")
    
    
    
    