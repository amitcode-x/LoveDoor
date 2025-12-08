from rest_framework import serializers
from django.conf import settings
from rest_framework import serializers


from .models import (
    StaticHero,
    HeroSlide,
    FeaturedOffer,
    SecondaryHero,
    GiftOfferSection,
    ServiceFeature,
    BottomNavCategory
)


# ===============================
# Static Hero
# ===============================
class StaticHeroSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = StaticHero
        fields = [
            "id",
            "title",
            "subtitle",
            "button_text",
            "button_link",
            "image",
        ]

    def get_image(self, obj):
        base = settings.BACKEND_BASE_URL
        if obj.image:
            return f"{base}{obj.image.url}"
        if obj.image_url:
            return obj.image_url
        return None


# ===============================
# Static Hero - ADMIN
# ===============================
class StaticHeroAdminSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)
    subtitle = serializers.CharField(required=False, allow_blank=True)
    button_text = serializers.CharField(required=False)
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(required=False)

    class Meta:
        model = StaticHero
        fields = [
            "id",
            "title",
            "subtitle",
            "button_text",
            "button_link",
            "image",
            "image_url",
            "is_active",
        ]
        read_only_fields = ["id", "button_link"]




# ===============================
# Hero Slides
# ===============================
class HeroSlideSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = HeroSlide
        fields = [
            "id",
            "title",
            "text",
            "cta_text",
            "cta_link",
            "image",
        ]

    def get_image(self, obj):
        base = settings.BACKEND_BASE_URL
        if obj.image:
            return f"{base}{obj.image.url}"
        if obj.image_url:
            return obj.image_url
        return None

class HeroSlideAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = [
            "id",
            "title",
            "text",
            "cta_text",
            "cta_link",
            "image",       # file upload
            "image_url",
            "sort_order",
            "is_active",
        ]
        read_only_fields = ["id", "cta_link"]


# ===============================
# Featured Offers
# ===============================
class FeaturedOfferSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = FeaturedOffer
        fields = [
            "id",
            "title",
            "text",
            "button_text",
            "button_link",
            "image",
        ]

    def get_image(self, obj):
        base = settings.BACKEND_BASE_URL
        if obj.image:
            return f"{base}{obj.image.url}"
        if obj.image_url:
            return obj.image_url
        return None


# ===============================
# Featured Offers - ADMIN
# ===============================
class FeaturedOfferAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeaturedOffer
        fields = [
            "id",
            "title",
            "text",
            "button_text",
            "button_link",
            "image",       # ImageField (file upload)
            "image_url",
            "sort_order",
            "is_active",
        ]
        read_only_fields = ["id", "button_link"]


# ===============================
# Secondary Hero (no image here)
# ===============================
class SecondaryHeroSerializer(serializers.ModelSerializer):
    final_image = serializers.SerializerMethodField()

    class Meta:
        model = SecondaryHero
        fields = [
            "id",
            "title",
            "description",
            "button_text",
            "button_link",
            "final_image"
        ]

    def get_final_image(self, obj):
        base = settings.BACKEND_BASE_URL

        # 1st priority: uploaded image
        if obj.image:
            return f"{base}{obj.image.url}"

        # 2nd: URL field
        if obj.image_url:
            return obj.image_url

        return None

# ===============================
# Secondary Hero - ADMIN
# ===============================
class SecondaryHeroAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecondaryHero
        fields = [
            "id",
            "title",
            "description",
            "button_text",
            "button_link",
            "image",        # file upload
            "image_url",
            "is_active",
        ]
        read_only_fields = ["id", "button_link"]


# ===============================
# Gift Offer Section
# ===============================
class GiftOfferSectionSerializer(serializers.ModelSerializer):
    final_image = serializers.SerializerMethodField()

    class Meta:
        model = GiftOfferSection
        fields = [
            "id",
            "title",
            "description",
            "button_text",
            "button_link",
            "final_image",
        ]

    def get_final_image(self, obj):
        base = settings.BACKEND_BASE_URL

        # 1st: uploaded image
        if obj.image:
            url = obj.image.url
            return f"{base}{url}" if not url.startswith("http") else url

        # 2nd: URL field
        if obj.image_url:
            return obj.image_url

        return None


# ===============================
# Gift Offer Section - ADMIN
# ===============================
class GiftOfferAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftOfferSection
        fields = [
            "id",
            "title",
            "description",
            "button_text",
            "button_link",
            "image",
            "image_url",
            "is_active",
        ]
        read_only_fields = ["id", "button_link"]

# ===============================
# Service Features (no images)
# ===============================
class ServiceFeatureSerializer(serializers.ModelSerializer):
    final_image = serializers.SerializerMethodField()

    class Meta:
        model = ServiceFeature
        fields = [
            "id",
            "icon_key",
            "title",
            "description",
            "link_text",
            "link_url",
            "final_image"
        ]

    def get_final_image(self, obj):
        base = settings.BACKEND_BASE_URL
        img = obj.get_display_image()

        if not img:
            return None

        if img.startswith("http"):
            return img

        return f"{base}{img}"


class ServiceFeatureAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFeature
        fields = [
            "id",
            "icon_key",
            "title",
            "description",
            "link_text",
            "link_type",
            "link_page",
            "link_url",
            "sort_order",
            "is_active",
            "image",
            "image_url",
        ]
        read_only_fields = ["id"]



class BottomNavCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BottomNavCategory
        fields = ["id", "name", "slug", "icon_name", "order", "is_active"]
