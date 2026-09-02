from django.urls import path

from .views import (
    AdBoardView,
    BuyerAdDetailView,
    BuyerAdListCreateView,
    BuyerDashboardView,
    BuyerOrderListCreateView,
    ProductBrowseView,
    ProductDetailView,
    SellerDashboardView,
    SellerProductDetailView,
    SellerProductListCreateView,
)

urlpatterns = [
    # Browse
    path("products/", ProductBrowseView.as_view(), name="product-browse"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("ads/", AdBoardView.as_view(), name="ad-board"),
    # Seller
    path("seller/products/", SellerProductListCreateView.as_view(), name="seller-products"),
    path("seller/products/<int:pk>/", SellerProductDetailView.as_view(), name="seller-product-detail"),
    path("seller/dashboard/", SellerDashboardView.as_view(), name="seller-dashboard"),
    # Buyer
    path("buyer/orders/", BuyerOrderListCreateView.as_view(), name="buyer-orders"),
    path("buyer/dashboard/", BuyerDashboardView.as_view(), name="buyer-dashboard"),
    path("buyer/ads/", BuyerAdListCreateView.as_view(), name="buyer-ads"),
    path("buyer/ads/<int:pk>/", BuyerAdDetailView.as_view(), name="buyer-ad-detail"),
]
