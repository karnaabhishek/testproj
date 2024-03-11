import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from apps.apis.v1.auth.routes import router as auth_router
from apps.apis.v1.users.profile_routes import router as profile_router
from apps.apis.v1.users.user_routes import router as user_router
from apps.apis.v1.users.instructor_routes import router as instructor_router
from apps.apis.v1.appointment.appointment_routes import router as appointment_router
from apps.apis.v1.appointment.instructor_availability import (
    router as instructor_availability_router,
)
from apps.apis.v1.accounts.transaction_routes import router as transaction_router
from apps.apis.v1.users.school_routes import router as school_router

from apps.config import settings
from fastapi.openapi.docs import get_swagger_ui_html


def get_application():
    app = FastAPI(
        title=settings.PROJECT_NAME,
        debug=settings.DEBUG,
        version=settings.VERSION,
        description=settings.PROJECT_DESCRIPTION,
    )

    if not os.path.exists(settings.MEDIA_PATH):
        os.makedirs(settings.MEDIA_PATH)

    media_directory = Path(settings.MEDIA_PATH)
    app.mount("/media", StaticFiles(directory=media_directory), name="media")

    origins = [
        "http://localhost:3000",
        "https://localhost:3000",
        "http://127.0.0.1:3000",
        "http://45.32.68.193",
        "http://45.32.68.193:80",
        "http://sfds.usualmarts.com",
        "https://sfds.usualmarts.com",
        "http://aa5c1df43659149af92ee394436c3084-219018504.ap-south-1.elb.amazonaws.com",
        "http://sfds.akrbio.com"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


# def initialize_routers(app: FastAPI) -> FastAPI:
#     from apps.apis.v1.auth.routes import router as auth_router
#     from apps.apis.v1.users.profile_routes import router as profile_router

#     app.include_router(auth_router, prefix="/api", tags=["auth"])
#     app.include_router(profile_router, prefix="/api", tags=["profile"])

#     return app


app = get_application()

app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(profile_router, prefix="/api", tags=["profile"])
app.include_router(user_router, prefix="/api", tags=["user"])
app.include_router(instructor_router, prefix="/api", tags=["instructor"])
app.include_router(appointment_router, prefix="/api", tags=["appointment"])
app.include_router(
    instructor_availability_router, prefix="/api", tags=["instructor_availability"]
)
app.include_router(transaction_router, prefix="/api", tags=["account"])
app.include_router(school_router, prefix="/api", tags=["school"])


@app.get("/")
async def home():
    return {"status": f"{settings.APP_ENV} is runnings"}
