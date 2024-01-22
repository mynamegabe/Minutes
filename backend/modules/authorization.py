from fastapi import Request, HTTPException

def authorize_user(request: Request):
    return request.session.get("username", "")