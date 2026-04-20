from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.user_email == email).first()

def create_user(db: Session, user: UserCreate):
    # Hashear la contraseña antes de guardarla en la base de datos
    hashed_password = get_password_hash(user.user_pass)
  
    db_user = User(
      username=user.username,
      user_email=user.user_email,
      user_pass=hashed_password,
      user_birthdate=user.user_birthdate
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
  
def authenticate_user(db: Session, email: str, password: str):
  # 1. Buscar el usuario por email
  user = get_user_by_email(db, email)
  if not user:
    return False
  # 2. Verificar la contraseña
  if not verify_password(password, user.user_pass):
    return False
  # 3. Si el usuario existe y la contraseña es correcta, devolver el usuario
  return user