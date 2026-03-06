# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.services import auth as auth_service
from app.core.security import generate_random_token

router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    session_id = request.cookies.get("envctl-session")
    if not session_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user = auth_service.get_current_user_from_session_id(db, session_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
        
    return user

class VerifyTokenRequest(BaseModel):
    token: str

@router.post("/register", status_code=status.HTTP_202_ACCEPTED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    auth_service.register_user(db, user_in)
    return {"detail": "If the email can be registered, a verification link has been sent."}


@router.post("/verify-email")
def verify_email(req: VerifyTokenRequest, db: Session = Depends(get_db)):
    success = auth_service.verify_email_token(db, req.token)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired verification token.")
    return {"detail": "Email successfully verified."}


@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user, session_id = auth_service.authenticate_user(db, form_data.username, form_data.password)
    if not user or not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Set Session Cookie
    response.set_cookie(
        key="envctl-session",
        value=session_id,
        httponly=True,
        secure=False,    # Explicitly False for local plain HTTP
        samesite="lax",
        path="/"
    )
    
    # Set CSRF Token Cookie (Angular looks for XSRF-TOKEN by default and replicates it to header X-XSRF-TOKEN)
    csrf_token = generate_random_token()
    response.set_cookie(
        key="XSRF-TOKEN",
        value=csrf_token,
        httponly=False,  # MUST be False so Angular JS can read it
        secure=False,     # Explicitly False for local plain HTTP
        samesite="lax",
        path="/"
    )
    
    return {"detail": "Successfully logged in"}


@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    session_id = request.cookies.get("envctl-session")
    if session_id:
        auth_service.revoke_session(db, session_id)
        
    response.delete_cookie(key="envctl-session", path="/")
    response.delete_cookie(key="XSRF-TOKEN", path="/")
    return {"detail": "Successfully logged out"}


@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password():
    return {"detail": "If the email exists, a password reset link has been sent."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password():
    return {"detail": "Password successfully reset."}
