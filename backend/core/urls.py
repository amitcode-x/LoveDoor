"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
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

    # ADMIN PANEL (includes admin orders)
    path("api/admin/", include("apps.adminpanel.urls", namespace="adminpanel")),

    # ADMIN FOOTER
    path("api/admin/footer/", include("apps.footer.urls_admin", namespace="footer_admin")),
    
    path("api/admin/homepage/", include("apps.homepage.urls_admin", namespace="homepage_admin")),


]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
