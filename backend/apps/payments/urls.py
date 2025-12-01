from django.urls import path

from .views import (
    RazorpayOrderCreateView,
    RazorpayPaymentVerifyView,
)

app_name = "payments"

urlpatterns = [
    path("create-order/", RazorpayOrderCreateView.as_view(), name="create_order"),
    path("verify/", RazorpayPaymentVerifyView.as_view(), name="verify_payment"),
]
