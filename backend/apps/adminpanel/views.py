from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import Category, Product
from apps.orders.models import Order
from .serializers import (
    AdminUserSerializer,
    AdminCategorySerializer,
    AdminProductSerializer,
    AdminOrderSerializer,
    AdminOrderStatusUpdateSerializer,
    AdminFooterBrandInfoSerializer,
    
    
)
from .permissions import IsAdminOrStaff

from apps.footer.models import FooterBrandInfo



# -----------------------
# Dashboard / Stats
# -----------------------
class AdminDashboardStatsView(APIView):
    """
    GET /api/admin/dashboard/
    Kuch basic stats: total users, products, orders, total revenue.
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def get(self, request, *args, **kwargs):
        total_users = User.objects.count()
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        total_revenue = (
            Order.objects.filter(payment_status="PAID").aggregate(
                total=Sum("total_amount")
            )["total"]
            or 0
        )

        recent_orders = (
            Order.objects.order_by("-created_at")
            .select_related("user")[:5]
        )
        recent_orders_data = AdminOrderSerializer(recent_orders, many=True).data

        return Response(
            {
                "total_users": total_users,
                "total_products": total_products,
                "total_orders": total_orders,
                "total_revenue": total_revenue,
                "recent_orders": recent_orders_data,
            },
            status=status.HTTP_200_OK,
        )


# -----------------------
# Users Management
# -----------------------
class AdminUserListView(generics.ListAPIView):
    """
    GET /api/admin/users/
    Saare users ki list (sirf admin ke liye).
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminUserSerializer

    def get_queryset(self):
        return User.objects.all().order_by("-date_joined")


# -----------------------
# Category Management
# -----------------------
class AdminCategoryListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/admin/categories/
    POST /api/admin/categories/
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminCategorySerializer

    def get_queryset(self):
        return Category.objects.all().order_by("name")


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/categories/<int:pk>/
    PUT    /api/admin/categories/<int:pk>/
    PATCH  /api/admin/categories/<int:pk>/
    DELETE /api/admin/categories/<int:pk>/
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminCategorySerializer

    def get_queryset(self):
        return Category.objects.all()


# -----------------------
# Product Management
# -----------------------
class AdminProductListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/admin/products/
    POST /api/admin/products/
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminProductSerializer

    def get_queryset(self):
        return (
            Product.objects.all()
            .select_related("category")
            .order_by("-created_at")
        )


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminProductSerializer

    def get_queryset(self):
        return Product.objects.all().select_related("category")

    # ⭐ IMPORTANT FIX — Boolean fields (false values) now update correctly
    def patch(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # 👉 ORDER वाले products को SOFT DELETE
        if instance.order_items.exists():
            instance.is_active = False
            instance.save()
            return Response(
                {"message": "Product deactivated (soft deleted)."},
                status=status.HTTP_200_OK
            )

        # 👉 Bina order वाले products को normal delete
        return super().destroy(request, *args, **kwargs)

# -----------------------
# Orders Management
# -----------------------
class AdminOrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminOrderSerializer
    pagination_class = None

    def get_queryset(self):
        qs = Order.objects.select_related("user").prefetch_related("items").order_by("-created_at")
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request  # 👈 Must for absolute image URL
        return context

class AdminOrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminOrderSerializer
    lookup_field = "order_number"

    def get_queryset(self):
        return Order.objects.select_related("user").prefetch_related("items")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request  # 👈 MUST
        return context


class AdminOrderStatusUpdateView(APIView):
    """
    PATCH /api/admin/orders/<str:order_number>/status/
    Body example:
    {
      "status": "SHIPPED",
      "payment_status": "PAID",
      "payment_id": "razorpay_payment_id"
    }
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def patch(self, request, order_number, *args, **kwargs):
        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminOrderStatusUpdateSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Order updated successfully."},
            status=status.HTTP_200_OK,
        )


class AdminFooterBrandView(APIView):
    """
    GET  /api/admin/footer/brand/   -> current brand info
    PUT  /api/admin/footer/brand/   -> update brand info
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def get_object(self):
        # agar row nahi hai to create kardo ek default
        obj, _ = FooterBrandInfo.objects.get_or_create(
            id=1,
            defaults={
                "site_name": "LoveDoor",
                "tagline": "",
                "description": "",
                "copyright_text": "",
                "owner_text": "",
            },
        )
        return obj

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = AdminFooterBrandInfoSerializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = AdminFooterBrandInfoSerializer(
            obj, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

