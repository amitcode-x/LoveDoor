from django.contrib.auth.models import User
from rest_framework import serializers

from apps.products.models import Category, Product
from apps.orders.models import Order, OrderItem
from apps.footer.models import FooterBrandInfo



class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "date_joined",
        ]


class AdminCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "slug"]


class AdminProductSerializer(serializers.ModelSerializer):
    category = AdminCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Category.objects.all(),
        source="category",
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "short_description",
            "description",
            "price",
            "discount_price",
            "stock",
            "is_active",
            "is_featured",
            "thumbnail",
            "category",
            "category_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]


class AdminOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "quantity",
            "line_total",
        ]
        read_only_fields = ["id", "product_name", "product_price", "line_total"]


class AdminOrderSerializer(serializers.ModelSerializer):
    user = AdminUserSerializer(read_only=True)
    items = AdminOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "user",
            "status",
            "payment_method",
            "payment_status",
            "payment_id",
            "subtotal_amount",
            "discount_amount",
            "shipping_amount",
            "total_amount",
            "shipping_full_name",
            "shipping_phone",
            "shipping_address_line1",
            "shipping_address_line2",
            "shipping_city",
            "shipping_state",
            "shipping_postal_code",
            "shipping_country",
            "notes",
            "created_at",
            "updated_at",
            "items",
        ]
        read_only_fields = [
            "id",
            "order_number",
            "user",
            "subtotal_amount",
            "discount_amount",
            "shipping_amount",
            "total_amount",
            "created_at",
            "updated_at",
        ]


class AdminOrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status", "payment_status", "payment_id"]


class AdminFooterBrandInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterBrandInfo
        fields = [
            "id",
            "site_name",
            "tagline",
            "description",
            "copyright_text",
            "owner_text",
        ]
