from rest_framework.permissions import BasePermission


class IsAdminOrStaff(BasePermission):
    """
    Sirf authenticated + is_staff users ko allow karega.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )
