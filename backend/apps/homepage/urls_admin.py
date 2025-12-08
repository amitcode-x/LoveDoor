from django.urls import path
from .views_admin import (
    AdminBottomNavListCreateView,
    AdminBottomNavDetailView,
    AdminStaticHeroView,
    AdminHeroSlideDetailView,
    AdminHeroSlideListCreateView,
        AdminFeaturedOfferListCreateView,
    AdminFeaturedOfferDetailView,
)

app_name = "homepage_admin"

urlpatterns = [
    path("bottom-nav/", AdminBottomNavListCreateView.as_view()),
    path("bottom-nav/<int:pk>/", AdminBottomNavDetailView.as_view()),
  path("static-hero/", AdminStaticHeroView.as_view(), name="static_hero"),
  
   # ⭐ HERO SLIDES ADMIN
    path("hero-slides/", AdminHeroSlideListCreateView.as_view()),
    path("hero-slides/<int:pk>/", AdminHeroSlideDetailView.as_view()),
    
     # ⭐ Featured Offers
    path("featured-offers/", AdminFeaturedOfferListCreateView.as_view()),
    path("featured-offers/<int:pk>/", AdminFeaturedOfferDetailView.as_view()),
]
