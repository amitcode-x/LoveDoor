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




class BottomNavCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BottomNavCategory
        fields = ["id", "name", "slug", "icon_name", "order", "is_active"]
