from fastapi import Request

def authorize_user(request: Request):
    if not request.session.get("username"):
        return False
    return request.session.get("username")