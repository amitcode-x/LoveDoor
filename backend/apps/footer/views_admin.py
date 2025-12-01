# apps/footer/views_admin.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status

from .models import (
    FooterBrandInfo,
    FooterNewsletterSettings,
    SocialLink,
    FooterColumn,
    FooterLink,
    PaymentMethod,
)

from .serializers import (
    FooterBrandInfoSerializer,
    FooterNewsletterSettingsSerializer,
    SocialLinkSerializer,
    FooterColumnSerializer,
    FooterLinkSerializer,
    PaymentMethodSerializer,
)

# -----------------------------------------------------------------------
# ⭐ BRAND INFO (GET + UPDATE)
# -----------------------------------------------------------------------
class AdminFooterBrandAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        obj = FooterBrandInfo.objects.first()
        if not obj:
            obj = FooterBrandInfo.objects.create()
        serializer = FooterBrandInfoSerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj = FooterBrandInfo.objects.first()
        if not obj:
            obj = FooterBrandInfo.objects.create()

        serializer = FooterBrandInfoSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------------------------------------------------
# ⭐ NEWSLETTER SETTINGS (GET + UPDATE)
# -----------------------------------------------------------------------
class AdminNewsletterSettingsAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        obj = FooterNewsletterSettings.objects.first()
        if not obj:
            obj = FooterNewsletterSettings.objects.create()
        serializer = FooterNewsletterSettingsSerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj = FooterNewsletterSettings.objects.first()
        if not obj:
            obj = FooterNewsletterSettings.objects.create()

        serializer = FooterNewsletterSettingsSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------------------------------------------------
# ⭐ SOCIAL LINKS CRUD
# -----------------------------------------------------------------------
class AdminSocialLinksAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = SocialLink.objects.all().order_by("sort_order", "id")
        serializer = SocialLinkSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SocialLinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminSocialLinkDetailAPIView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            obj = SocialLink.objects.get(pk=pk)
        except SocialLink.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SocialLinkSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            obj = SocialLink.objects.get(pk=pk)
        except SocialLink.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)


# -----------------------------------------------------------------------
# ⭐ FOOTER COLUMNS CRUD
# -----------------------------------------------------------------------
class AdminFooterColumnsAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = FooterColumn.objects.all().order_by("sort_order", "id")
        serializer = FooterColumnSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FooterColumnSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminFooterColumnDetailAPIView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            obj = FooterColumn.objects.get(pk=pk)
        except FooterColumn.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = FooterColumnSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            obj = FooterColumn.objects.get(pk=pk)
        except FooterColumn.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)


# -----------------------------------------------------------------------
# ⭐ FOOTER LINKS (BY COLUMN) CRUD
# -----------------------------------------------------------------------
class AdminFooterColumnLinksAPIView(APIView):
    """
    GET  /api/admin/footer/columns/<column_id>/links/
    POST /api/admin/footer/columns/<column_id>/links/
    """
    permission_classes = [IsAdminUser]

    def get(self, request, column_id):
        qs = FooterLink.objects.filter(column_id=column_id).order_by(
            "sort_order", "id"
        )
        serializer = FooterLinkSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request, column_id):
        data = request.data.copy()
        data["column"] = column_id  # FK set here

        serializer = FooterLinkSerializer(data=data)
        if serializer.is_valid():
            obj = serializer.save()
            out = FooterLinkSerializer(obj).data
            return Response(out, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminFooterLinkDetailAPIView(APIView):
    """
    PUT    /api/admin/footer/links/<pk>/
    DELETE /api/admin/footer/links/<pk>/
    """
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            obj = FooterLink.objects.get(pk=pk)
        except FooterLink.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = FooterLinkSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            obj = FooterLink.objects.get(pk=pk)
        except FooterLink.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)


# -----------------------------------------------------------------------
# ⭐ PAYMENT METHODS CRUD
# -----------------------------------------------------------------------
class AdminFooterPaymentsAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = PaymentMethod.objects.all().order_by("sort_order", "id")
        serializer = PaymentMethodSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PaymentMethodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AdminFooterPaymentDetailAPIView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            obj = PaymentMethod.objects.get(pk=pk)
        except PaymentMethod.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        serializer = PaymentMethodSerializer(obj, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            obj = PaymentMethod.objects.get(pk=pk)
        except PaymentMethod.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        obj.delete()
        return Response({"message": "Deleted"}, status=200)

