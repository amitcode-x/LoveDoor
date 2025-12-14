from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken


# -------------------------------------------------
# TOKEN GENERATOR
# -------------------------------------------------
def generate_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# -------------------------------------------------
# LOGIN WITH EMAIL OR USERNAME
# -------------------------------------------------
class LoginWithEmailOrUsername(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier", "")
        password = request.data.get("password", "")

        # DEBUG LOGS (safe to keep)
        print("🔍 RAW IDENTIFIER:", repr(identifier))
        print("🔍 RAW PASSWORD:", repr(password))

        identifier = identifier.strip()
        password = password.strip()

        print("🔍 STRIPPED IDENTIFIER:", repr(identifier))
        print("🔍 STRIPPED PASSWORD:", repr(password))

        if not identifier or not password:
            return Response(
                {"detail": "Missing credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = None

        # -----------------------------
        # EMAIL LOGIN (case-insensitive)
        # -----------------------------
        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            print("📧 EMAIL LOGIN USER FOUND:", user)
        else:
            # -----------------------------
            # USERNAME LOGIN (case-insensitive)
            # -----------------------------
            user = User.objects.filter(username__iexact=identifier).first()
            print("👤 USERNAME LOGIN USER FOUND:", user)

        if not user:
            print("❌ USER NOT FOUND")
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------
        # AUTHENTICATE WITH REAL USERNAME
        # -----------------------------
        user_auth = authenticate(
            username=user.username,
            password=password
        )

        print("🔐 AUTH RESULT:", user_auth)

        if not user_auth:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        tokens = generate_tokens(user_auth)

        return Response(
            {
                "message": "Login successful",
                "user": {
                    "id": user_auth.id,
                    "username": user_auth.username,
                    "email": user_auth.email,
                    "is_staff": user_auth.is_staff,
                },
                "tokens": tokens,
            },
            status=status.HTTP_200_OK
        )
