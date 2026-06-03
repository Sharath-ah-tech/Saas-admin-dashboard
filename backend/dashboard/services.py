import re

from .data import ADMIN_DASHBOARD
from .models import (
    AdminUser,
    NotificationRule,
    Payment,
    PaymentMethod,
    Plan,
    Subscription,
    SystemSetting,
    Tenant,
)


def ensure_seed_data():
    if Tenant.objects.exists():
        return

    # Create tenants first
    Tenant.objects.bulk_create(Tenant(**item) for item in ADMIN_DASHBOARD["tenants"])

    # Create other models linked to tenants
    AdminUser.objects.bulk_create(AdminUser(**item) for item in ADMIN_DASHBOARD["users"])
    Plan.objects.bulk_create(Plan(**item) for item in ADMIN_DASHBOARD["plans"])
    Subscription.objects.bulk_create(Subscription(**item) for item in ADMIN_DASHBOARD["subscriptions"])
    Payment.objects.bulk_create(Payment(**item) for item in ADMIN_DASHBOARD["payments"])
    PaymentMethod.objects.bulk_create(
        PaymentMethod(id=f"pm_{item['provider'].lower()}", **item)
        for item in ADMIN_DASHBOARD["payment_methods"]
    )
    NotificationRule.objects.bulk_create(NotificationRule(**item) for item in ADMIN_DASHBOARD["notifications"])
    SystemSetting.objects.bulk_create(
        SystemSetting(id=f"set_{index + 1:03d}", **item)
        for index, item in enumerate(ADMIN_DASHBOARD["settings"])
    )


def money_to_number(value):
    match = re.sub(r"[^0-9.]", "", value or "")
    return float(match) if match else 0


def format_currency(value):
    if value >= 1000:
        return f"${value / 1000:.1f}K"

    return f"${value:,.0f}"


def build_dashboard_payload():
    ensure_seed_data()

    tenants = list(Tenant.objects.all())
    users = list(AdminUser.objects.all())
    plans = list(Plan.objects.all())
    subscriptions = list(Subscription.objects.all())
    payments = list(Payment.objects.all())
    payment_methods = list(PaymentMethod.objects.all())
    notifications = list(NotificationRule.objects.all())
    settings = list(SystemSetting.objects.all())

    mrr_total = sum(money_to_number(subscription.mrr) for subscription in subscriptions)
    failed_payments = sum(1 for payment in payments if payment.status != "Succeeded")
    active_users = sum(1 for user in users if user.status == "Active")
    active_subscriptions = sum(1 for subscription in subscriptions if subscription.status == "Active")
    retention = 100 + min(active_subscriptions * 4, 24)

    dashboard = {
        "metrics": [
            {
                "label": "Monthly recurring revenue",
                "value": format_currency(mrr_total),
                "change": "+14.8%",
                "tone": "positive",
            },
            {
                "label": "Active users",
                "value": f"{active_users:,}",
                "change": "+9.1%",
                "tone": "positive",
            },
            {
                "label": "Net retention",
                "value": f"{retention}%",
                "change": "+3.4%",
                "tone": "positive",
            },
            {
                "label": "Failed payments",
                "value": f"{failed_payments}",
                "change": "-11.5%",
                "tone": "positive" if failed_payments < 5 else "negative",
            },
        ],
        "tenants": tenants,
        "users": users,
        "plans": plans,
        "subscriptions": subscriptions,
        "payments": payments,
        "analytics": ADMIN_DASHBOARD["analytics"],
        "notifications": notifications,
        "settings": settings,
        "payment_methods": payment_methods,
    }

    revenue = dashboard["analytics"]["revenue"]
    if revenue:
        revenue[-1] = {"month": revenue[-1]["month"], "value": int(mrr_total / 1000)}

    return dashboard

