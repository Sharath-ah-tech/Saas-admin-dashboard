from django.contrib import admin

from .models import (
    AdminUser,
    LoggedInUser,
    NotificationRule,
    Payment,
    PaymentMethod,
    Plan,
    Subscription,
    SystemSetting,
)


admin.site.register(AdminUser)
admin.site.register(Plan)
admin.site.register(Subscription)
admin.site.register(Payment)
admin.site.register(PaymentMethod)
admin.site.register(NotificationRule)
admin.site.register(SystemSetting)
admin.site.register(LoggedInUser)
