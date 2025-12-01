from django.contrib import admin
from .models import Category, Product, ProductImage

from django.shortcuts import redirect

def edit_selected(modeladmin, request, queryset):
    if queryset.count() == 1:
        obj = queryset.first()
        return redirect(f"{obj.id}/change/")
    else:
        modeladmin.message_user(request, "Please select exactly 1 item to edit.")


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    actions = [edit_selected]  # <-- ADD THIS


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
    
    actions = [edit_selected]  # <-- ADD THIS


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "discount_price",
        "stock",
        "is_active",
        "is_featured",
        "created_at",
    )
    list_filter = ("is_active", "is_featured", "category")
    search_fields = ("name", "description", "short_description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]
    actions = [edit_selected]  # <-- ADD THIS


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "image_url", "is_main", "created_at")
    list_filter = ("is_main",)
    actions = [edit_selected]  # <-- ADD THIS
