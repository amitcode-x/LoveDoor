from django.contrib import admin
from .models import Order, OrderItem
from django.shortcuts import redirect



class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product_name", "product_price", "quantity", "line_total")
    


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "user",
        "status",
        "payment_method",
        "payment_status",
        "total_amount",
        "created_at",
    )
    list_filter = ("status", "payment_method", "payment_status", "created_at")
    search_fields = ("order_number", "user__username", "user__email")
    inlines = [OrderItemInline]
    



@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "product_name",
        "product_price",
        "quantity",
        "line_total",
        "created_at",
    )
    search_fields = ("product_name", "order__order_number")
