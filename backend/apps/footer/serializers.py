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
            "image",        # final computed image
            "image_url",    # raw URL input allowed
            "sort_order",
            "is_active",
        ]

    def get_image(self, obj):
        """
        Final image priority:
        1) uploaded file
        2) image_url provided by admin
        """
        # 1) File image
        if obj.image:
            return build_absolute_url(obj.image.url)

        # 2) URL provided manually
        if obj.image_url:
            return obj.image_url

        return None



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

        # Duplicate email check
        if NewsletterSubscriber.objects.filter(email=value).exists():
            # Message shorter aur readable rakhenge
            raise serializers.ValidationError(
                "This email is already subscribed."
            )

        return value




class FooterAboutPageSerializer(serializers.ModelSerializer):

    # allow_blank + required False for all user-editable fields
    stat_1_label = serializers.CharField(allow_blank=True, required=False)
    stat_1_value = serializers.CharField(allow_blank=True, required=False)
    stat_2_label = serializers.CharField(allow_blank=True, required=False)
    stat_2_value = serializers.CharField(allow_blank=True, required=False)
    stat_3_label = serializers.CharField(allow_blank=True, required=False)
    stat_3_value = serializers.CharField(allow_blank=True, required=False)
    stat_4_label = serializers.CharField(allow_blank=True, required=False)
    stat_4_value = serializers.CharField(allow_blank=True, required=False)

    title = serializers.CharField(allow_blank=True, required=False)
    intro_text = serializers.CharField(allow_blank=True, required=False)
    mission_title = serializers.CharField(allow_blank=True, required=False)
    mission_description = serializers.CharField(allow_blank=True, required=False)
    vision_title = serializers.CharField(allow_blank=True, required=False)
    vision_description = serializers.CharField(allow_blank=True, required=False)
    who_we_are = serializers.CharField(allow_blank=True, required=False)
    why_choose_us = serializers.CharField(allow_blank=True, required=False)
    cta_text = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = FooterAboutPage
        fields = "__all__"

    def validate(self, data):
        # Backend defaults
        defaults = {
            "title": "About Us",
            "mission_title": "Our Mission",
            "vision_title": "Our Vision",
            "stat_1_label": "Happy Customers",
            "stat_1_value": "10K+",
            "stat_2_label": "Cities Served",
            "stat_2_value": "12+",
            "stat_3_label": "Products Delivered",
            "stat_3_value": "500+",
            "stat_4_label": "Customer Rating",
            "stat_4_value": "4.9★",
            "cta_text": "Explore Our Store",
        }

        for field, default in defaults.items():
            val = data.get(field)
            if val is None or str(val).strip() == "":
                data[field] = default

        return data

class ContactPageSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    email = serializers.EmailField(allow_blank=True, allow_null=True, required=False)
    address = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    working_hours = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    map_embed_url = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    intro_text = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    title = serializers.CharField(allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = ContactPage
        fields = [
            "id",
            "title",
            "intro_text",
            "phone_number",
            "email",
            "address",
            "working_hours",
            "map_embed_url",
            "is_active",
        ]

    def validate(self, data):
        defaults = {
            "title": "Contact Us",
            "intro_text": "Have questions or need support? Our team is here to help you.",
            "phone_number": "+91 98765 43210",
            "email": "support@myecommerce.com",
            "address": "123 Market Road, Delhi, India",
            "working_hours": "Mon - Sat: 9:00 AM - 7:00 PM",
            "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12...",
        }

        # blank/null → default
        for field, default in defaults.items():
            val = data.get(field)
            if val is None or str(val).strip() == "":
                data[field] = default

        return data


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
            "id",
            "title",
            "intro_text",
            "section1_title", "section1_content",
            "section2_title", "section2_content",
            "section3_title", "section3_content",
            "section4_title", "section4_content",
            "section5_title", "section5_content",
            "last_updated",
            "is_active",
        ]

    def validate(self, data):
        defaults = {
            "intro_text": "",
            "section1_content": "",
            "section2_content": "",
            "section3_content": "",
            "section4_content": "",
            "section5_content": "",
        }

        for field, default in defaults.items():
            val = data.get(field)

            # convert null → default
            if val is None:
                data[field] = default

        return data


class TermsOfUsePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermsOfUsePage
        fields = [
            "id",
            "title",
            "intro_text",
            "section1_title", "section1_content",
            "section2_title", "section2_content",
            "section3_title", "section3_content",
            "section4_title", "section4_content",
            "section5_title", "section5_content",
            "footer_note",
            "is_active",
        ]

    def validate(self, data):
        defaults = {
            "title": "Terms of Use",
            "intro_text": (
                "By using this website, you agree to the terms and conditions mentioned "
                "on this page. Please read them carefully."
            ),

            "section1_title": "1. Use of Our Website",
            "section1_content": (
                "You agree to use this website only for lawful purposes and in a way "
                "that does not harm our brand, services, or other users."
            ),

            "section2_title": "2. Account & Security",
            "section2_content": (
                "You are responsible for maintaining the confidentiality of your "
                "account details and for all activities that happen under your account."
            ),

            "section3_title": "3. Orders & Payments",
            "section3_content": (
                "All orders placed on our website are subject to availability and "
                "final confirmation. Payments are processed securely through trusted partners."
            ),

            "section4_title": "4. Content & Ownership",
            "section4_content": (
                "All content, logos, images, and product information on this site are "
                "owned or licensed by us and cannot be copied or used without permission."
            ),

            "section5_title": "5. Changes to These Terms",
            "section5_content": (
                "We may update these Terms of Use from time to time. Continued use of "
                "the website after changes means you accept the updated terms."
            ),

            "footer_note": "Last updated: 01 Jan 2025",
        }

        for field, default in defaults.items():
            if field in data:
                val = data.get(field)
                if val is None or str(val).strip() == "":
                    data[field] = default

        return data
    
class ShippingPolicyPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingPolicyPage
        fields = "__all__"

    def validate(self, data):
        # NULL allowed → no restriction
        return data
