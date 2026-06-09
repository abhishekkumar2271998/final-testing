from django.contrib import admin

from .models import Order, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "seller", "price", "stock", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "seller__username")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "buyer", "product", "quantity", "status", "created_at")
    list_filter = ("status",)
