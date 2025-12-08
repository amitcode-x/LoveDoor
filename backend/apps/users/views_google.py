from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings


def generate_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get("credential")

        if not token:
            return Response({"error": "Token missing"}, status=400)

        try:
            # token verify with Google
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), settings.GOOGLE_CLIENT_ID
            )
        except Exception as e:
            print("GOOGLE TOKEN ERROR:", e)
            return Response({"error": "Invalid Google token"}, status=400)

        email = idinfo.get("email")
        name = idinfo.get("name")

        if not email:
            return Response({"error": "Email not found"}, status=400)

        # check if user exists
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": email.split("@")[0], "first_name": name}
        )

        tokens = generate_tokens(user)

        return Response({
            "message": "Google login success",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            },
            "tokens": tokens
        })
