"""
Django settings for core project.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta

import cloudinary
import cloudinary.uploader
import cloudinary.api

# --------------------------------------------
# LOAD THE .env FILE
# --------------------------------------------
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# --------------------------------------------
# ENV VARIABLES
# --------------------------------------------
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

NEWSLETTER_ADMIN_EMAIL = os.getenv("NEWSLETTER_ADMIN_EMAIL")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# --------------------------------------------
# DEBUG & ALLOWED HOSTS
# --------------------------------------------
DEBUG = os.getenv("DEBUG") == "True"

ALLOWED_HOSTS = [
    "lovedoor-backend.onrender.com",
    "127.0.0.1",
    "localhost",
]

# --------------------------------------------
# APPLICATIONS
# --------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",
    "django_extensions",

    "apps.users",
    "apps.products",
    "apps.orders",
    "apps.payments",
    "apps.adminpanel",
    "apps.wishlist",
    "apps.homepage",
    "apps.footer",

    "cloudinary",
    "cloudinary_storage",
]

# --------------------------------------------
# CLOUDINARY
# --------------------------------------------
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

# --------------------------------------------
# MIDDLEWARE  ✅ FIXED ORDER
# --------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    # ✅ MUST be before SessionMiddleware
    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# --------------------------------------------
# CSRF FIX  ✅ MOST IMPORTANT
# --------------------------------------------
CSRF_TRUSTED_ORIGINS = [
    "https://lovedoor.vercel.app",
    "https://*.vercel.app",
    "https://lovedoor-backend.onrender.com",
]

# --------------------------------------------
# URLS / WSGI
# --------------------------------------------
ROOT_URLCONF = "core.urls"
WSGI_APPLICATION = "core.wsgi.application"

# --------------------------------------------
# DATABASE
# --------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
        "OPTIONS": {
            "init_command": "SET sql_mode='STRICT_TRANS_TABLES'"
        },
    }
}

# --------------------------------------------
# PASSWORD VALIDATION
# --------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --------------------------------------------
# I18N
# --------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --------------------------------------------
# STATIC / MEDIA
# --------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"

# --------------------------------------------
# REST + JWT
# --------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
}

# --------------------------------------------
# EMAIL
# --------------------------------------------
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = EMAIL_HOST_PASSWORD

# --------------------------------------------
# BACKEND BASE URL
# --------------------------------------------
BACKEND_BASE_URL = (
    "https://lovedoor-backend.onrender.com"
    if os.getenv("DJANGO_PRODUCTION") == "true"
    else "http://127.0.0.1:8000"
)

# --------------------------------------------
# CORS
# --------------------------------------------
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
