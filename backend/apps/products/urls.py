from django.urls import path

from .views import (
    CategoryListView,
    CategoryDetailView,
    ProductListView,
    ProductDetailView,
    ProductReviewListCreateView,
)

app_name = "products"

urlpatterns = [
    # Category URLs
    path("categories/", CategoryListView.as_view(), name="category_list"),
    path("categories/<slug:slug>/", CategoryDetailView.as_view(), name="category_detail"),

    # Product URLs
    path("", ProductListView.as_view(), name="product_list"),

    # ⭐ Reviews MUST come BEFORE `<slug>`
    path("<slug:slug>/reviews/", ProductReviewListCreateView.as_view(), name="product_reviews"),
    
    # Product Detail (keep at bottom)
    path("<slug:slug>/", ProductDetailView.as_view(), name="product_detail"),
]
