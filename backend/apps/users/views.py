from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import send_otp_email
import random

from .models import Profile, Address, PasswordResetOTP
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    ProfileSerializer,
    AddressSerializer,
)










def get_tokens_for_user(user):
    """
    JWT tokens generate karta hai (access + refresh).
    """
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data

        return Response(
            {
                "user": user_data,
                "tokens": tokens,
                "message": "User registered successfully",
            },
            status=status.HTTP_201_CREATED,
        )


class CurrentUserView(APIView):
    """
    GET /api/auth/me/
    Logged-in user ka basic data
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET /api/auth/profile/
    PUT /api/auth/profile/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


class AddressListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/auth/addresses/
    POST /api/auth/addresses/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # agar new address default hai, purane default ko false kar do
        is_default = serializer.validated_data.get("is_default", False)
        if is_default:
            Address.objects.filter(user=self.request.user, is_default=True).update(
                is_default=False
            )
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/auth/addresses/<id>/
    PUT    /api/auth/addresses/<id>/
    DELETE /api/auth/addresses/<id>/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        is_default = serializer.validated_data.get("is_default", False)
        if is_default:
            Address.objects.filter(user=self.request.user, is_default=True).update(
                is_default=False
            )
        serializer.save()






class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "Email not found"}, status=404)

        otp = str(random.randint(100000, 999999))  # ALWAYS STRING

        PasswordResetOTP.objects.update_or_create(
            user=user,
            defaults={"otp": otp}
        )

        send_otp_email(email, otp)

        return Response({"message": "OTP sent to email", "email": email})

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email", "").strip()
        otp = str(request.data.get("otp", "")).strip()

        print("DEBUG RECEIVED:", email, otp)

        # get user
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "Invalid user"}, status=404)

        # Always compare OTP as STRING
        otp_record = PasswordResetOTP.objects.filter(
            user=user,
            otp=otp
        ).first()

        print("DEBUG OTP RECORD:", otp_record)

        if not otp_record:
            return Response({"error": "Invalid OTP"}, status=400)

        # expiry check
        if otp_record.is_expired():
            otp_record.delete()
            return Response({"error": "OTP expired"}, status=400)

        return Response({"message": "OTP verified"}, status=200)

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "Invalid user"}, status=404)

        user.set_password(new_password)
        user.save()

        PasswordResetOTP.objects.filter(user=user).delete()

        return Response({"message": "Password reset successful"})


class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "Email not found"}, status=404)

        otp = str(random.randint(100000, 999999))

        PasswordResetOTP.objects.update_or_create(
            user=user,
            defaults={"otp": otp}
        )

        send_otp_email(email, otp)
        return Response({"message": "OTP resent"})
