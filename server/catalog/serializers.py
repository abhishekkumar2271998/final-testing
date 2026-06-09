from rest_framework import serializers

from .models import Order, Product


class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source="seller.username", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "seller",
            "seller_name",
            "name",
            "description",
            "price",
            "stock",
            "image_url",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "seller", "seller_name", "created_at", "updated_at"]


class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    total = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "buyer",
            "product",
            "product_name",
            "quantity",
            "unit_price",
            "total",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "buyer",
            "product_name",
            "unit_price",
            "total",
            "status",
            "created_at",
        ]

    def validate(self, attrs):
        product = attrs["product"]
        quantity = attrs.get("quantity", 1)
        if not product.is_active:
            raise serializers.ValidationError("This product is not available.")
        if quantity > product.stock:
            raise serializers.ValidationError(
                f"Only {product.stock} unit(s) in stock."
            )
        return attrs

    def create(self, validated_data):
        product = validated_data["product"]
        validated_data["unit_price"] = product.price
        order = super().create(validated_data)
        # Decrement stock to reflect the purchase.
        product.stock -= order.quantity
        product.save(update_fields=["stock"])
        return order
