from typing import List
from pathlib import Path
from fastapi.templating import Jinja2Templates
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

from apps.config import settings

templates = Jinja2Templates(directory=Path(__file__).parent.parent / "templates")

# For Gmail
# conf = ConnectionConfig(
#     MAIL_USERNAME=settings.EMAIL_HOST_USER,
#     MAIL_PASSWORD=settings.EMAIL_HOST_PASSWORD,
#     MAIL_FROM=settings.EMAIL_HOST_USER,
#     MAIL_PORT=settings.EMAIL_PORT,
#     MAIL_SERVER=settings.EMAIL_HOST,
#     # MAIL_TLS=True,
#     # MAIL_SSL=False,
#     MAIL_STARTTLS=True,
#     MAIL_SSL_TLS=False,  # Specify whether to use STARTTLS
#     TEMPLATE_FOLDER=Path(__file__).parent.parent / "templates"
#     # USE_CREDENTIALS=True
# )

# For MailHog
conf = ConnectionConfig(
    MAIL_USERNAME="",
    MAIL_PASSWORD="",
    MAIL_FROM=settings.EMAIL_HOST_USER,
    MAIL_PORT=1025,
    MAIL_SERVER="mailhog",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=False,
    TEMPLATE_FOLDER=Path(__file__).parent.parent / "templates",
)


async def send_email(
    subject: str, receiver: List[str], body: dict, template_name: str = None
) -> None:
    """
    subject: str
    body: dict // to send values to template
    template_name: str Eg. otp_template.html
    """
    try:
        message = MessageSchema(
            subject=subject,
            recipients=receiver,
            subtype="html",
            template_body=body,
            template_path=Path(__file__).parent.parent / "templates",
            template_name=template_name,
        )
        fm = FastMail(conf)
        await fm.send_message(message=message, template_name=template_name)
        return {"message": "Email sent successfully"}
    except Exception as e:
        print("Exception:::", str(e))
