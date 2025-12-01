# apps/footer/serializers.py
from rest_framework import serializers
from django.conf import settings

from .models import (
    FooterBrandInfo,
    SocialLink,
    FooterNewsletterSettings,
    FooterColumn,
    FooterLink,
    PaymentMethod,
    NewsletterSubscriber,
    FooterAboutPage,
    ContactPage,
    ReturnRefundPage,
    PrivacyPolicyPage,
    TermsOfUsePage,
    ShippingPolicyPage,
)


def build_absolute_url(path: str) -> str:
    if not path:
        return None
    if path.startswith("http://") or path.startswith("https://"):
        return path
    base = getattr(settings, "BACKEND_BASE_URL", "")
    return f"{base}{path}" if base else path


class FooterBrandInfoSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = FooterBrandInfo
        fields = [
            "site_name",
            "tagline",
            "description",
            "logo",
            "copyright_text",
            "owner_text",
        ]

    def get_logo(self, obj):
        if not obj.logo:
            return None
        return build_absolute_url(obj.logo.url)


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = "__all__"


class FooterNewsletterSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterNewsletterSettings
        fields = [
            "title",
            "description",
            "placeholder",
            "button_text",
            "is_enabled",
        ]


class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterLink
        fields = [
            "id",
            "column",
            "label",
            "url",
            "page_type",
            "open_in_new_tab",
            "sort_order",
            "is_active",
        ]
        extra_kwargs = {
            # url backend me auto-generate ho jayega (page_type se)
            "url": {"required": False, "allow_blank": True},
        }


class FooterColumnSerializer(serializers.ModelSerializer):
    # links read-only list (column ke sath aa jayenge)
    links = FooterLinkSerializer(many=True, read_only=True)

    class Meta:
        model = FooterColumn
        fields = [
            "id",
            "title",
            "slug",
            "sort_order",
            "is_active",
            "links",
        ]


class PaymentMethodSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PaymentMethod
        fields = [
            "id",
            "name",
            "image",
            "image_url",
            "sort_order",
            "is_active",
        ]

    def get_image(self, obj):
        final = obj.get_final_image()
        return build_absolute_url(final) if final else None


class FooterConfigSerializer(serializers.Serializer):
    brand = FooterBrandInfoSerializer(allow_null=True)
    newsletter = FooterNewsletterSettingsSerializer(allow_null=True)
    social_links = SocialLinkSerializer(many=True)
    columns = FooterColumnSerializer(many=True)
    payments = PaymentMethodSerializer(many=True)


class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ["email"]

    def validate_email(self, value):
        value = value.strip().lower()
        if NewsletterSubscriber.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already subscribed.")
        return value


class FooterAboutPageSerializer(serializers.ModelSerializer):
    why_list = serializers.SerializerMethodField()

    class Meta:
        model = FooterAboutPage
        fields = [
            "title",
            "intro_text",
            "mission_title",
            "mission_description",
            "vision_title",
            "vision_description",
            "stat_1_label",
            "stat_1_value",
            "stat_2_label",
            "stat_2_value",
            "stat_3_label",
            "stat_3_value",
            "stat_4_label",
            "stat_4_value",
            "who_we_are",
            "why_list",
            "cta_text",
            "cta_link",
        ]

    def get_why_list(self, obj):
        return obj.get_why_list()


class ContactPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactPage
        fields = [
            "title",
            "intro_text",
            "phone_number",
            "email",
            "address",
            "working_hours",
            "map_embed_url",
        ]


class ReturnRefundPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReturnRefundPage
        fields = [
            "title",
            "intro_text",
            "section1_title", "section1_content",
            "section2_title", "section2_content",
            "section3_title", "section3_content",
            "section4_title", "section4_content",
            "section5_title", "section5_content",
            "section6_title", "section6_content",
            "footer_note",
        ]


class PrivacyPolicyPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicyPage
        fields = [
            "title",
            "intro_text",
            "section1_title", "section1_content",
            "section2_title", "section2_content",
            "section3_title", "section3_content",
            "section4_title", "section4_content",
            "section5_title", "section5_content",
            "last_updated",
        ]


class TermsOfUsePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermsOfUsePage
        fields = [
            "title",
            "intro_text",
            "section1_title", "section1_content",
            "section2_title", "section2_content",
            "section3_title", "section3_content",
            "section4_title", "section4_content",
            "section5_title", "section5_content",
            "footer_note",
        ]


class ShippingPolicyPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingPolicyPage
        fields = [
            "title",
            "intro_text",
            "section1_title", "section1_content",
            "section2_title", "section2_content",
            "section3_title", "section3_content",
            "section4_title", "section4_content",
            "section5_title", "section5_content",
            "footer_note",
        ]
