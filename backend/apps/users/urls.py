from django.urls import path
from rest_framework_simplejwt.views import (
    # TokenObtainPairView,
    TokenRefreshView,
)

from .views_auth import LoginWithEmailOrUsername

from .views import (
    RegisterView,
    CurrentUserView,
    ProfileView,
    AddressListCreateView,
    AddressDetailView,
    ForgotPasswordView, VerifyOTPView, ResetPasswordView,ResendOTPView
)

app_name = "users"

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
     path("login/", LoginWithEmailOrUsername.as_view(), name="login"),

    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Current user
    path("me/", CurrentUserView.as_view(), name="current_user"),
    path("profile/", ProfileView.as_view(), name="profile"),

    # Addresses
    path("addresses/", AddressListCreateView.as_view(), name="address_list_create"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(), name="address_detail"),
    
path("forgot-password/", ForgotPasswordView.as_view(), name="forgot_password"),
path("verify-otp/", VerifyOTPView.as_view(), name="verify_otp"),
path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
path("resend-otp/", ResendOTPView.as_view(), name="resend_otp"),


]
