from django.contrib import admin
from django.shortcuts import redirect

from .models import (
    StaticHero,
    HeroSlide,
    FeaturedOffer,
    SecondaryHero,
    GiftOfferSection,
    ServiceFeature,
)


# -------------------------------------------------------
# Utility Action
# -------------------------------------------------------
def edit_selected(modeladmin, request, queryset):
    if queryset.count() == 1:
        obj = queryset.first()
        return redirect(f"{obj.id}/change/")
    else:
        modeladmin.message_user(request, "Please select exactly 1 item to edit.")


# ==========================================================
# STATIC HERO
# ==========================================================
@admin.register(StaticHero)
class StaticHeroAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_filter = ("is_active",)
    actions = [edit_selected]

    # 🔥 URL is visible but NOT editable
    readonly_fields = ("button_link",)

    fieldsets = (
        ("Main Content", {
            "fields": ("title", "subtitle"),
        }),
        ("Button", {
            "fields": ("button_text", "button_link"),
            "description": "⚠ This URL is FIXED as /shop (You cannot change it)."
        }),
        ("Image (Priority: Upload > URL)", {
            "fields": ("image", "image_url"),
        }),
        ("Status", {
            "fields": ("is_active",),
        }),
    )


# ==========================================================
# HERO SLIDES
# ==========================================================
@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("title", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    list_filter = ("is_active",)
    actions = [edit_selected]

    # 🔥 CTA link readonly
    readonly_fields = ("cta_link",)

    fieldsets = (
        ("Content", {
            "fields": ("title", "text"),
        }),
        ("CTA Settings", {
            "fields": ("cta_text", "cta_link"),
            "description": "⚠ This CTA URL is FIXED as /shop (You cannot change it)."
        }),
        ("Image (Priority: Upload > URL)", {
            "fields": ("image", "image_url"),
        }),
        ("Ordering & Status", {
            "fields": ("sort_order", "is_active"),
        }),
    )


# ==========================================================
# FEATURED OFFERS
# ==========================================================
@admin.register(FeaturedOffer)
class FeaturedOfferAdmin(admin.ModelAdmin):
    list_display = ("title", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    list_filter = ("is_active",)
    actions = [edit_selected]

    # 🔥 URL readonly
    readonly_fields = ("button_link",)

    fieldsets = (
        ("Content", {
            "fields": ("title", "text"),
        }),
        ("Button", {
            "fields": ("button_text", "button_link"),
            "description": "⚠ This URL is FIXED as /shop (You cannot change it)."
        }),
        ("Image (Priority: Upload > URL)", {
            "fields": ("image", "image_url"),
        }),
        ("Ordering & Status", {
            "fields": ("sort_order", "is_active"),
        }),
    )


# ==========================================================
# SECONDARY HERO
# ==========================================================
@admin.register(SecondaryHero)
class SecondaryHeroAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_filter = ("is_active",)
    actions = [edit_selected]

    # 🔥 URL readonly
    readonly_fields = ("button_link",)

    fieldsets = (
        ("Content", {
            "fields": ("title", "description"),
        }),
        ("Button", {
            "fields": ("button_text", "button_link"),
            "description": "⚠ This URL is FIXED as /shop (You cannot change it)."
        }),
        ("Image (Priority: Upload > URL)", {
            "fields": ("image", "image_url"),
        }),
        ("Status", {
            "fields": ("is_active",),
        }),
    )


# ==========================================================
# GIFT OFFER SECTION
# ==========================================================
@admin.register(GiftOfferSection)
class GiftOfferSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_filter = ("is_active",)
    actions = [edit_selected]

    # 🔥 URL readonly
    readonly_fields = ("button_link",)

    fieldsets = (
        ("Content", {
            "fields": ("title", "description"),
        }),
        ("Button", {
            "fields": ("button_text", "button_link"),
            "description": "⚠ This URL is FIXED as /shop (You cannot change it)."
        }),
        ("Image (Priority: Upload > URL)", {
            "fields": ("image", "image_url"),
        }),
        ("Status", {
            "fields": ("is_active",),
        }),
    )


# ==========================================================
# SERVICE FEATURES (ADVANCED DYNAMIC LINK SYSTEM)
# ==========================================================
@admin.register(ServiceFeature)
class ServiceFeatureAdmin(admin.ModelAdmin):
    list_display = ("title", "icon_key", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    list_filter = ("icon_key", "is_active")
    actions = [edit_selected]

    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "description", "icon_key")
        }),

        ("Link Settings", {
            "fields": (
                ("link_text",),
                ("link_type", "link_page", "link_url"),
            ),
            "description": (
                "<b>How it works:</b><br>"
                "- Select <b>Link Type</b> first.<br>"
                "- If CMS / System / Shop → use <b>Link Page</b> dropdown.<br>"
                "- If External URL → enter full manual link in <b>Link URL</b>.<br>"
            )
        }),

        ("Images", {
            "fields": ("image", "image_url"),
        }),

        ("Status", {
            "fields": ("sort_order", "is_active"),
        }),
    )




from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.html import format_html
from .models import BottomNavCategory


# Fallback Defaults — same as frontend
FALLBACK_DEFAULTS = [
    "Home",
    "Valentines Day Gifts",
    "Beauty",
    "Fashion",
    "Home Decor",
    "Coffee Mugs",
    "Jewelry And Accessories",
    "Wallets and Luggage",
]


@admin.register(BottomNavCategory)
class BottomNavCategoryAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "show_icon",
        "slug",
        "order",
        "is_active",
        "created_at",
        "is_default_category",   # NEW → shows if this is default or custom
    )

    list_editable = ("order", "is_active")
    readonly_fields = ("created_at", "default_preview_list")  # NEW default list in admin
    search_fields = ("name", "slug", "icon_name")
    ordering = ("order",)
    list_filter = ("is_active",)

    fieldsets = (
        ("Basic Details", {
            "fields": ("name", "slug", "icon_name")
        }),
        ("Display Settings", {
            "fields": ("order", "is_active"),
            "classes": ("collapse",)
        }),
        ("System Fields", {
            "fields": ("created_at",),
        }),
        ("Default Categories Preview", {
            "fields": ("default_preview_list",),
            "description": "These are fallback categories that always appear if admin adds less than 9. They cannot be edited.",
        }),
    )


    # ------------------------------------
    #  SHOW ICON IN LIST
    # ------------------------------------
    def show_icon(self, obj):
        return format_html(
            '<span style="display:inline-block;padding:3px 8px;background:#eee;border-radius:6px;">{}</span>',
            obj.icon_name or "auto"
        )
    show_icon.short_description = "Icon"


    # ------------------------------------
    #  SHOW IF THIS CATEGORY IS FALLBACK
    # ------------------------------------
    def is_default_category(self, obj):
        if obj.name in FALLBACK_DEFAULTS:
            return format_html("<span style='color:#d97706;font-weight:bold;'>Default</span>")
        return format_html("<span style='color:#10b981;font-weight:bold;'>Custom</span>")
    is_default_category.short_description = "Type"


    # ------------------------------------
    # DEFAULT LIST DISPLAY (READ ONLY)
    # ------------------------------------
    def default_preview_list(self, obj):
        html = "<ul style='margin:0;padding-left:20px;'>"
        for name in FALLBACK_DEFAULTS:
            html += f"<li>{name}</li>"
        html += "</ul>"
        return format_html(html)


    # ------------------------------------
    # LIMIT MAX 9 CUSTOM CATEGORIES
    # ------------------------------------
    def save_model(self, request, obj, form, change):
        if not change:
            # Do NOT count fallback categories
            custom_count = BottomNavCategory.objects.exclude(
                name__in=FALLBACK_DEFAULTS
            ).count()

            if custom_count >= 9:
                raise ValidationError("❌ You can add only 9 custom navbar categories.")

        super().save_model(request, obj, form, change)
