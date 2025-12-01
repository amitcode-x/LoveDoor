from django.urls import path
from .views import FooterConfigAPIView, NewsletterSubscribeAPIView, AboutPageAPIView, ContactPageAPIView, ContactFormAPIView, ReturnRefundPageAPIView, PrivacyPolicyPageAPIView,TermsOfUsePageAPIView, ShippingPolicyPageAPIView

app_name = "footer"

urlpatterns = [
    path("", FooterConfigAPIView.as_view(), name="footer_config"),
    path("subscribe/", NewsletterSubscribeAPIView.as_view(), name="newsletter_subscribe"),
    path("about/", AboutPageAPIView.as_view(), name="about"),
    path("contact/", ContactPageAPIView.as_view(), name="contact-page"),
    path("contact/send/", ContactFormAPIView.as_view(), name="contact-send"),
    path("returns/", ReturnRefundPageAPIView.as_view(), name="return-refund"),
    path("privacy/", PrivacyPolicyPageAPIView.as_view(), name="privacy-policy"),
    path("terms/", TermsOfUsePageAPIView.as_view(), name="terms-of-use"),
    path("shipping/", ShippingPolicyPageAPIView.as_view(), name="shipping-policy"),
]

