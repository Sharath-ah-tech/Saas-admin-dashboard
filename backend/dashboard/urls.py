from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views


router = DefaultRouter()
router.register("tenants", views.TenantViewSet)
router.register("users", views.AdminUserViewSet)
router.register("plans", views.PlanViewSet)
router.register("subscriptions", views.SubscriptionViewSet)
router.register("payments", views.PaymentViewSet)
router.register("payment-methods", views.PaymentMethodViewSet)
router.register("notifications", views.NotificationViewSet)
router.register("settings", views.SettingViewSet)
router.register("logged-in-users", views.LoggedInUserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("health/", views.health, name="health"),
    path("admin-dashboard/", views.admin_dashboard, name="admin-dashboard"),
    path("dashboard/summary/", views.dashboard_summary, name="dashboard-summary"),
    path("auth/google-login/", views.google_login, name="google-login"),
]
