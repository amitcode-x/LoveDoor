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
    AdminFooterBrandView , # agar already nahi hai
 
)

app_name = "adminpanel"

urlpatterns = [
    # Dashboard
    path("dashboard/", AdminDashboardStatsView.as_view(), name="dashboard"),

    # Users
    path("users/", AdminUserListView.as_view(), name="users_list"),

    # Categories
    path("categories/", AdminCategoryListCreateView.as_view(), name="categories_list_create"),
    path("categories/<int:pk>/", AdminCategoryDetailView.as_view(), name="category_detail"),

    # Products
    path("products/", AdminProductListCreateView.as_view(), name="products_list_create"),
    path("products/<int:pk>/", AdminProductDetailView.as_view(), name="product_detail"),

    # Orders
    path("orders/", AdminOrderListView.as_view(), name="orders_list"),
    path("orders/<str:order_number>/", AdminOrderDetailView.as_view(), name="order_detail"),
    path(
        "orders/<str:order_number>/status/",
        AdminOrderStatusUpdateView.as_view(),
        name="order_status_update",
    ),
    path("footer/brand/", AdminFooterBrandView.as_view(), name="footer_brand"),
    


   
]

    



   
