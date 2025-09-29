from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

mock_auth = APIRouter()

class VerifyTokenRequest(BaseModel):
    access_token: str

@mock_auth.post("/auth")
def authenticate(request: VerifyTokenRequest):
    """Simple authentication endpoint."""
    token = request.access_token
    if not token:
        raise HTTPException(status_code=400, detail="Missing access_token in request body")
    
    if token == "abcdefghijk":
        return { 
          'code': 200,
          'data': { 
            'user': { 
              'users_email': 'mockuser@gyssteel.com',
              'users_id': '$2y$12$82Kya1aakS8zguQtOEKDMuKm1FGDan/6znaEa0X/y2w6bYxvJZ8u',
              'users_name': 'Mock User'
            }
          },
          'expired_at': '2025-09-11 11:53:28.640',
          'message': 'Token is valid.',
          'source': 'Token Validation'
        }

    raise HTTPException(status_code=401, detail="Invalid access token")