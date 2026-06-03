from uuid import uuid4

from rest_framework import viewsets
from rest_framework.decorators import api_view
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


@api_view(["GET"])
def health(_request):
    return Response({"status": "ok", "service": "django-rest-framework-api"})


@api_view(["GET"])
def admin_dashboard(_request):
    serializer = AdminDashboardSerializer(build_dashboard_payload())
    return Response(serializer.data)


@api_view(["GET"])
def dashboard_summary(request):
    return admin_dashboard(request._request)


@api_view(["POST"])
def google_login(request):
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
