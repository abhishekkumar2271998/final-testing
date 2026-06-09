from rest_framework.permissions import BasePermission


class IsSeller(BasePermission):
    message = "Only seller accounts can perform this action."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_seller)


class IsBuyer(BasePermission):
    message = "Only buyer accounts can perform this action."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_buyer)
