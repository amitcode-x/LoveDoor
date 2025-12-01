from django.urls import path
from .views import WishlistListView, WishlistToggleView

app_name = "wishlist"

urlpatterns = [
    path("", WishlistListView.as_view(), name="wishlist_list"),
    path("toggle/<int:product_id>/", WishlistToggleView.as_view(), name="wishlist_toggle"),
]
