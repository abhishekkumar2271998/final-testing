from django.contrib import admin

from .models import BuyerAd, Order, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "seller", "price", "stock", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "seller__username")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "buyer", "product", "quantity", "status", "created_at")
    list_filter = ("status",)


@admin.register(BuyerAd)
class BuyerAdAdmin(admin.ModelAdmin):
    list_display = ("title", "buyer", "category", "budget_max", "status", "created_at")
    list_filter = ("status", "category")
    search_fields = ("title", "buyer__username")
