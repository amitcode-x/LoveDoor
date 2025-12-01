from rest_framework import serializers

from apps.orders.models import Order
from .models import Payment


class RazorpayOrderCreateSerializer(serializers.Serializer):
    """
    frontend se jab Razorpay order create karna hai:
    {
      "order_number": "ORD20251126001"
    }
    Amount hum Order.total_amount se lenge.
    """
    order_number = serializers.CharField(max_length=30)

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user
        order_number = attrs["order_number"]

        try:
            order = Order.objects.get(order_number=order_number, user=user)
        except Order.DoesNotExist:
            raise serializers.ValidationError({"order_number": "Invalid order."})

        if order.payment_status == "PAID":
            raise serializers.ValidationError(
                {"order_number": "This order is already paid."}
            )

        attrs["order"] = order
        return attrs


class RazorpayOrderResponseSerializer(serializers.ModelSerializer):
    """
    Payment model ka simple serializer (agar zarurat ho UI me).
    """
    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
            "amount",
            "currency",
            "status",
            "created_at",
            "updated_at",
        ]


class RazorpayPaymentVerifySerializer(serializers.Serializer):
    """
    Razorpay payment success ke baad frontend se ye data aayega:
    {
      "order_number": "ORD2025...",
      "razorpay_order_id": "order_xxx",
      "razorpay_payment_id": "pay_xxx",
      "razorpay_signature": "signature_xxx"
    }
    """
    order_number = serializers.CharField(max_length=30)
    razorpay_order_id = serializers.CharField(max_length=100)
    razorpay_payment_id = serializers.CharField(max_length=100)
    razorpay_signature = serializers.CharField(max_length=255)

    def validate(self, attrs):
        from apps.orders.models import Order
        from .models import Payment

        request = self.context["request"]
        user = request.user

        order_number = attrs["order_number"]
        razorpay_order_id = attrs["razorpay_order_id"]

        try:
            order = Order.objects.get(order_number=order_number, user=user)
        except Order.DoesNotExist:
            raise serializers.ValidationError({"order_number": "Invalid order."})

        try:
            payment = Payment.objects.get(order=order, razorpay_order_id=razorpay_order_id)
        except Payment.DoesNotExist:
            raise serializers.ValidationError(
                {"razorpay_order_id": "Payment record not found for this order."}
            )

        attrs["order"] = order
        attrs["payment"] = payment
        return attrs
