from django.http import HttpResponse
from io import BytesIO
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.pagination import PageNumberPagination

from apps.payments.models import Payment

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from .models import Order
from .serializers import (
    OrderSerializer,
    OrderCreateSerializer,
)

from django.shortcuts import get_object_or_404
from reportlab.lib.units import mm

# ⭐ ADD THIS IMPORT
from apps.payments.models import Payment


# ==========================
# Pagination
# ==========================
class OrderPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


# ==========================
# Create Order (UPDATED)
# ==========================
class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        # 🔥 Serializer saves the order
        order = serializer.save()

        # ⭐ NEW: Set order status to CONFIRMED immediately after creation
        order.status = "CONFIRMED"
        order.save(update_fields=["status"])
        
        order.is_seen_by_admin = False
        order.save(update_fields=["is_seen_by_admin"])


        # ⭐ Payment record (KEEP AS IT IS)
        Payment.objects.create(
            user=request.user,
            order=order,
            method=order.payment_method,   # COD or RAZORPAY
            amount=order.total_amount,
            currency="INR",
            status="CREATED",
        )

        return Response(
            {
                "message": "Order created successfully.",
                "order": OrderSerializer(order).data,
            },
            status=201,
        )


# ==========================
# Order List (pagination)
# ==========================
class OrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    pagination_class = OrderPagination

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")


# ==========================
# Order Detail
# ==========================
class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    lookup_field = "order_number"

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")


# ==========================
# Track Order (public)
# ==========================
class TrackOrderView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        order_number = request.GET.get("order_number")
        phone = request.GET.get("phone")

        if not order_number or not phone:
            return Response({"error": "order_number and phone are required."}, status=400)

        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)

        if order.shipping_phone != phone:
            return Response({"error": "Phone number does not match."}, status=403)

        return Response(OrderSerializer(order).data)


# ==========================
# Cancel Order
# ==========================
class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)

        if order.status in ["DELIVERED", "CANCELLED"]:
            return Response(
                {"error": "This order cannot be cancelled."},
                status=400,
            )

        if order.status not in ["PENDING", "PROCESSING"]:
            return Response(
                {"error": "Order cannot be cancelled at this stage."},
                status=400,
            )

        order.status = "CANCELLED"
        order.save()

        return Response({"message": "Order cancelled.", "order": OrderSerializer(order).data})


# ==========================
# Invoice PDF (AllowAny)
# ==========================
class OrderInvoiceView(APIView):
    permission_classes = [AllowAny]   # ⭐ FIX  

    def get(self, request, order_number):
        """
        PDF invoice download.
        Public access allowed because window.open() cannot send JWT token.
        Optional security: phone number check.
        """

        phone = request.GET.get("phone", None)

        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        if phone and phone != order.shipping_phone:
            return Response({"error": "Phone number mismatch"}, status=403)

        # Create PDF
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        y = height - 40

        # Header
        pdf.setFont("Helvetica-Bold", 18)
        pdf.drawString(40, y, "INVOICE")
        y -= 30

        pdf.setFont("Helvetica", 12)
        pdf.drawString(40, y, f"Order Number: {order.order_number}")
        y -= 20

        pdf.drawString(40, y, f"Date: {order.created_at.strftime('%d-%m-%Y')}")
        y -= 20

        pdf.drawString(40, y, f"Payment Status: {order.payment_status}")
        y -= 30

        # Customer details
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(40, y, "Billing Details")
        y -= 20

        pdf.setFont("Helvetica", 12)
        pdf.drawString(40, y, order.shipping_full_name)
        y -= 15
        pdf.drawString(40, y, f"{order.shipping_address_line1} {order.shipping_address_line2}")
        y -= 15
        pdf.drawString(40, y, f"{order.shipping_city}, {order.shipping_state}, {order.shipping_postal_code}")
        y -= 15
        pdf.drawString(40, y, order.shipping_country)
        y -= 25

        # Items header
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(40, y, "Product")
        pdf.drawString(240, y, "Qty")
        pdf.drawString(300, y, "Price")
        pdf.drawString(380, y, "Total")
        y -= 20

        pdf.setFont("Helvetica", 12)

        for item in order.items.all():
            pdf.drawString(40, y, item.product_name[:28])
            pdf.drawString(240, y, str(item.quantity))
            pdf.drawString(300, y, f"₹{item.product_price}")
            pdf.drawString(380, y, f"₹{item.line_total}")
            y -= 20

            if y < 120:
                pdf.showPage()
                y = height - 40
                pdf.setFont("Helvetica", 12)

        # Totals
        y -= 20
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(300, y, "Subtotal:")
        pdf.drawString(380, y, f"₹{order.subtotal_amount}")
        y -= 20

        pdf.drawString(300, y, "Shipping:")
        pdf.drawString(380, y, f"₹{order.shipping_amount}")
        y -= 20

        pdf.drawString(300, y, "Discount:")
        pdf.drawString(380, y, f"₹{order.discount_amount}")
        y -= 20

        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(300, y, "TOTAL:")
        pdf.drawString(380, y, f"₹{order.total_amount}")

        pdf.showPage()
        pdf.save()

        buffer.seek(0)
        response = HttpResponse(buffer, content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="invoice_{order_number}.pdf"'
        )
        return response
