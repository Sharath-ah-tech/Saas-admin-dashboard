from rest_framework import serializers

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


class MetricSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.CharField()
    change = serializers.CharField()
    tone = serializers.ChoiceField(choices=["positive", "negative"])


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ["id", "name", "subdomain", "status"]


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ["id", "tenant", "name", "email", "role", "company", "status", "mfa", "last_seen"]


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ["id", "name", "price", "interval", "customers", "features", "status"]


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ["id", "tenant", "customer", "plan", "status", "billing_cycle", "renewal_date", "mrr", "payment_method"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "tenant", "provider", "customer", "amount", "method", "status", "captured", "settlement"]


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["id", "provider", "mode", "capabilities", "status"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationRule
        fields = ["id", "channel", "title", "audience", "status"]


class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = ["id", "tenant", "group", "label", "value"]


class LoggedInUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoggedInUser
        fields = ["id", "email", "name", "avatar_url", "provider", "google_subject", "last_login_at"]


class GoogleLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField()
    avatar_url = serializers.URLField(required=False, allow_blank=True)
    google_subject = serializers.CharField(required=False, allow_blank=True)
    id_token = serializers.CharField(required=False, allow_blank=True, write_only=True)


class RevenuePointSerializer(serializers.Serializer):
    month = serializers.CharField()
    value = serializers.IntegerField()


class FunnelSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.CharField()
    change = serializers.CharField()


class SegmentSerializer(serializers.Serializer):
    name = serializers.CharField()
    count = serializers.IntegerField()
    signal = serializers.CharField()
    priority = serializers.CharField()


class AnalyticsSerializer(serializers.Serializer):
    revenue = RevenuePointSerializer(many=True)
    funnels = FunnelSerializer(many=True)
    segments = SegmentSerializer(many=True)


class AdminDashboardSerializer(serializers.Serializer):
    metrics = MetricSerializer(many=True)
    tenants = TenantSerializer(many=True)
    users = AdminUserSerializer(many=True)
    plans = PlanSerializer(many=True)
    subscriptions = SubscriptionSerializer(many=True)
    payments = PaymentSerializer(many=True)
    analytics = AnalyticsSerializer()
    notifications = NotificationSerializer(many=True)
    settings = SettingSerializer(many=True)
    payment_methods = PaymentMethodSerializer(many=True)
