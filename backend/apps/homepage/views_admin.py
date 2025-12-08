from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from apps.adminpanel.permissions import IsAdminOrStaff

from .models import (BottomNavCategory, StaticHero,HeroSlide,FeaturedOffer,SecondaryHero)
from .serializers import (BottomNavCategorySerializer, StaticHeroAdminSerializer,HeroSlideAdminSerializer,FeaturedOfferAdminSerializer,SecondaryHeroAdminSerializer)










class AdminBottomNavListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = BottomNavCategorySerializer

    def get_queryset(self):
        return BottomNavCategory.objects.all().order_by("order")


class AdminBottomNavDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = BottomNavCategorySerializer
    queryset = BottomNavCategory.objects.all()
    



class AdminStaticHeroView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        # Safe get_or_create ensuring all required fields exist
        hero, created = StaticHero.objects.get_or_create(
            id=1,
            defaults={
                "title": "Welcome to LoveDoor",
                "subtitle": "",
                "button_text": "Shop Now",
                "button_link": "/shop",
                "image_url": "",
                "is_active": True,
            },
        )

        # fix missing fields in old DB rows
        if hero.button_link is None or hero.button_link == "":
            hero.button_link = "/shop"
            hero.save()

        return hero

    def get(self, request):
        hero = self.get_object()
        serializer = StaticHeroAdminSerializer(hero)
        return Response(serializer.data)

    def put(self, request):
        hero = self.get_object()

        serializer = StaticHeroAdminSerializer(
            hero,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)



class AdminHeroSlideListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = HeroSlideAdminSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return HeroSlide.objects.all().order_by("sort_order", "id")


class AdminHeroSlideDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = HeroSlideAdminSerializer
    parser_classes = [MultiPartParser, FormParser]
    queryset = HeroSlide.objects.all()


class AdminFeaturedOfferListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/admin/homepage/featured-offers/
    POST /api/admin/homepage/featured-offers/
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = FeaturedOfferAdminSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return FeaturedOffer.objects.all().order_by("sort_order", "id")


class AdminFeaturedOfferDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/homepage/featured-offers/<id>/
    PUT    /api/admin/homepage/featured-offers/<id>/
    PATCH  /api/admin/homepage/featured-offers/<id>/
    DELETE /api/admin/homepage/featured-offers/<id>/
    """
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = FeaturedOfferAdminSerializer
    parser_classes = [MultiPartParser, FormParser]
    queryset = FeaturedOffer.objects.all()
    
    
class AdminSecondaryHeroView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        hero, created = SecondaryHero.objects.get_or_create(
            id=1,
            defaults={
                "title": "Quality Essentials",
                "description": "Top rated products handpicked for you.",
                "button_text": "Browse Essentials",
                "button_link": "/shop",
                "image_url": "",
                "is_active": True,
            },
        )

        # button_link fix if empty
        if not hero.button_link:
            hero.button_link = "/shop"
            hero.save()

        return hero

    def get(self, request):
        hero = self.get_object()
        return Response(SecondaryHeroAdminSerializer(hero).data)

    def put(self, request):
        hero = self.get_object()

        serializer = SecondaryHeroAdminSerializer(
            hero, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

