from rest_framework import serializers

from apps.products.models import Product
from apps.users.models import Address
from .models import Order, OrderItem, OrderStatusHistory


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "quantity",
            "line_total",
        ]
        read_only_fields = ["id", "product_name", "product_price", "line_total"]


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ["id", "status", "message", "created_at"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "user",
            "status",
            "payment_method",
            "payment_status",
            "payment_id",
            "subtotal_amount",
            "discount_amount",
            "shipping_amount",
            "total_amount",
            "shipping_full_name",
            "shipping_phone",
            "shipping_address_line1",
            "shipping_address_line2",
            "shipping_city",
            "shipping_state",
            "shipping_postal_code",
            "shipping_country",
            "notes",
            "created_at",
            "updated_at",
            "items",
            "status_history",   # ✅ new
        ]
        read_only_fields = [
            "id",
            "order_number",
            "user",
            "payment_status",
            "payment_id",
            "subtotal_amount",
            "discount_amount",
            "shipping_amount",
            "total_amount",
            "created_at",
            "updated_at",
        ]


class OrderCreateItemSerializer(serializers.Serializer):
    """
    Order create time par receive hone wale item ka format:
    {
      "product_id": 1,
      "quantity": 2
    }
    """
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    """
    Order create ke liye payload:
    {
      "shipping_address_id": 1,
      "payment_method": "COD",
      "items": [
        {"product_id": 1, "quantity": 2},
        {"product_id": 3, "quantity": 1}
      ],
      "notes": "Please deliver fast."
    }
    """
    shipping_address_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES)
    items = OrderCreateItemSerializer(many=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        items = attrs.get("items", [])
        if not items:
            raise serializers.ValidationError({"items": "At least one item is required."})

        # Address check
        user = self.context["request"].user
        try:
            address = Address.objects.get(id=attrs["shipping_address_id"], user=user)
        except Address.DoesNotExist:
            raise serializers.ValidationError({"shipping_address_id": "Invalid address."})

        # Products & stock check
        product_ids = [item["product_id"] for item in items]
        products = Product.objects.filter(id__in=product_ids, is_active=True, category__is_active=True)

        products_map = {p.id: p for p in products}
        if len(products_map) != len(product_ids):
            raise serializers.ValidationError({"items": "Some products are invalid or inactive."})

        for item in items:
            product = products_map[item["product_id"]]
            if product.stock < item["quantity"]:
                raise serializers.ValidationError(
                    {
                        "items": f"Not enough stock for product: {product.name}. Available: {product.stock}"
                    }
                )

        attrs["address_obj"] = address
        attrs["products_map"] = products_map
        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        address = validated_data["address_obj"]
        products_map = validated_data["products_map"]
        items_data = validated_data["items"]
        payment_method = validated_data["payment_method"]
        notes = validated_data.get("notes", "")

        subtotal = 0
        shipping_amount = 0  # abhi ke liye 0, baad me logic add kar sakte
        discount_amount = 0  # coupon logic ke liye placeholder

        # Pehle rough order create karo
        order = Order.objects.create(
            user=user,
            shipping_address=address,
            shipping_full_name=address.full_name,
            shipping_phone=address.phone,
            shipping_address_line1=address.address_line1,
            shipping_address_line2=address.address_line2,
            shipping_city=address.city,
            shipping_state=address.state,
            shipping_postal_code=address.postal_code,
            shipping_country=address.country,
            payment_method=payment_method,
            status="PENDING",
            payment_status="PENDING",
            notes=notes,
            subtotal_amount=0,   # abhi 0, baad me update
            discount_amount=0,
            shipping_amount=0,
            total_amount=0,
        )

        order_items = []

        for item in items_data:
            product = products_map[item["product_id"]]
            quantity = item["quantity"]
            price = product.effective_price
            line_total = price * quantity
            subtotal += line_total

            order_item = OrderItem(
                order=order,
                product=product,
                product_name=product.name,
                product_price=price,
                quantity=quantity,
                line_total=line_total,
            )
            order_items.append(order_item)

            # stock reduce
            product.stock -= quantity
            product.save(update_fields=["stock"])

        OrderItem.objects.bulk_create(order_items)

        total = subtotal - discount_amount + shipping_amount

        order.subtotal_amount = subtotal
        order.discount_amount = discount_amount
        order.shipping_amount = shipping_amount
        order.total_amount = total
        order.save()

        return order
