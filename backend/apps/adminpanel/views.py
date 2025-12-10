from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.payments.models import Payment
from apps.payments.serializers import AdminPaymentSerializer
from apps.products.models import Category, Product
from apps.orders.models import Order
from .serializers import (
    AdminUserSerializer,
    AdminCategorySerializer,
    AdminProductSerializer,
    AdminOrderSerializer,
    AdminOrderStatusUpdateSerializer,
    AdminFooterBrandInfoSerializer,
     AdminProfileSerializer,
    AdminChangePasswordSerializer,
    
    
)
from .permissions import IsAdminOrStaff

from apps.footer.models import FooterBrandInfo



from decimal import Decimal

def recalc_order_totals(order: Order):
    """
    Order ke saare items se subtotal nikal ke
    subtotal_amount / total_amount ko update karega.
    Discount & shipping ko as-is rakhega.
    """
    subtotal = Decimal("0.00")
    for item in order.items.all():
        subtotal += item.line_total

    order.subtotal_amount = subtotal
    # total = subtotal - discount + shipping
    order.total_amount = subtotal - order.discount_amount + order.shipping_amount
    order.save(update_fields=["subtotal_amount", "total_amount", "updated_at"])




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


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/admin/users/<id>/
    PATCH /api/admin/users/<id>/
    DELETE /api/admin/users/<id>/
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all()


class AdminBlockUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_active = False
            user.save()
            return Response({"message": "User blocked"}, status=200)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class AdminUnblockUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_active = True
            user.save()
            return Response({"message": "User unblocked"}, status=200)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


# -----------------------
# Category Management
# -----------------------
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

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/categories/<id>/
    PATCH  /api/admin/categories/<id>/
    DELETE /api/admin/categories/<id>/
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminCategorySerializer
    lookup_field = "pk"

    def get_queryset(self):
        return Category.objects.all()

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

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



class AdminOrderItemUpdateDeleteView(APIView):
    """
    PATCH /api/admin/orders/<order_number>/items/<item_id>/
      body: { "quantity": 2 }

    DELETE /api/admin/orders/<order_number>/items/<item_id>/
      → item delete, stock restore, totals recalc
      → agar last item delete hua to order CANCEL + totals 0
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def _get_order_and_item(self, order_number, item_id):
        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            raise Http404("Order not found")

        try:
            item = order.items.get(pk=item_id)
        except OrderItem.DoesNotExist:
            raise Http404("Order item not found")

        return order, item

    def patch(self, request, order_number, item_id, *args, **kwargs):
        """
        Quantity update
        - stock check
        - product.stock adjust
        - line_total update
        - order totals recalc
        """
        order, item = self._get_order_and_item(order_number, item_id)

        try:
            new_qty = int(request.data.get("quantity", 0))
        except (TypeError, ValueError):
            return Response(
                {"detail": "Invalid quantity."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_qty < 1:
            return Response(
                {"detail": "Quantity must be at least 1."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = item.product
        diff = new_qty - item.quantity  # +ve => increase, -ve => decrease

        # Agar qty badha rahe ho to stock check
        if diff > 0 and product.stock < diff:
            return Response(
                {
                    "detail": f"Not enough stock for {product.name}. "
                              f"Available: {product.stock}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Stock adjust (diff negative ho to + ho jayega)
        product.stock -= diff
        product.save(update_fields=["stock"])

        # Item update
        item.quantity = new_qty
        item.line_total = item.product_price * new_qty
        item.save(update_fields=["quantity", "line_total"])

        # Order totals recalc
        recalc_order_totals(order)

        serializer = AdminOrderSerializer(
            order, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, order_number, item_id, *args, **kwargs):
        """
        Item delete:
        - product.stock wapas add
        - item delete
        - agar items bache hain → totals recalc
        - agar koi item nahi bacha → order CANCEL + amounts 0
        """
        order, item = self._get_order_and_item(order_number, item_id)
        product = item.product

        # stock wapas
        product.stock += item.quantity
        product.save(update_fields=["stock"])

        # item delete
        item.delete()

        if order.items.exists():
            recalc_order_totals(order)
        else:
            # last item gaya, order cancel
            order.status = "CANCELLED"
            order.subtotal_amount = 0
            order.discount_amount = 0
            order.shipping_amount = 0
            order.total_amount = 0
            order.save(
                update_fields=[
                    "status",
                    "subtotal_amount",
                    "discount_amount",
                    "shipping_amount",
                    "total_amount",
                    "updated_at",
                ]
            )

        serializer = AdminOrderSerializer(
            order, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)



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
    
    
class AdminPaymentListView(generics.ListAPIView):
    """
    GET /api/admin/payments/
    Sari payments (COD + Razorpay) list hogi.
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminPaymentSerializer

    def get_queryset(self):
        return Payment.objects.select_related("order", "user").order_by("-created_at")
    
class AdminPaymentDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = AdminPaymentSerializer
    queryset = Payment.objects.select_related("order", "user")
    lookup_field = "id"



class AdminUnseenOrderCountView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def get(self, request):
        count = Order.objects.filter(is_seen_by_admin=False).count()
        return Response({"count": count})


class AdminMarkOrdersSeenView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def post(self, request):
        Order.objects.filter(is_seen_by_admin=False).update(is_seen_by_admin=True)
        return Response({"message": "All orders marked as seen"})



class AdminProfileView(APIView):
    """
    GET  /api/admin/profile/          -> current admin ka profile
    PUT  /api/admin/profile/          -> profile update (name, email)
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def get(self, request):
        serializer = AdminProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = AdminProfileSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminChangePasswordView(APIView):
    """
    POST /api/admin/profile/change-password/
    body:
    {
      "old_password": "...",
      "new_password": "...",
      "confirm_password": "..."
    }
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def post(self, request):
        serializer = AdminChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        new_password = serializer.validated_data["new_password"]
        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )