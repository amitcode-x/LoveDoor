from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile, Address
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
