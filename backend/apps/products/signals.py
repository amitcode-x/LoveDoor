# backend/apps/products/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count

from .models import ProductReview, Product


@receiver([post_save, post_delete], sender=ProductReview)
def update_product_rating(sender, instance, **kwargs):
    """
    Jab bhi koi review add / update / delete hoga,
    ye function uss product ki average rating aur total_reviews update karega.
    """
    product = instance.product

    # 1️⃣ User reviews ka aggregate
    agg = product.reviews.aggregate(
        user_avg=Avg("rating"),
        user_count=Count("id")
    )

    user_avg = agg["user_avg"] or 0
    user_count = agg["user_count"] or 0

    # 2️⃣ Admin ka initial rating part
    #    e.g. initial_rating = 4.5, initial_rating_count = 20
    #    => admin_total = 4.5 * 20
    admin_total = float(product.initial_rating) * product.initial_rating_count
    admin_count = product.initial_rating_count

    # 3️⃣ User ratings ka total = avg * count
    user_total = float(user_avg) * user_count

    total_people = admin_count + user_count

    if total_people > 0:
        combined_avg = (admin_total + user_total) / total_people
    else:
        combined_avg = 0

    # 4️⃣ Product fields update
    product.average_rating = round(combined_avg, 2)
    product.total_reviews = total_people  # admin count + user count

    product.save(update_fields=["average_rating", "total_reviews"])
