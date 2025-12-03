from django.urls import path
from .views_admin import (
    AdminBottomNavListCreateView,
    AdminBottomNavDetailView,
)

app_name = "homepage_admin"

urlpatterns = [
    path("bottom-nav/", AdminBottomNavListCreateView.as_view()),
    path("bottom-nav/<int:pk>/", AdminBottomNavDetailView.as_view()),
]
