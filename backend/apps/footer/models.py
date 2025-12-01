from django.db import models
from django.utils.text import slugify

class FooterBrandInfo(models.Model):
    site_name = models.CharField(max_length=100, default="LoveDoor")
    logo = models.ImageField(
        upload_to="footer/logo/",
        blank=True,
        null=True,
        help_text="Optional: Site logo for footer",
    )
    tagline = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    copyright_text = models.CharField(
        max_length=200,
        blank=True,
        help_text="Example: © 2024 LoveDoor by Amit Chauhan",
    )
    owner_text = models.CharField(
        max_length=200,
        blank=True,
        help_text="Example: Owned by TRYBHI Company. All rights reserved.",
    )

    def __str__(self):
        return self.site_name


class SocialLink(models.Model):
    PLATFORM_CHOICES = [
        ("facebook", "Facebook"),
        ("instagram", "Instagram"),
        ("twitter", "Twitter / X"),
        ("linkedin", "LinkedIn"),
        ("youtube", "YouTube"),
        ("other", "Other"),
    ]

    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    url = models.URLField()
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.get_platform_display()} - {self.url}"


class FooterNewsletterSettings(models.Model):
    title = models.CharField(max_length=200, default="Get Exclusive Offers & Updates")
    description = models.CharField(
        max_length=300,
        blank=True,
        default="Subscribe to get product updates, discount coupons, and much more.",
    )
    placeholder = models.CharField(
        max_length=150,
        default="Enter your email",
    )
    button_text = models.CharField(
        max_length=100,
        default="Subscribe",
    )
    is_enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.title or "Footer Newsletter Settings"


class FooterColumn(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(
        max_length=150,
        unique=True,
        help_text="Internal identifier, e.g. get-to-know-us, quick-links",
    )
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.title


class FooterLink(models.Model):

    PAGE_TYPE_CHOICES = [
        # CMS Pages
        ("about", "About Us"),
        ("contact", "Contact Us"),
        ("privacy", "Privacy Policy"),
        ("terms", "Terms & Conditions"),
        ("shipping", "Shipping Policy"),
        ("returns", "Return & Refund Policy"),

        # System Pages
        ("track-order", "Track Order Page"),
        ("orders-returns", "Orders & Return Page"),
        ("sitemap", "Site Map Page"),
    ]

    AUTO_URLS = {
        # CMS Pages
        "about": "/about/",
        "contact": "/contact/",
        "privacy": "/privacy/",
        "terms": "/terms/",
        "shipping": "/shipping/",
        "returns": "/returns/",

        # System Pages
        "track-order": "/track-order",
        "orders-returns": "/orders-returns",
        "sitemap": "/sitemap",
    }

    column = models.ForeignKey(
        FooterColumn,
        related_name="links",
        on_delete=models.CASCADE,
    )

    label = models.CharField(max_length=200)

    # 🔥 SINGLE dropdown for everything
    page_type = models.CharField(
        max_length=50,
        choices=PAGE_TYPE_CHOICES,
        blank=True,
        null=True,
        help_text="Select desired page. URL will be auto-generated."
    )

    # URL (admin jo bhi likhe → overwrite ho jayega)
    url = models.CharField(
        max_length=300,
        blank=True,
        help_text="Will be overwritten automatically based on page type."
    )

    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    open_in_new_tab = models.BooleanField(default=False)

    class Meta:
        ordering = ["sort_order", "id"]

    def save(self, *args, **kwargs):
        # page_type selected → auto URL generate
        if self.page_type:
            self.url = self.AUTO_URLS.get(self.page_type, "/")
        # if nothing selected → external link
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.column.title} → {self.label}"

class PaymentMethod(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(
        upload_to="footer/payments/",
        blank=True,
        null=True,
        help_text="Upload payment logo (priority over URL)",
    )
    image_url = models.URLField(
        blank=True,
        null=True,
        help_text="Optional: Image URL (used if no upload)",
    )
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.name

    def get_final_image(self):
        # Priority: uploaded image > image_url > None
        if self.image:
            return self.image.url
        if self.image_url:
            return self.image_url
        return None



class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return self.email


class FooterAboutPage(models.Model):
    # Hero section
    title = models.CharField(max_length=200, default="About Us")
    intro_text = models.TextField(blank=True)

    # Mission
    mission_title = models.CharField(max_length=200, default="Our Mission")
    mission_description = models.TextField(blank=True)

    # Vision
    vision_title = models.CharField(max_length=200, default="Our Vision")
    vision_description = models.TextField(blank=True)

    # Stats (4 cards)
    stat_1_label = models.CharField(max_length=200, default="Happy Customers")
    stat_1_value = models.CharField(max_length=100, default="10K+")

    stat_2_label = models.CharField(max_length=200, default="Cities Served")
    stat_2_value = models.CharField(max_length=100, default="12+")

    stat_3_label = models.CharField(max_length=200, default="Products Delivered")
    stat_3_value = models.CharField(max_length=100, default="500+")

    stat_4_label = models.CharField(max_length=200, default="Customer Rating")
    stat_4_value = models.CharField(max_length=100, default="4.9★")

    # Who we are
    who_we_are = models.TextField(blank=True)

    # Why Choose Us (textarea, line break = bullet)
    why_choose_us = models.TextField(
        blank=True,
        help_text="Add each point in new line."
    )

    # CTA
    cta_text = models.CharField(max_length=200, default="Explore Our Store")
    cta_link = models.CharField(max_length=200, default="/shop", editable=False)

    is_active = models.BooleanField(default=True)

    def get_why_list(self):
        return [line.strip() for line in self.why_choose_us.split("\n") if line.strip()]

    def __str__(self):
        return "About Us Page Settings"
    
class ContactPage(models.Model):
    # Header Section
    title = models.CharField(max_length=200, default="Contact Us")
    intro_text = models.TextField(
        blank=True,
        default="Have questions or need support? Our team is here to help you."
    )

    # Contact Details
    phone_number = models.CharField(max_length=50, default="+91 98765 43210")
    email = models.EmailField(default="support@myecommerce.com")
    address = models.CharField(max_length=300, default="123 Market Road, Delhi, India")
    working_hours = models.CharField(max_length=200, default="Mon - Sat: 9:00 AM - 7:00 PM")

    # Google Map Embed URL
    map_embed_url = models.TextField(
        blank=True,
        default="https://www.google.com/maps/embed?pb=!1m18!1m12..."
    )

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "Contact Page Settings"
    
class ReturnRefundPage(models.Model):
    title = models.CharField(max_length=200, default="Return & Refund Policy")
    intro_text = models.TextField(
        blank=True,
        default=(
            "We want you to have a smooth and worry-free shopping experience. "
            "If you are not fully satisfied, you may be eligible for a return or refund."
        )
    )

    section1_title = models.CharField(max_length=200, default="1. Return Eligibility")
    section1_content = models.TextField(blank=True)

    section2_title = models.CharField(max_length=200, default="2. Refund Process")
    section2_content = models.TextField(blank=True)

    section3_title = models.CharField(max_length=200, default="3. Replacement Policy")
    section3_content = models.TextField(blank=True)

    section4_title = models.CharField(max_length=200, default="4. Non-Returnable Items")
    section4_content = models.TextField(blank=True)

    section5_title = models.CharField(max_length=200, default="5. Cancellation Policy")
    section5_content = models.TextField(blank=True)

    section6_title = models.CharField(max_length=200, default="6. How to Request a Return")
    section6_content = models.TextField(blank=True)

    footer_note = models.TextField(
        blank=True,
        default="We are committed to ensuring you have a smooth experience with us."
    )

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "Return & Refund Policy Page"

class PrivacyPolicyPage(models.Model):
    title = models.CharField(max_length=200, default="Privacy Policy")
    intro_text = models.TextField(blank=True)

    section1_title = models.CharField(max_length=200, default="1. Information We Collect")
    section1_content = models.TextField(blank=True)

    section2_title = models.CharField(max_length=200, default="2. How We Use Your Information")
    section2_content = models.TextField(blank=True)

    section3_title = models.CharField(max_length=200, default="3. Data Protection")
    section3_content = models.TextField(blank=True)

    section4_title = models.CharField(max_length=200, default="4. Third-Party Services")
    section4_content = models.TextField(blank=True)

    section5_title = models.CharField(max_length=200, default="5. Contact Us")
    section5_content = models.TextField(blank=True)

    last_updated = models.DateField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "Privacy Policy Page"


class TermsOfUsePage(models.Model):
    title = models.CharField(max_length=200, default="Terms of Use")
    intro_text = models.TextField(
        blank=True,
        default=(
            "By using this website, you agree to the terms and conditions mentioned on "
            "this page. Please read them carefully."
        )
    )

    section1_title = models.CharField(max_length=200, default="1. Use of Our Website")
    section1_content = models.TextField(
        blank=True,
        default="You agree to use this website only for lawful purposes and in a way "
                "that does not harm our brand, services, or other users."
    )

    section2_title = models.CharField(max_length=200, default="2. Account & Security")
    section2_content = models.TextField(
        blank=True,
        default="You are responsible for maintaining the confidentiality of your "
                "account details and for all activities that happen under your account."
    )

    section3_title = models.CharField(max_length=200, default="3. Orders & Payments")
    section3_content = models.TextField(
        blank=True,
        default="All orders placed on our website are subject to availability and "
                "final confirmation. Payments are processed securely through trusted partners."
    )

    section4_title = models.CharField(max_length=200, default="4. Content & Ownership")
    section4_content = models.TextField(
        blank=True,
        default="All content, logos, images, and product information on this site are "
                "owned or licensed by us and cannot be copied or used without permission."
    )

    section5_title = models.CharField(max_length=200, default="5. Changes to These Terms")
    section5_content = models.TextField(
        blank=True,
        default="We may update these Terms of Use from time to time. Continued use of "
                "the website after changes means you accept the updated terms."
    )

    footer_note = models.CharField(
        max_length=200,
        default="Last updated: 01 Jan 2025",
        blank=True
    )

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "Terms of Use Page"


class ShippingPolicyPage(models.Model):
    title = models.CharField(max_length=200, default="Shipping Policy")
    intro_text = models.TextField(
        blank=True,
        default=(
            "This page explains how your orders are packed, shipped, and delivered. "
            "Please read carefully before placing an order."
        ),
    )

    section1_title = models.CharField(max_length=200, default="1. Order Processing Time")
    section1_content = models.TextField(
        blank=True,
        default="Most orders are processed and dispatched within 1–2 business days. "
                "During high demand, processing may take slightly longer."
    )

    section2_title = models.CharField(max_length=200, default="2. Delivery Time")
    section2_content = models.TextField(
        blank=True,
        default="Delivery usually takes 3–7 business days depending on your location "
                "and courier availability."
    )

    section3_title = models.CharField(max_length=200, default="3. Shipping Charges")
    section3_content = models.TextField(
        blank=True,
        default="Shipping charges, if applicable, will be shown during checkout before "
                "you complete your order."
    )

    section4_title = models.CharField(max_length=200, default="4. Order Tracking")
    section4_content = models.TextField(
        blank=True,
        default="Once your order is shipped, you will receive a tracking link or AWB "
                "number on your email/SMS to track your shipment."
    )

    section5_title = models.CharField(max_length=200, default="5. Delayed or Lost Orders")
    section5_content = models.TextField(
        blank=True,
        default="In rare cases of delay or lost shipments, please contact our support "
                "team. We will coordinate with the courier partner and resolve the issue."
    )

    footer_note = models.CharField(
        max_length=200,
        default="Last updated: 01 Jan 2025",
        blank=True
    )

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "Shipping Policy Page"
