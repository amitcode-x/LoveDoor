from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(email, otp):
    subject = "Your Password Reset OTP"
    message = f"Your OTP for password reset is: {otp}\nIt will expire in 10 minutes."
    sender = settings.DEFAULT_FROM_EMAIL

    send_mail(subject, message, sender, [email], fail_silently=False)
