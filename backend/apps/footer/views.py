from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone

from .models import (
    FooterBrandInfo,
    SocialLink,
    FooterNewsletterSettings,
    FooterColumn,
    PaymentMethod,
    NewsletterSubscriber,
    FooterAboutPage,
    ContactPage,
    ReturnRefundPage,
    PrivacyPolicyPage,
    TermsOfUsePage,
    ShippingPolicyPage,
)

from .serializers import (
    FooterConfigSerializer,
    NewsletterSubscribeSerializer,
    FooterAboutPageSerializer,
    ContactPageSerializer,
    ReturnRefundPageSerializer,
    PrivacyPolicyPageSerializer,
    TermsOfUsePageSerializer,
    ShippingPolicyPageSerializer,
)


# ======================================================
#  FOOTER CONFIG (Frontend)
# ======================================================

class FooterConfigAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        brand = FooterBrandInfo.objects.first()
        newsletter = FooterNewsletterSettings.objects.first()
        social_links = SocialLink.objects.filter(is_active=True).order_by("sort_order", "id")

        columns = (
            FooterColumn.objects.filter(is_active=True)
            .order_by("sort_order", "id")
            .prefetch_related("links")
        )

        payments = PaymentMethod.objects.filter(is_active=True).order_by("sort_order", "id")

        payload = {
            "brand": brand,
            "newsletter": newsletter,
            "social_links": social_links,
            "columns": columns,
            "payments": payments,
        }

        serializer = FooterConfigSerializer(payload)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ======================================================
#  NEWSLETTER SUBSCRIBE (Frontend)
# ======================================================

class NewsletterSubscribeAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        # 1️⃣ Email empty
        if not email:
            return Response(
                {"message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2️⃣ Duplicate email (409 conflict)
        if NewsletterSubscriber.objects.filter(email=email).exists():
            return Response(
                {"message": "This email is already subscribed."},
                status=status.HTTP_409_CONFLICT,   # ⭐ No red console error
            )

        # 3️⃣ Validate serializer
        serializer = NewsletterSubscribeSerializer(data={"email": email})
        if not serializer.is_valid():
            return Response(
                {"message": "Invalid email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 4️⃣ Save subscriber
        subscriber = serializer.save()

        # 5️⃣ Send Welcome Email (optional)
        try:
            brand = FooterBrandInfo.objects.first()
            site_name = brand.site_name if brand else "Our Store"

            ctx_user = {"email": subscriber.email, "site_name": site_name}

            text_body = render_to_string("emails/newsletter_welcome.txt", ctx_user)
            html_body = render_to_string("emails/newsletter_welcome.html", ctx_user)

            msg = EmailMultiAlternatives(
                subject=f"Welcome to {site_name} Newsletter!",
                body=text_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[subscriber.email],
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send(fail_silently=True)

        except Exception as e:
            print("Newsletter user email error:", e)

        # 6️⃣ Return success
        return Response({"message": "Subscribed successfully!"}, status=status.HTTP_201_CREATED)

# ======================================================
#  ABOUT PAGE
# ======================================================

class AboutPageAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        about = FooterAboutPage.objects.filter(is_active=True).first()
        if not about:
            return Response({"detail": "No content"}, status=200)

        serializer = FooterAboutPageSerializer(about)
        return Response(serializer.data, status=200)


# ======================================================
#  CONTACT PAGE
# ======================================================

class ContactPageAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        page = ContactPage.objects.filter(is_active=True).first()
        if not page:
            return Response({}, status=200)

        serializer = ContactPageSerializer(page)
        return Response(serializer.data, status=200)


class ContactFormAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        message = request.data.get("message")

        if not name or not email or not message:
            return Response({"error": "All fields required."}, status=400)

        admin_email = getattr(settings, "CONTACT_ADMIN_EMAIL", settings.DEFAULT_FROM_EMAIL)

        ctx = {"name": name, "email": email, "message": message}

        text_body = render_to_string("emails/contact_form.txt", ctx)
        html_body = render_to_string("emails/contact_form.html", ctx)

        msg = EmailMultiAlternatives(
            subject=f"New Contact Message from {name}",
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[admin_email],
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=True)

        return Response({"message": "Message sent!"}, status=201)


# ======================================================
#  RETURN & REFUND
# ======================================================

class ReturnRefundPageAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        page = ReturnRefundPage.objects.filter(is_active=True).first()
        if not page:
            return Response(None, status=200)

        serializer = ReturnRefundPageSerializer(page)
        return Response(serializer.data, status=200)


# ======================================================
#  PRIVACY POLICY
# ======================================================

class PrivacyPolicyPageAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        page = PrivacyPolicyPage.objects.filter(is_active=True).first()
        if not page:
            return Response(None, status=200)

        serializer = PrivacyPolicyPageSerializer(page)
        return Response(serializer.data, status=200)


# ======================================================
#  TERMS OF USE
# ======================================================

class TermsOfUsePageAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        page = TermsOfUsePage.objects.filter(is_active=True).first()
        if not page:
            page = TermsOfUsePage.objects.create(is_active=True)

        serializer = TermsOfUsePageSerializer(page)
        return Response(serializer.data, status=200)


# ======================================================
#  SHIPPING POLICY
# ======================================================

class ShippingPolicyPageAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        page = ShippingPolicyPage.objects.filter(is_active=True).first()
        if not page:
            return Response(None, status=200)

        serializer = ShippingPolicyPageSerializer(page)
        return Response(serializer.data, status=200)
