from django.urls import path
from .views import HomepageConfigAPIView
from .views import BottomNavListView

app_name = "homepage"

urlpatterns = [
    path("", HomepageConfigAPIView.as_view(), name="homepage_config"),
     path("bottom-nav/", BottomNavListView.as_view(), name="bottom_nav"),
]
