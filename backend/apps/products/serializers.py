from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductReview
from .models import ProductReview



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "banner_image",
            "is_active",
            "created_at",
            "updated_at",
            "category_image",       # ⭐ new
            "category_icon",        # ⭐ new
            "category_image_url",  # ✅ NEW
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            "id",
            "image_url",
            "alt_text",
            "is_main",
            "created_at",
        ]


# ✅ NEW: Review Serializer
class ProductReviewSerializer(serializers.ModelSerializer):
    # email ko read me na dikhana ho to:
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = ProductReview
        fields = [
            "id",
            "name",
            "email",
            "rating",
            "review_text",
            "created_at",
        ]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    effective_price = serializers.SerializerMethodField()
    show_new_badge = serializers.BooleanField(read_only=True)

    # ✅ NEW: rating fields
    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

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
            "effective_price",
            "stock",
            "is_active",
            "is_featured",
            "thumbnail",
            "average_rating",
            "total_reviews",
            "category",
            "images",
            "created_at",
            "updated_at",
            "initial_rating",
            "initial_rating_count",
             # ⭐ NEW FIELD
            "show_new_badge",
            "is_new", # ⭐ Admin + Api control 
        ]
        
    def get_show_new_badge(self, obj):
        # Admin ने TRUE किया हो → always show
        if obj.is_new:
            return True

        # Automatically new if created within last 10 days
        from datetime import timedelta
        from django.utils import timezone

        return obj.created_at >= timezone.now() - timedelta(days=10)

    def get_effective_price(self, obj):
        return obj.effective_price
