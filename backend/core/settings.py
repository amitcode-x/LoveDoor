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

# Build paths inside the project
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

# ⭐ ADD THIS → LOAD GOOGLE CLIENT ID FROM .env
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# --------------------------------------------
# DEBUG & ALLOWED HOSTS
# --------------------------------------------
DEBUG = True
ALLOWED_HOSTS = ["*"]

# --------------------------------------------
# APPLICATIONS
# --------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'corsheaders',
    'django_extensions',

    # Custom Apps
    'apps.users',
    'apps.products',
    'apps.orders',
    'apps.payments',
    'apps.adminpanel',
    'apps.wishlist',
    'apps.homepage',
    'apps.footer',
    
    
     "cloudinary",
    "cloudinary_storage",
]


# ==============================
# Cloudinary Configuration
# ==============================

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
)

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": os.environ.get("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": os.environ.get("CLOUDINARY_API_KEY"),
    "API_SECRET": os.environ.get("CLOUDINARY_API_SECRET"),
}


# ==============================
# Django 4.2+ Storage Configuration (REQUIRED)
# ==============================

STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}




# --------------------------------------------
# MIDDLEWARE
# --------------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    # CORS Middleware (MUST be at top)
    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# --------------------------------------------
# DATABASE (Using ENV Variables)
# --------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': os.getenv("DB_HOST"),
        'PORT': os.getenv("DB_PORT"),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
        }
    }
}

# --------------------------------------------
# PASSWORD VALIDATION
# --------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --------------------------------------------
# INTERNATIONALIZATION
# --------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --------------------------------------------
# STATIC & MEDIA FILES
# --------------------------------------------
STATIC_URL = "/static/"
# ==============================
# Cloudinary Media Storage
# ==============================


MEDIA_URL = "/media/"
# MEDIA_ROOT = BASE_DIR / "media"

# --------------------------------------------
# REST FRAMEWORK + JWT
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
# EMAIL SETTINGS
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
if os.getenv("DJANGO_PRODUCTION") == "true":
    BACKEND_BASE_URL = "https://your-domain.com"
else:
    BACKEND_BASE_URL = "http://127.0.0.1:8000"

# --------------------------------------------
# CORS SETTINGS (VERY IMPORTANT)
# --------------------------------------------
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
