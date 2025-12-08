from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    # USER ROUTES
    path("api/auth/", include("apps.users.urls", namespace="users")),
    path("api/products/", include("apps.products.urls", namespace="products")),
    path("api/orders/", include("apps.orders.urls", namespace="orders")),
    path("api/payments/", include("apps.payments.urls", namespace="payments")),
    path("api/wishlist/", include("apps.wishlist.urls", namespace="wishlist")),
    path("api/homepage/", include("apps.homepage.urls", namespace="homepage")),
    path("api/footer/", include("apps.footer.urls", namespace="footer")),

    # ADMIN PANEL (FIXED)
    path("api/admin/", include(("apps.adminpanel.urls", "adminpanel"), namespace="adminpanel")),

    # ADMIN FOOTER
    path("api/admin/footer/", include("apps.footer.urls_admin", namespace="footer_admin")),
    
    # ADMIN HOMEPAGE
    path("api/admin/homepage/", include("apps.homepage.urls_admin", namespace="homepage_admin")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
