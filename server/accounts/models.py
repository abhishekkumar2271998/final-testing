from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with a marketplace role and a unique email.

    `role` decides which dashboard the user lands on and which endpoints they
    may call (sellers manage products; buyers place orders).
    """

    class Role(models.TextChoices):
        BUYER = "buyer", "Buyer"
        SELLER = "seller", "Seller"

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10, choices=Role.choices, default=Role.BUYER
    )

    @property
    def is_seller(self) -> bool:
        return self.role == self.Role.SELLER

    @property
    def is_buyer(self) -> bool:
        return self.role == self.Role.BUYER

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"


class Profile(models.Model):
    """Public-facing profile data, one per user."""

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile"
    )
    display_name = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    location = models.CharField(max_length=120, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Profile<{self.user.username}>"
