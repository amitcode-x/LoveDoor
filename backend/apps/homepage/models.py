from django.db import models


# Allowed only 10 categories max

from django.utils.text import slugify




class StaticHero(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)

    button_text = models.CharField(max_length=100, default="Shop Now")
    button_link = models.CharField(max_length=200, default="/shop", editable=False)


    # Image upload (optional)
    image = models.ImageField(
        upload_to="homepage/static/",
        blank=True,
        null=True,
        help_text="Optional: Upload an image (If both are provided, uploaded image is used)"
    )

    # Image URL (optional)
    image_url = models.URLField(
        blank=True,
        null=True,
        help_text="Optional: Enter an image URL (Only used if no image is uploaded)"
    )

    is_active = models.BooleanField(default=True)


    def get_image(self):
        """
        PRIORITY:
        1. Uploaded Image
        2. Image URL
        3. Default placeholder
        """
        if self.image:
            return self.image.url
        elif self.image_url:
            return self.image_url
        return "/static/default.jpg"   # Optional

    def __str__(self):
        return self.title



class HeroSlide(models.Model):
    title = models.CharField(max_length=200)
    text = models.CharField(max_length=300, blank=True)

    cta_text = models.CharField(max_length=100, default="Shop Now")
    cta_link = models.CharField(max_length=200, default="/shop", editable=False)


    image = models.ImageField(upload_to="homepage/hero_slides/", blank=True, null=True,  help_text="Optional: Upload an image (priority over URL)")
    image_url = models.URLField(blank=True, null=True,help_text="Optional: Enter image URL (Used only if no image uploaded)")

    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def get_image(self):
        return self.image.url if self.image else self.image_url



class FeaturedOffer(models.Model):
    title = models.CharField(max_length=200)
    text = models.CharField(max_length=300, blank=True)

    button_text = models.CharField(max_length=100, default="Explore")
    button_link = models.CharField(max_length=200, default="/shop", editable=False)


    image = models.ImageField(upload_to="homepage/featured_offer/", blank=True, null=True, help_text="Optional: Upload an image (priority over URL)")
    image_url = models.URLField(blank=True, null=True, help_text="Optional: Enter image URL (Used only if no image uploaded)")

    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def get_image(self):
        return self.image.url if self.image else self.image_url



class SecondaryHero(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=400, blank=True)
    button_text = models.CharField(max_length=100, default="Browse Essentials")
    button_link = models.CharField(max_length=200, default="/shop", editable=False)

    is_active = models.BooleanField(default=True)

    # ⭐ NEW: Upload image
    image = models.ImageField(
        upload_to="homepage/secondary_hero/",
        blank=True,
        null=True,
        help_text="Optional: Upload hero banner image"
    )

    # ⭐ NEW: Image URL
    image_url = models.URLField(
        blank=True,
        null=True,
        help_text="Optional: External image URL (used if upload missing)"
    )

    # ⭐ PRIORITY LOGIC (correct)
    def get_final_image(self):
        if self.image:
            return self.image.url
        if self.image_url:
            return self.image_url
        return None

    def __str__(self):
        return self.title


class GiftOfferSection(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=400)

    button_text = models.CharField(max_length=100, default="Explore Gifts")
    button_link = models.CharField(max_length=200, default="/shop", editable=False)


    image = models.ImageField(
        upload_to="homepage/gift_offer/",
        blank=True,
        null=True,
        help_text="Optional: Upload an image (priority over URL)"
    )
    image_url = models.URLField(
        blank=True,
        null=True,
        help_text="Optional: Enter image URL (Used only if no image uploaded)"
    )

    is_active = models.BooleanField(default=True)

    def get_image(self):
        if self.image:
            return self.image.url
        if self.image_url:
            return self.image_url
        return None


class ServiceFeature(models.Model):
    ICON_CHOICES = [
        ("money_back", "Money Back"),
        ("shipping", "Fast Shipping"),
        ("support", "24/7 Support"),
        ("custom", "Custom"),
    ]

    # ---------- LINK SYSTEM ----------
    LINK_TYPE_CHOICES = [
        ("cms", "CMS Page"),
        ("system", "System Page"),
        ("shop", "Shop Page"),
        ("external", "External URL"),
    ]

    LINK_PAGE_CHOICES = [

        # CMS PAGES
        ("CMS:about", "CMS → About Us"),
        ("CMS:contact", "CMS → Contact Us"),
        ("CMS:privacy", "CMS → Privacy Policy"),
        ("CMS:terms", "CMS → Terms of Use"),
        ("CMS:shipping", "CMS → Shipping Policy"),
        ("CMS:returns", "CMS → Return & Refund"),

        # SYSTEM PAGES
        ("SYS:track-order", "System → Track Order"),
        ("SYS:orders-returns", "System → Orders & Returns"),
        ("SYS:sitemap", "System → Site Map"),
        ("SYS:cart", "System → Cart"),
        ("SYS:wishlist", "System → Wishlist"),
        ("SYS:my-orders", "System → My Orders"),

        # SHOP PAGES
        ("SHOP:shop", "Shop → Shop Page"),
        ("SHOP:all-products", "Shop → All Products"),
    ]

    # ----------- MODEL FIELDS -------------

    icon_key = models.CharField(max_length=20, choices=ICON_CHOICES, default="custom")

    title = models.CharField(max_length=200)
    description = models.CharField(max_length=400)

    link_text = models.CharField(max_length=100)

    link_type = models.CharField(max_length=20, choices=LINK_TYPE_CHOICES)

    link_page = models.CharField(
        max_length=50,
        choices=LINK_PAGE_CHOICES,
        blank=True,
        null=True,
        help_text="Select the page that should open when button is clicked."
    )

    link_url = models.CharField(
        max_length=300,
        blank=True,
        help_text="Used only when Link Type = External URL"
    )

    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    image = models.ImageField(upload_to="homepage/service_features/", blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ["sort_order", "id"]

    # ---------- Mapping dictionaries ----------

    CMS_MAP = {
        "about": "/about/",
        "contact": "/contact/",
        "privacy": "/privacy/",
        "terms": "/terms/",
        "shipping": "/shipping/",
        "returns": "/returns/",
    }

    SYSTEM_MAP = {
        "track-order": "/track-order/",
        "orders-returns": "/orders-returns/",
        "sitemap": "/sitemap/",
        "cart": "/cart/",
        "wishlist": "/wishlist/",
        "my-orders": "/my-orders/",
    }

    SHOP_MAP = {
        "shop": "/shop/",
        "all-products": "/all-products/",
    }

    # ---------- AUTO URL LOGIC ----------

    def save(self, *args, **kwargs):

        # External URL → manual
        if self.link_type == "external":
            pass

        # CMS / SYSTEM / SHOP → auto mapping
        elif self.link_type in ["cms", "system", "shop"] and self.link_page:
            group, key = self.link_page.split(":")

            if group == "CMS":
                self.link_url = self.CMS_MAP[key]

            elif group == "SYS":
                self.link_url = self.SYSTEM_MAP[key]

            elif group == "SHOP":
                self.link_url = self.SHOP_MAP[key]

        super().save(*args, **kwargs)

    # IMAGE PRIORITY
    def get_display_image(self):
        if self.image:
            return self.image.url
        if self.image_url:
            return self.image_url
        return None

    def __str__(self):
        return self.title





# Auto icon suggestions based on name
AUTO_ICONS = {
    "home": "home",
    "gift": "gifts",
    "valentine": "gifts",
    "fashion": "fashion",
    "beauty": "beauty",
    "coffee": "coffee mugs",
    "mug": "coffee mugs",
    "jewelry": "jewelry",
    "accessories": "jewelry",
    "decor": "home decor",
    "lamp": "home decor",
    "sale": "sale",
}

class BottomNavCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.CharField(max_length=120, unique=True, blank=True)
    icon_name = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        """ Limit maximum 10 items only when creating a new record """
        if not self.pk and BottomNavCategory.objects.count() >= 10:
            raise ValueError("❌ You can add only 10 bottom navbar categories.")

    def save(self, *args, **kwargs):
        # Max limit check
        self.clean()

        # Auto slug
        if not self.slug:
            self.slug = slugify(self.name)

        # Auto icon detect (only if admin left empty)
        if not self.icon_name:
            lower = self.name.lower()
            for key, icon in AUTO_ICONS.items():
                if key in lower:
                    self.icon_name = icon
                    break

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
