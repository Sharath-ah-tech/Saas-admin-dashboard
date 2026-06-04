from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import (
    AdminUser,
    LoggedInUser,
    NotificationRule,
    Payment,
    PaymentMethod,
    Plan,
    Subscription,
    SystemSetting,
    Tenant,
)
from .serializers import (
    AdminDashboardSerializer,
    AdminUserSerializer,
    GoogleLoginSerializer,
    LoggedInUserSerializer,
    NotificationSerializer,
    PaymentMethodSerializer,
    PaymentSerializer,
    PlanSerializer,
    SettingSerializer,
    SubscriptionSerializer,
    TenantSerializer,
)
from .services import build_dashboard_payload, ensure_seed_data


# ─────────────────────────────────────────────
# ViewSets
# ─────────────────────────────────────────────

class SeededModelViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        ensure_seed_data()
        return super().get_queryset()


class TenantViewSet(SeededModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


class AdminUserViewSet(SeededModelViewSet):
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer


class PlanViewSet(SeededModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer


class SubscriptionViewSet(SeededModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer


class PaymentViewSet(SeededModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class PaymentMethodViewSet(SeededModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer


class NotificationViewSet(SeededModelViewSet):
    queryset = NotificationRule.objects.all()
    serializer_class = NotificationSerializer


class SettingViewSet(SeededModelViewSet):
    queryset = SystemSetting.objects.all()
    serializer_class = SettingSerializer


class LoggedInUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LoggedInUser.objects.all()
    serializer_class = LoggedInUserSerializer


# ─────────────────────────────────────────────
# Dashboard
# ─────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def health(_request):
    return Response({"status": "ok", "service": "django-rest-framework-api"})


@api_view(["GET"])
def admin_dashboard(_request):
    serializer = AdminDashboardSerializer(build_dashboard_payload())
    return Response(serializer.data)


@api_view(["GET"])
def dashboard_summary(request):
    return admin_dashboard(request._request)


# ─────────────────────────────────────────────
# Auth — Email / Password (superuser)
# ─────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([AllowAny])
def email_login(request):
    """
    Authenticate Django superuser (or staff) with email + password.
    The Django auth backend uses `username`; email is stored there for superusers
    created via `createsuperuser`, or use the email field if you set USERNAME_FIELD.
    We try both username=email and the email field lookup.
    """
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")

    if not email or not password:
        return Response({"detail": "Email and password are required."}, status=400)

    # Try authenticating; Django's default backend uses username
    user = authenticate(request._request, username=email, password=password)

    # If that failed, look up by email field and retry
    if user is None:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            db_user = User.objects.get(email__iexact=email)
            user = authenticate(request._request, username=db_user.username, password=password)
        except User.DoesNotExist:
            pass

    if user is None:
        return Response({"detail": "Invalid email or password."}, status=401)

    if not (user.is_staff or user.is_superuser):
        return Response({"detail": "Admin access required."}, status=403)

    login(request._request, user)

    # Upsert LoggedInUser record
    user_id = f"su_{user.pk}"
    logged_user, _ = LoggedInUser.objects.update_or_create(
        email=user.email,
        defaults={
            "id": user_id,
            "name": user.get_full_name() or user.username,
            "provider": "email",
        },
    )

    AdminUser.objects.update_or_create(
        email=user.email,
        defaults={
            "id": f"usr_{user_id}",
            "name": user.get_full_name() or user.username,
            "role": "Superuser" if user.is_superuser else "Staff",
            "company": "Internal",
            "status": "Active",
            "mfa": False,
            "last_seen": "Just now",
        },
    )

    return Response(LoggedInUserSerializer(logged_user).data, status=200)


@api_view(["POST"])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request._request)
    return Response({"detail": "Logged out."})


@api_view(["GET"])
def current_user(request):
    """Return the currently authenticated user's LoggedInUser record."""
    user = request.user
    if not user.is_authenticated:
        return Response({"detail": "Not authenticated."}, status=401)
    try:
        logged_user = LoggedInUser.objects.get(email=user.email)
        return Response(LoggedInUserSerializer(logged_user).data)
    except LoggedInUser.DoesNotExist:
        return Response({"detail": "User record not found."}, status=404)


# ─────────────────────────────────────────────
# Auth — Google OAuth (token-based for SPA)
# ─────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def google_oauth_url(request):
    """Return the Google OAuth redirect URL so the frontend can initiate the flow."""
    from django.urls import reverse
    try:
        url = request.build_absolute_uri(
            reverse("social:begin", args=["google-oauth2"])
        )
        return Response({"url": url})
    except Exception:
        return Response({"url": "/login/google-oauth2/"})


@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    """
    Legacy endpoint: store a Google login coming from the frontend
    (used when Google Sign-In JS SDK returns an id_token or profile).
    """
    serializer = GoogleLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    user_id = f"google_{data['email'].lower().replace('@', '_at_')}"
    user, _created = LoggedInUser.objects.update_or_create(
        email=data["email"],
        defaults={
            "id": user_id,
            "name": data["name"],
            "avatar_url": data.get("avatar_url", ""),
            "provider": "google",
            "google_subject": data.get("google_subject", ""),
        },
    )

    AdminUser.objects.update_or_create(
        email=data["email"],
        defaults={
            "id": f"usr_{user_id}",
            "name": data["name"],
            "role": "Admin",
            "company": "Google Workspace",
            "status": "Active",
            "mfa": True,
            "last_seen": "Just now",
        },
    )

    return Response(LoggedInUserSerializer(user).data, status=201)