from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import (
    StaticHero,
    HeroSlide,
    FeaturedOffer,
    SecondaryHero,
    GiftOfferSection,
    ServiceFeature,
    BottomNavCategory

)
from .serializers import (
    StaticHeroSerializer,
    HeroSlideSerializer,
    FeaturedOfferSerializer,
    SecondaryHeroSerializer,
    GiftOfferSectionSerializer,
    ServiceFeatureSerializer,
    BottomNavCategorySerializer
)









class HomepageConfigAPIView(APIView):
    """
    GET /api/homepage/
    Sari homepage config ek saath return karega
    """

    def get(self, request, *args, **kwargs):
        # 1 Static hero (pehla active)
        static_hero = (
            StaticHero.objects.filter(is_active=True).first()
        )
        static_hero_data = (
            StaticHeroSerializer(static_hero).data if static_hero else None
        )

        hero_slides = HeroSlide.objects.filter(is_active=True)
        featured_offers = FeaturedOffer.objects.filter(is_active=True)
        secondary_hero = SecondaryHero.objects.filter(is_active=True).first()
        gift_hero = GiftOfferSection.objects.filter(is_active=True).first()
        service_features = ServiceFeature.objects.filter(is_active=True)

        data = {
            "static_hero": static_hero_data,
            "hero_slides": HeroSlideSerializer(hero_slides, many=True).data,
            "featured_offers": FeaturedOfferSerializer(
                featured_offers, many=True
            ).data,
            "secondary_hero": SecondaryHeroSerializer(
                secondary_hero
            ).data
            if secondary_hero
            else None,
            "gift_offer": GiftOfferSectionSerializer(gift_hero).data
            if gift_hero
            else None,
            "service_features": ServiceFeatureSerializer(
                service_features, many=True
            ).data,
        }

        return Response(data)



class BottomNavListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BottomNavCategorySerializer

    def get_queryset(self):
        return BottomNavCategory.objects.filter(is_active=True).order_by("order")
