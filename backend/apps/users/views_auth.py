from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
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
        identifier = request.data.get("identifier", "").strip()
        password = request.data.get("password", "").strip()

        if not identifier or not password:
            return Response({"detail": "Missing credentials"}, status=400)

        user = None

        # ✅ EMAIL LOGIN (case-insensitive)
        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
        else:
            # ✅ USERNAME LOGIN (case-insensitive)
            user = User.objects.filter(username__iexact=identifier).first()

        if not user:
            return Response({"detail": "Invalid credentials"}, status=400)

        # ✅ Authenticate with actual username
        user_auth = authenticate(
            username=user.username,
            password=password
        )

        if not user_auth:
            return Response({"detail": "Invalid credentials"}, status=400)

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
