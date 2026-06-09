from django.db.models import Count
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsBuyer, IsSeller

from .models import Order, Product
from .serializers import OrderSerializer, ProductSerializer


# ---------------------------------------------------------------------------
# Public / browse
# ---------------------------------------------------------------------------
class ProductBrowseView(generics.ListAPIView):
    """GET /api/products/ — active products, browsable by any authed user."""

    serializer_class = ProductSerializer
    queryset = Product.objects.filter(is_active=True)


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<id>/ — single product."""

    serializer_class = ProductSerializer
    queryset = Product.objects.all()


# ---------------------------------------------------------------------------
# Seller
# ---------------------------------------------------------------------------
class SellerProductListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/seller/products/ — the seller's own products."""

    serializer_class = ProductSerializer
    permission_classes = [IsSeller]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class SellerProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/PATCH/DELETE /api/seller/products/<id>/ — owned products only."""

    serializer_class = ProductSerializer
    permission_classes = [IsSeller]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)


class SellerDashboardView(APIView):
    """GET /api/seller/dashboard/ — headline stats for the seller."""

    permission_classes = [IsSeller]

    def get(self, request):
        products = Product.objects.filter(seller=request.user)
        orders = Order.objects.filter(product__seller=request.user)
        revenue = sum((o.total for o in orders), 0)
        return Response(
            {
                "product_count": products.count(),
                "active_product_count": products.filter(is_active=True).count(),
                "order_count": orders.count(),
                "revenue": str(revenue),
                "low_stock": ProductSerializer(
                    products.filter(stock__lt=5), many=True
                ).data,
            }
        )


# ---------------------------------------------------------------------------
# Buyer
# ---------------------------------------------------------------------------
class BuyerOrderListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/buyer/orders/ — the buyer's own orders."""

    serializer_class = OrderSerializer
    permission_classes = [IsBuyer]

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)


class BuyerDashboardView(APIView):
    """GET /api/buyer/dashboard/ — headline stats for the buyer."""

    permission_classes = [IsBuyer]

    def get(self, request):
        orders = Order.objects.filter(buyer=request.user)
        spent = sum((o.total for o in orders), 0)
        by_status = orders.values("status").annotate(count=Count("id"))
        return Response(
            {
                "order_count": orders.count(),
                "total_spent": str(spent),
                "by_status": list(by_status),
                "recent_orders": OrderSerializer(orders[:5], many=True).data,
            }
        )
