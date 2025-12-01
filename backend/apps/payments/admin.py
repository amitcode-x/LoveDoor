from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "user",
        "razorpay_order_id",
        "razorpay_payment_id",
        "status",
        "amount",
        "currency",
        "created_at",
    )
    list_filter = ("status", "currency", "created_at")
    search_fields = ("order__order_number", "user__username", "razorpay_order_id")
