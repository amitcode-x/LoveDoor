from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from apps.adminpanel.permissions import IsAdminOrStaff

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
