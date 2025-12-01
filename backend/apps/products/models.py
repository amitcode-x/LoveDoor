from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator


# =========================================================
# CATEGORY
# =========================================================
class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    description = models.TextField(blank=True)
    banner_image = models.URLField(blank=True, null=True)  # For category page banner
    is_active = models.BooleanField(default=True)
    category_image = models.ImageField(upload_to="category/", blank=True, null=True, help_text="Optional — If provided, this image will be used.")
    category_icon = models.ImageField(upload_to="category/icons/", blank=True, null=True,help_text="Optional — If provided, this image will be used.")
    
        # ✅ NEW: image by URL (2nd priority)
    category_image_url = models.URLField(
        blank=True,
        null=True,
        help_text="Optional image URL for category (used if no uploaded image)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# =========================================================
# PRODUCT
# =========================================================
class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products"
    )

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=210, unique=True, blank=True)

    short_description = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    # Stock & flags
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
        # ⭐ NEW: admin mark manually
    is_new = models.BooleanField(default=False)

    # Thumbnail MANDATORY (no product will save without this)
    thumbnail = models.URLField(blank=False, null=False)

    # ⭐ Admin initial seed rating
    initial_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        help_text="Admin seed rating (1-5 stars)"
    )
    initial_rating_count = models.PositiveIntegerField(
        default=0,
        help_text="Admin assumed number of initial reviewers"
    )

    # ⭐ Auto-calculated rating values (updated via signals)
    average_rating = models.FloatField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    total_reviews = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def is_new_auto(self):
        from django.utils.timezone import now
        return (now() - self.created_at).days <= 10
    
    @property
    def show_new_badge(self):
        # ⭐ अगर admin ने mark किया है → हमेशा true
        if self.is_new:
            return True
        # ⭐ auto logic (last 10 days)
        return self.is_new_auto()

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["slug"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def effective_price(self):
        """Returns discounted price if exists, else original price."""
        if self.discount_price:
            return self.discount_price
        return self.price


# =========================================================
# PRODUCT IMAGES
# =========================================================
class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="images",
        on_delete=models.CASCADE
    )
    image_url = models.URLField()
    alt_text = models.CharField(max_length=255, blank=True)
    is_main = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_main", "id"]  # main image first

    def __str__(self):
        return f"Image for {self.product.name}"


# =========================================================
# USER REVIEWS
# =========================================================
class ProductReview(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="reviews",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=150)
    email = models.EmailField()
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review_text = models.TextField(blank=True)  # OPTIONAL

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review for {self.product.name} by {self.name}"
