from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from apps.products.models import Product
from apps.users.models import Address


class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("COD", "Cash on Delivery"),
        ("RAZORPAY", "Razorpay"),
        ("STRIPE", "Stripe"),
        ("PAYPAL", "Paypal"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PROCESSING", "Processing"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
        ("REFUNDED", "Refunded"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    order_number = models.CharField(
        max_length=30,
        unique=True,
        blank=True
    )

    # store snapshot of address (taaki future me address change ho jaye tab bhi order ka address safe rahe)
    shipping_address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders"
    )

    shipping_full_name = models.CharField(max_length=150)
    shipping_phone = models.CharField(max_length=20)
    shipping_address_line1 = models.CharField(max_length=255)
    shipping_address_line2 = models.CharField(max_length=255, blank=True)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100, default="India")

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default="COD"
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="PENDING"
    )
    payment_id = models.CharField(
        max_length=100,
        blank=True
    )  # Razorpay order id / payment id etc.
    
    is_seen_by_admin = models.BooleanField(default=False)   # ⭐ NEW FIELD

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.order_number} - {self.user.username}"

    def save(self, *args, **kwargs):
        """
        - Agar naya order hai to order_number generate karo
        - Agar status change hua hai to OrderStatusHistory me entry create karo
        """
        is_new = self.pk is None
        old_status = None

        if not is_new:
            try:
                old = Order.objects.get(pk=self.pk)
                old_status = old.status
            except Order.DoesNotExist:
                old_status = None

        # order_number auto-generate if empty
        if not self.order_number:
            now = timezone.now()
            date_str = now.strftime("%Y%m%d%H%M%S")
            self.order_number = f"ORD{date_str}{self.user.id}"

        super().save(*args, **kwargs)

        # Status history create
        # import ki zarurat nahi, same file me model hai
        if is_new or (old_status and old_status != self.status):
            OrderStatusHistory.objects.create(
                order=self,
                status=self.status,
                message=f"Status updated to {self.status}",
            )


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        Product,
        related_name="order_items",
        on_delete=models.PROTECT
    )
    product_name = models.CharField(max_length=200)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.product_name} x {self.quantity} (Order {self.order.order_number})"


class OrderStatusHistory(models.Model):
    """
    Har status change ka ek record: kab, kya status, optional message.
    """
    order = models.ForeignKey(
        Order,
        related_name="status_history",
        on_delete=models.CASCADE
    )
    status = models.CharField(
        max_length=20,
        choices=Order.STATUS_CHOICES,
    )
    message = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.order.order_number} - {self.status} at {self.created_at}"
