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
     AdminOrderItemUpdateDeleteView,
     AdminBlockUserView,
     AdminUnblockUserView,
     AdminUserDetailView,
     AdminPaymentListView,
     AdminPaymentDetailView
 
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

    # Orders
    path("orders/", AdminOrderListView.as_view(), name="orders_list"),
    path("orders/<str:order_number>/", AdminOrderDetailView.as_view(), name="order_detail"),
    path("orders/<str:order_number>/status/",AdminOrderStatusUpdateView.as_view(),name="order_status_update"),
    
    #payments
    
    path("payments/",AdminPaymentListView.as_view(),name="payment_list"),
     path("payments/<int:id>/", AdminPaymentDetailView.as_view(), name="payment_detail"),  # ⭐ NEW

    


    
    path("orders/<str:order_number>/items/<int:item_id>/",AdminOrderItemUpdateDeleteView.as_view(),name="order_item_update_delete"),
    
    path("footer/brand/", AdminFooterBrandView.as_view(), name="footer_brand"),
    


   
]

    



   