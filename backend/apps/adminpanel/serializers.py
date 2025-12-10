from django.contrib.auth.models import User
from rest_framework import serializers

from apps.products.models import Category, Product
from apps.orders.models import Order, OrderItem
from apps.footer.models import FooterBrandInfo


class AdminUserOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "status",
            "total_amount",
            "created_at",
        ]



class AdminUserSerializer(serializers.ModelSerializer):
    orders = AdminUserOrderSerializer(many=True, read_only=True)

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
            "orders",
        ]

        



class AdminCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "banner_image",
            "is_active",
            "category_image",
            "category_icon",
            "category_image_url",
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
            "is_new",
            "thumbnail",
            "category",
            "category_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]


class AdminOrderItemSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "quantity",
            "line_total",
            "product_image",
        ]
        read_only_fields = ["id", "product_name", "product_price", "line_total"]

    def get_product_image(self, obj):
        try:
            thumb = obj.product.thumbnail

            # Case 1: ImageField → has .url
            if hasattr(thumb, "url"):
                request = self.context.get("request")
                url = thumb.url
                return request.build_absolute_uri(url) if request else url

            # Case 2: URL string stored in DB
            if isinstance(thumb, str) and thumb.startswith("http"):
                return thumb

            return None
        except:
            return None


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


from django.contrib.auth.models import User
from rest_framework import serializers

# ... yaha tumhare existing serializers already honge
# AdminUserOrderSerializer, AdminUserSerializer, AdminCategorySerializer, etc.
# Unko bilkul mat chhedna, sirf neeche ye naya code add karo.

class AdminProfileSerializer(serializers.ModelSerializer):
    """
    Admin ka khud ka profile (current logged-in user).
    Username change nahi karne denge (read_only).
    """
    username = serializers.CharField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    last_login = serializers.DateTimeField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_superuser",
            "last_login",
            "date_joined",
        ]


class AdminChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user
        old_password = attrs.get("old_password")
        new_password = attrs.get("new_password")
        confirm_password = attrs.get("confirm_password")

        if not user.check_password(old_password):
            raise serializers.ValidationError(
                {"old_password": "Old password is incorrect."}
            )

        if new_password != confirm_password:
            raise serializers.ValidationError(
                {"confirm_password": "New password and confirm password do not match."}
            )

        if len(new_password) < 6:
            raise serializers.ValidationError(
                {"new_password": "Password must be at least 6 characters."}
            )

        return attrs
