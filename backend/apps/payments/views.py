from decimal import Decimal

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order
from .models import Payment
from .serializers import (
    RazorpayOrderCreateSerializer,
    RazorpayPaymentVerifySerializer,
    RazorpayOrderResponseSerializer,
)
from .utils import get_razorpay_client


# apps/payments/views.py

class RazorpayOrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = RazorpayOrderCreateSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        order = serializer.validated_data["order"]

        if order.total_amount <= 0:
            return Response(
                {"detail": "Order amount must be greater than 0."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client = get_razorpay_client()
        amount_paise = int(Decimal(order.total_amount) * 100)

        razorpay_order = client.order.create(
            {
                "amount": amount_paise,
                "currency": "INR",
                "receipt": order.order_number,
                "payment_capture": 1,
            }
        )

        # 🔥 yahan pehle se hi Payment row honi chahiye (OrderCreateView se)
        payment, created = Payment.objects.get_or_create(
            order=order,
            defaults={
                "user": request.user,
                "method": "RAZORPAY",
                "amount": order.total_amount,
                "currency": "INR",
                "status": "CREATED",
            },
        )

        # Always update Razorpay fields
        payment.method = "RAZORPAY"
        payment.razorpay_order_id = razorpay_order["id"]
        payment.amount = order.total_amount
        payment.currency = "INR"
        payment.status = "CREATED"
        payment.save()

        data = {
            "key": settings.RAZORPAY_KEY_ID,
            "amount": amount_paise,
            "currency": "INR",
            "name": "My E-commerce Store",
            "description": f"Order {order.order_number}",
            "order_id": razorpay_order["id"],
            "order_number": order.order_number,
        }

        return Response(data, status=status.HTTP_200_OK)

class RazorpayPaymentVerifyView(APIView):
    """
    POST /api/payments/verify/
    Body:
    {
      "order_number": "ORD2025...",
      "razorpay_order_id": "order_xxx",
      "razorpay_payment_id": "pay_xxx",
      "razorpay_signature": "sig_xxx"
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = RazorpayPaymentVerifySerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        order = serializer.validated_data["order"]
        payment = serializer.validated_data["payment"]

        client = get_razorpay_client()

        params_dict = {
            "razorpay_order_id": request.data.get("razorpay_order_id"),
            "razorpay_payment_id": request.data.get("razorpay_payment_id"),
            "razorpay_signature": request.data.get("razorpay_signature"),
        }

        try:
            client.utility.verify_payment_signature(params_dict)
        except Exception:
            payment.status = "FAILED"
            payment.razorpay_payment_id = params_dict["razorpay_payment_id"]
            payment.razorpay_signature = params_dict["razorpay_signature"]
            payment.save()

            order.payment_status = "FAILED"
            order.save(update_fields=["payment_status"])

            return Response(
                {"detail": "Payment verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment.status = "SUCCESS"
        payment.razorpay_payment_id = params_dict["razorpay_payment_id"]
        payment.razorpay_signature = params_dict["razorpay_signature"]
        payment.save()

        order.payment_status = "PAID"
        if order.status == "PENDING":
            order.status = "PROCESSING"
        order.payment_id = payment.razorpay_payment_id
        order.save(update_fields=["payment_status", "status", "payment_id"])

        resp = RazorpayOrderResponseSerializer(payment).data
        return Response(
            {
                "message": "Payment verified successfully.",
                "payment": resp,
            },
            status=status.HTTP_200_OK,
        )
