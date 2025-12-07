from django.urls import path

from .views import (
    RazorpayOrderCreateView,
    RazorpayPaymentVerifyView,
    RefundPaymentView
)

app_name = "payments"

urlpatterns = [
    path("create-order/", RazorpayOrderCreateView.as_view(), name="create_order"),
    path("verify/", RazorpayPaymentVerifyView.as_view(), name="verify_payment"),
      # ⭐ NEW Refund API
    path("refund/<int:payment_id>/", RefundPaymentView.as_view(), name="refund_payment"),
]
