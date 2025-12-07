from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from apps.adminpanel.permissions import IsAdminOrStaff

from .models import BottomNavCategory, StaticHero
from .serializers import BottomNavCategorySerializer, StaticHeroAdminSerializer


from .models import BottomNavCategory
from .serializers import BottomNavCategorySerializer


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
