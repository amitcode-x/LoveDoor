from django.urls import path

from .views import (
    OrderCreateView,
    OrderListView,
    OrderDetailView,
    TrackOrderView,
    CancelOrderView,
    OrderInvoiceView,
     OrderInvoiceView,   # <-- ADD THIS
)

app_name = "orders"

urlpatterns = [
    path("create/", OrderCreateView.as_view(), name="order_create"),
    path("", OrderListView.as_view(), name="order_list"),

    # ✅ Track by phone + orderNumber
    path("track/", TrackOrderView.as_view(), name="track_order"),

    # ✅ Cancel order
    path("cancel/<str:order_number>/", CancelOrderView.as_view(), name="order_cancel"),

    # ✅ Invoice download
    path("<str:order_number>/invoice/", OrderInvoiceView.as_view(), name="order_invoice"),

    # Detail last
    path("<str:order_number>/", OrderDetailView.as_view(), name="order_detail"),
    
    #invoice download
    path("<str:order_number>/invoice/", OrderInvoiceView.as_view(), name="order_invoice"),

]
