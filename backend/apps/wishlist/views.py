from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import WishlistItem
from .serializers import WishlistItemSerializer
from apps.products.models import Product


class WishlistListView(generics.ListAPIView):
    """
    GET /api/wishlist/
    Current user ke wishlist items.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistItemSerializer

    def get_queryset(self):
        return (
            WishlistItem.objects.filter(user=self.request.user)
            .select_related("product", "product__category")
        )


class WishlistToggleView(APIView):
    """
    POST /api/wishlist/toggle/<int:product_id>/
    Same endpoint se add/remove dono:
    - Agar product wishlist me nahi hai -> add
    - Agar already hai -> remove

    Response:
    {
      "in_wishlist": true/false,
      "message": "Added..." / "Removed..."
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id, *args, **kwargs):
        user = request.user

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {"detail": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        item, created = WishlistItem.objects.get_or_create(
            user=user,
            product=product,
        )

        if created:
            return Response(
                {"in_wishlist": True, "message": "Added to wishlist."},
                status=status.HTTP_201_CREATED,
            )
        else:
            item.delete()
            return Response(
                {"in_wishlist": False, "message": "Removed from wishlist."},
                status=status.HTTP_200_OK,
            )
