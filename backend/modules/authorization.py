from fastapi import Request

def authorize_user(request: Request):
    if not request.session.get("user"):
        return False
    return True