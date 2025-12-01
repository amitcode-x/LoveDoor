from django.db.models import Q, F, Case, When, ExpressionWrapper, FloatField
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Category, Product, ProductReview
from .serializers import CategorySerializer, ProductSerializer, ProductReviewSerializer


# --------------------------------------------
# CATEGORY LIST
# --------------------------------------------
class CategoryListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(is_active=True).order_by("name")


# --------------------------------------------
# CATEGORY DETAIL
# --------------------------------------------
class CategoryDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Category.objects.filter(is_active=True)


# --------------------------------------------
# PRODUCT LIST + FILTERS
# --------------------------------------------
class ProductListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = (
            Product.objects.filter(is_active=True, category__is_active=True)
            .select_related("category")
            .prefetch_related("images")
        )

        params = self.request.query_params

        search = params.get("search")
        category_slug = params.get("category")
        min_price = params.get("min_price")
        max_price = params.get("max_price")
        in_stock = params.get("in_stock")
        featured = params.get("featured")
        ordering = params.get("ordering")
        discount = params.get("discount")
        rating = params.get("rating")  # ⭐ New Rating Filter

        # ---------------------------------------
        # SEARCH FILTER
        # ---------------------------------------
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(short_description__icontains=search)
            )

        # ---------------------------------------
        # CATEGORY FILTER
        # ---------------------------------------
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # ---------------------------------------
        # PRICE FILTER (discount_price priority)
        # ---------------------------------------
        if min_price:
            try:
                queryset = queryset.filter(
                    Q(discount_price__gte=float(min_price))
                    | Q(discount_price=0, price__gte=float(min_price))
                )
            except ValueError:
                pass

        if max_price:
            try:
                queryset = queryset.filter(
                    Q(discount_price__lte=float(max_price))
                    | Q(discount_price=0, price__lte=float(max_price))
                )
            except ValueError:
                pass

        # ---------------------------------------
        # STOCK FILTER
        # ---------------------------------------
        if in_stock == "true":
            queryset = queryset.filter(stock__gt=0)
        elif in_stock == "false":
            queryset = queryset.filter(stock__lte=0)

        # ---------------------------------------
        # FEATURED FILTER
        # ---------------------------------------
        if featured == "true":
            queryset = queryset.filter(is_featured=True)

        # ---------------------------------------
        # DISCOUNT FILTER
        # ---------------------------------------
        if discount:
            try:
                discount_value = float(discount)
                discount_expr = ExpressionWrapper(
                    (F("price") - F("discount_price")) * 100.0 / F("price"),
                    output_field=FloatField(),
                )
                queryset = queryset.annotate(discount_percent=discount_expr)
                queryset = queryset.filter(
                    discount_percent__gte=discount_value,
                    discount_price__gt=0
                )
            except ValueError:
                pass

        # ---------------------------------------
        # ⭐ RATING FILTER (NEW)
        # rating >= selected
        # ---------------------------------------
        if rating:
            try:
                rating_value = float(rating)
                queryset = queryset.filter(average_rating__gte=rating_value)
            except:
                pass

        # ---------------------------------------
        # ORDERING (includes eff_price)
        # ---------------------------------------
        effective_price_expr = Case(
            When(discount_price__gt=0, then=F("discount_price")),
            default=F("price"),
            output_field=FloatField()
        )

        queryset = queryset.annotate(eff_price=effective_price_expr)

        allowed = [
            "name", "-name",
            "price", "-price",
            "eff_price", "-eff_price",
            "created_at", "-created_at",
        ]

        if ordering in allowed:
            queryset = queryset.order_by(ordering)

        return queryset

    # ---------------------------------------
    # PAGINATED RESPONSE + CATEGORY INFO
    # ---------------------------------------
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        category_slug = request.GET.get("category")
        category_info = None

        if category_slug:
            try:
                category_obj = Category.objects.get(slug=category_slug, is_active=True)
                category_info = CategorySerializer(category_obj).data
            except Category.DoesNotExist:
                category_info = None

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)

        response = self.get_paginated_response(serializer.data)
        response.data["category"] = category_info

        return response


# --------------------------------------------
# PRODUCT DETAIL VIEW
# --------------------------------------------
class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Product.objects.filter(
                is_active=True,
                category__is_active=True
            )
            .select_related("category")
            .prefetch_related("images", "reviews")
        )


# --------------------------------------------
# ⭐ NEW — PRODUCT REVIEW LIST + CREATE
# --------------------------------------------
class ProductReviewListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductReviewSerializer

    def get_queryset(self):
        slug = self.kwargs.get("slug")
        return ProductReview.objects.filter(
            product__slug=slug
        ).order_by("-created_at")

    def perform_create(self, serializer):
        slug = self.kwargs.get("slug")
        product = Product.objects.get(slug=slug)
        serializer.save(product=product)
