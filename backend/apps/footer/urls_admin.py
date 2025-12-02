# apps/footer/urls_admin.py
from django.urls import path
from .views_admin import (
    AdminFooterBrandAPIView,
    AdminNewsletterSettingsAPIView,
    AdminSocialLinksAPIView,
    AdminSocialLinkDetailAPIView,
    AdminFooterColumnsAPIView,
    AdminFooterColumnDetailAPIView,
    AdminFooterColumnLinksAPIView,
    AdminFooterLinkDetailAPIView,
    AdminFooterPaymentsAPIView,
    AdminFooterPaymentDetailAPIView,   # <-- ADD THIS
    AdminFooterAboutPageAPIView,
    AdminContactPageAPIView,
    AdminPrivacyPolicyAPIView,
    AdminTermsOfUseAPIView,
    AdminShippingPolicyAPIView
     
 
     
)

app_name = "footer_admin"

urlpatterns = [
    # BRAND
    path("brand/", AdminFooterBrandAPIView.as_view(), name="brand"),

    # NEWSLETTER
    path("newsletter/", AdminNewsletterSettingsAPIView.as_view(), name="newsletter"),

    # SOCIAL LINKS
    path("social/", AdminSocialLinksAPIView.as_view(), name="social-list-create"),
    path("social/<int:pk>/", AdminSocialLinkDetailAPIView.as_view(), name="social-update-delete"),

    # COLUMNS
    path("columns/", AdminFooterColumnsAPIView.as_view(), name="columns-list-create"),
    path("columns/<int:pk>/", AdminFooterColumnDetailAPIView.as_view(), name="column-update-delete"),

    # LINKS (by column) + single link
    path(
        "columns/<int:column_id>/links/",
        AdminFooterColumnLinksAPIView.as_view(),
        name="column-links-list-create",
    ),
    path(
        "links/<int:pk>/",
        AdminFooterLinkDetailAPIView.as_view(),
        name="link-update-delete",
    ),

    # PAYMENTS
    path("payments/", AdminFooterPaymentsAPIView.as_view(), name="payment-list-create"),
     # ⭐⭐⭐ UPDATE + DELETE FIX ⭐⭐⭐
    path("payments/<int:pk>/", AdminFooterPaymentDetailAPIView.as_view(), name="payments-update-delete"),
    
      # ⭐ ABOUT PAGE
    path("about-page/", AdminFooterAboutPageAPIView.as_view(), name="about-page"),
    
     path("contact-page/", AdminContactPageAPIView.as_view(), name="contact-page"),
  
     
         path("privacy-policy/", AdminPrivacyPolicyAPIView.as_view(), name="privacy-policy"),
    path("terms-of-use/", AdminTermsOfUseAPIView.as_view(), name="terms-of-use"),  # 👈 NEW
    
    # apps/footer/urls_admin.py

 path("shipping-policy/", AdminShippingPolicyAPIView.as_view(), name="shipping-policy"),



]
