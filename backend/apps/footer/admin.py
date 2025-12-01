from django.contrib import admin
from django.shortcuts import redirect
from django.contrib import admin
from django.utils.html import format_html



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

# ---------- COMMON ACTION (Edit Selected Item) ----------
def edit_selected(modeladmin, request, queryset):
    if queryset.count() == 1:
        obj = queryset.first()
        return redirect(f"{obj.id}/change/")
    else:
        modeladmin.message_user(request, "Please select exactly 1 item to edit.")


# ================================
#        BRAND INFO ADMIN
# ================================
@admin.register(FooterBrandInfo)
class FooterBrandInfoAdmin(admin.ModelAdmin):
    list_display = ("site_name", "tagline")
    actions = [edit_selected]
    fieldsets = (
        ("Brand Identity", {
            "fields": ("site_name", "logo", "tagline", "description"),
            "description": "Website footer brand details (Logo, Site Name, Tagline)"
        }),
        ("Legal Information", {
            "fields": ("copyright_text", "owner_text"),
            "description": "© Copyright & Ownership text"
        }),
    )


# ================================
#        SOCIAL LINKS ADMIN
# ================================
@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ("platform", "url", "sort_order", "is_active")
    list_filter = ("platform", "is_active")
    search_fields = ("url",)
    ordering = ("sort_order", "id")
    actions = [edit_selected]
    fieldsets = (
        ("Social Media Link", {
            "fields": ("platform", "url"),
            "description": "Add Facebook, Instagram, Twitter, LinkedIn, YouTube links"
        }),
        ("Display Settings", {
            "fields": ("sort_order", "is_active"),
        }),
    )


# ================================
#    NEWSLETTER SETTINGS ADMIN
# ================================
@admin.register(FooterNewsletterSettings)
class FooterNewsletterSettingsAdmin(admin.ModelAdmin):
    list_display = ("title", "is_enabled")
    actions = [edit_selected]
    fieldsets = (
        ("Newsletter Content", {
            "fields": ("title", "description", "placeholder", "button_text"),
            "description": "Newsletter title, description & button"
        }),
        ("Status", {
            "fields": ("is_enabled",),
        }),
    )


# ================================
#        FOOTER COLUMNS ADMIN
# ================================
class FooterLinkInline(admin.TabularInline):
    model = FooterLink
    extra = 1


@admin.register(FooterColumn)
class FooterColumnAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "sort_order", "is_active")
    list_filter = ("is_active",)
    prepopulated_fields = {"slug": ("title",)}
    inlines = [FooterLinkInline]
    actions = [edit_selected]
    fieldsets = (
        ("Column Info", {
            "fields": ("title", "slug"),
            "description": "Footer column title & slug"
        }),
        ("Display Settings", {
            "fields": ("sort_order", "is_active"),
        }),
    )


# ================================
#        PAYMENT METHODS ADMIN
# ================================
@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ("name", "sort_order", "is_active")
    list_filter = ("is_active",)
    actions = [edit_selected]
    fieldsets = (
        ("Payment Method", {
            "fields": ("name",),
            "description": "Payment method like UPI, Visa, MasterCard, PayTM"
        }),
        ("Image Settings", {
            "fields": ("image", "image_url"),
            "description": "Upload image OR provide image URL"
        }),
        ("Display Options", {
            "fields": ("sort_order", "is_active"),
        }),
    )


# ================================
#        ABOUT PAGE ADMIN
# ================================
@admin.register(FooterAboutPage)
class FooterAboutPageAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_editable = ("is_active",)
    actions = [edit_selected]
    fieldsets = (
        ("Header Section", {
            "fields": ("title", "intro_text"),
        }),
        ("Mission Section", {
            "fields": ("mission_title", "mission_description"),
        }),
        ("Vision Section", {
            "fields": ("vision_title", "vision_description"),
        }),
        ("Stats Section", {
            "fields": (
                "stat_1_label", "stat_1_value",
                "stat_2_label", "stat_2_value",
                "stat_3_label", "stat_3_value",
                "stat_4_label", "stat_4_value",
            ),
            "description": "4 Stats (value + label)"
        }),
        ("Who We Are", {
            "fields": ("who_we_are",),
        }),
        ("Why Choose Us (List Points)", {
            "fields": ("why_choose_us",),
            "description": "Each new line will become a bullet point"
        }),
        ("CTA Button", {
    "fields": ("cta_text",),
    "description": "CTA always links to /shop"
}),

        ("Status", {
            "fields": ("is_active",),
        }),
    )
    


# ================================
#        CONTACT PAGE ADMIN
# ================================
@admin.register(ContactPage)
class ContactPageAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_editable = ("is_active",)
    actions = [edit_selected]
    fieldsets = (
        ("Header", {
            "fields": ("title", "intro_text"),
        }),
        ("Contact Info", {
            "fields": ("phone_number", "email", "address", "working_hours"),
        }),
        ("Location Map", {
            "fields": ("map_embed_url",),
        }),
        ("Status", {
            "fields": ("is_active",),
        }),
    )
    


# ================================
#     RETURN & REFUND PAGE ADMIN
# ================================
@admin.register(ReturnRefundPage)
class ReturnRefundPageAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_editable = ("is_active",)
    actions = [edit_selected]

    fieldsets = (
        ("Page Header", {
            "fields": ("title", "intro_text"),
        }),
        ("Section 1: Return Eligibility", {
            "fields": ("section1_title", "section1_content"),
        }),
        ("Section 2: Refund Process", {
            "fields": ("section2_title", "section2_content"),
        }),
        ("Section 3: Replacement Policy", {
            "fields": ("section3_title", "section3_content"),
        }),
        ("Section 4: Non-Returnable Items", {
            "fields": ("section4_title", "section4_content"),
        }),
        ("Section 5: Cancellation Policy", {
            "fields": ("section5_title", "section5_content"),
        }),
        ("Section 6: How to Request a Return", {
            "fields": ("section6_title", "section6_content"),
        }),
        ("Footer Note", {
            "fields": ("footer_note",),
        }),
        ("Status", {
            "fields": ("is_active",),
        }),
    )





@admin.register(PrivacyPolicyPage)
class PrivacyPolicyPageAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "last_updated", "preview")
    list_editable = ("is_active",)
    search_fields = ("title", "intro_text")
    list_filter = ("is_active",)
    readonly_fields = ("last_updated",)
    actions = [edit_selected]

    fieldsets = (
        ("Page Header", {
            "fields": ("title", "intro_text", "last_updated"),
            "description": "Main heading + introduction text for Privacy Policy page."
        }),

        ("Section 1 — Information We Collect", {
            "classes": ("collapse",),
            "fields": ("section1_title", "section1_content"),
        }),

        ("Section 2 — How We Use Your Information", {
            "classes": ("collapse",),
            "fields": ("section2_title", "section2_content"),
        }),

        ("Section 3 — Data Protection", {
            "classes": ("collapse",),
            "fields": ("section3_title", "section3_content"),
        }),

        ("Section 4 — Third-Party Services", {
            "classes": ("collapse",),
            "fields": ("section4_title", "section4_content"),
        }),

        ("Section 5 — Contact Section", {
            "classes": ("collapse",),
            "fields": ("section5_title", "section5_content"),
        }),

        ("Settings", {
            "fields": ("is_active",),
            "description": "Only *one* Privacy Policy entry should be active."
        }),
    )

    def preview(self, obj):
        return format_html("<span style='color: #04AA6D;'>Preview →</span>")

    preview.short_description = "Live Preview"


    # ✔ Ensure only one active page exists
    def save_model(self, request, obj, form, change):
        if obj.is_active:
            PrivacyPolicyPage.objects.exclude(id=obj.id).update(is_active=False)
        super().save_model(request, obj, form, change)
    

@admin.register(TermsOfUsePage)
class TermsOfUsePageAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_editable = ("is_active",)
    search_fields = ("title", "intro_text")
    list_filter = ("is_active",)

    fieldsets = (
        ("Page Header", {
            "fields": ("title", "intro_text"),
        }),

        ("Section 1 — Use of Website", {
            "classes": ("collapse",),
            "fields": ("section1_title", "section1_content"),
        }),

        ("Section 2 — Account & Security", {
            "classes": ("collapse",),
            "fields": ("section2_title", "section2_content"),
        }),

        ("Section 3 — Orders & Payments", {
            "classes": ("collapse",),
            "fields": ("section3_title", "section3_content"),
        }),

        ("Section 4 — Content & Ownership", {
            "classes": ("collapse",),
            "fields": ("section4_title", "section4_content"),
        }),

        ("Section 5 — Changes to These Terms", {
            "classes": ("collapse",),
            "fields": ("section5_title", "section5_content"),
        }),

        ("Footer Note", {
            "fields": ("footer_note",),
        }),

        ("Settings", {
            "fields": ("is_active",),
        }),
    )

    # ensure only one active entry
    def save_model(self, request, obj, form, change):
        if obj.is_active:
            TermsOfUsePage.objects.exclude(id=obj.id).update(is_active=False)
        super().save_model(request, obj, form, change)


@admin.register(ShippingPolicyPage)
class ShippingPolicyPageAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_editable = ("is_active",)
    search_fields = ("title", "intro_text")
    list_filter = ("is_active",)

    fieldsets = (
        ("Page Header", {
            "fields": ("title", "intro_text"),
        }),

        ("Section 1 — Order Processing Time", {
            "classes": ("collapse",),
            "fields": ("section1_title", "section1_content"),
        }),

        ("Section 2 — Delivery Time", {
            "classes": ("collapse",),
            "fields": ("section2_title", "section2_content"),
        }),

        ("Section 3 — Shipping Charges", {
            "classes": ("collapse",),
            "fields": ("section3_title", "section3_content"),
        }),

        ("Section 4 — Order Tracking", {
            "classes": ("collapse",),
            "fields": ("section4_title", "section4_content"),
        }),

        ("Section 5 — Delayed or Lost Orders", {
            "classes": ("collapse",),
            "fields": ("section5_title", "section5_content"),
        }),

        ("Footer Note", {
            "fields": ("footer_note",),
        }),

        ("Settings", {
            "fields": ("is_active",),
        }),
    )

    # ensure only one active entry
    def save_model(self, request, obj, form, change):
        if obj.is_active:
            ShippingPolicyPage.objects.exclude(id=obj.id).update(is_active=False)
        super().save_model(request, obj, form, change)
