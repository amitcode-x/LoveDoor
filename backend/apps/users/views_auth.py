from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

def generate_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

class LoginWithEmailOrUsername(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier")
  # can be username OR email
        password = request.data.get("password")

        if not identifier or not password:
            return Response({"detail": "Missing credentials"}, status=400)

        # 👉 Check if identifier is email
        user = None
        if "@" in identifier:
            try:
                user = User.objects.get(email=identifier)
            except User.DoesNotExist:
                return Response({"detail": "Invalid credentials"}, status=400)
        else:
            # treat as username
            try:
                user = User.objects.get(username=identifier)
            except User.DoesNotExist:
                return Response({"detail": "Invalid credentials"}, status=400)

        # Authenticate normally
        user_auth = authenticate(username=user.username, password=password)

        if not user_auth:
            return Response({"detail": "Invalid credentials"}, status=400)

        # Create tokens
        tokens = generate_tokens(user_auth)

        return Response({
            "message": "Login successful",
            "user": {
                "id": user_auth.id,
                "username": user_auth.username,
                "email": user_auth.email,
            },
            "tokens": tokens
        }, status=200)
