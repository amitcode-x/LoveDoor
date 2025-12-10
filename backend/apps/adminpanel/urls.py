from django.urls import path

from .views import (
    AdminDashboardStatsView,
    AdminUserListView,
    AdminCategoryListCreateView,
    AdminCategoryDetailView,
    AdminProductListCreateView,
    AdminProductDetailView,
    AdminOrderListView,
    AdminOrderDetailView,
    AdminOrderStatusUpdateView,
    AdminFooterBrandView,  # agar already nahi hai
    AdminOrderItemUpdateDeleteView,
    AdminBlockUserView,
    AdminUnblockUserView,
    AdminUserDetailView,
    AdminPaymentListView,
    AdminPaymentDetailView,
    AdminUnseenOrderCountView,
    AdminMarkOrdersSeenView,
        AdminProfileView,             # ⭐ ADD THIS
    AdminChangePasswordView, 
)

app_name = "adminpanel"

urlpatterns = [
    # Dashboard
    path("dashboard/", AdminDashboardStatsView.as_view(), name="dashboard"),

    # Users
    path("users/", AdminUserListView.as_view(), name="users_list"),
    path("users/<int:pk>/block/", AdminBlockUserView.as_view()),
    path("users/<int:pk>/unblock/", AdminUnblockUserView.as_view()),
    path("users/<int:pk>/", AdminUserDetailView.as_view()),

    # Categories
    path("categories/", AdminCategoryListCreateView.as_view(), name="categories_list_create"),
    path("categories/<int:pk>/", AdminCategoryDetailView.as_view(), name="category_detail"),

    # Products
    path("products/", AdminProductListCreateView.as_view(), name="products_list_create"),
    path("products/<int:pk>/", AdminProductDetailView.as_view(), name="product_detail"),

    # ===================== ORDERS EXTRA (UNSEEN + MARK SEEN) =====================
    # ⚠️ Inko sabse upar rakhna hai orders/<str:order_number>/ se pehle
    path("orders/unseen-count/", AdminUnseenOrderCountView.as_view()),
    path("orders/mark-seen/", AdminMarkOrdersSeenView.as_view()),

    # ===================== ORDERS =====================
    # List
    path("orders/", AdminOrderListView.as_view(), name="orders_list"),

    # Order items update/delete → yeh detail se pehle hona chahiye
    path(
        "orders/<str:order_number>/items/<int:item_id>/",
        AdminOrderItemUpdateDeleteView.as_view(),
        name="order_item_update_delete",
    ),

    # Status update
    path(
        "orders/<str:order_number>/status/",
        AdminOrderStatusUpdateView.as_view(),
        name="order_status_update",
    ),

    # Detail (sabse last — sabse generic pattern)
    path(
        "orders/<str:order_number>/",
        AdminOrderDetailView.as_view(),
        name="order_detail",
    ),

    # Payments
    path("payments/", AdminPaymentListView.as_view(), name="payment_list"),
    path("payments/<int:id>/", AdminPaymentDetailView.as_view(), name="payment_detail"),  # ⭐ NEW

    # Footer brand
    path("footer/brand/", AdminFooterBrandView.as_view(), name="footer_brand"),
    
    
    
    
        # ⭐ NEW PROFILE ROUTES
    path("profile/", AdminProfileView.as_view(), name="admin_profile"),
    path(
        "profile/change-password/",
        AdminChangePasswordView.as_view(),
        name="admin_change_password",
    ),
    
    
    
]
