from django.db import models


class Tenant(models.Model):
    id = models.CharField(max_length=40, primary_key=True)
    name = models.CharField(max_length=140)
    subdomain = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=40, default="Active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class AdminUser(models.Model):
    id = models.CharField(max_length=40, primary_key=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="users", null=True, blank=True)
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=80)
    company = models.CharField(max_length=140)
    status = models.CharField(max_length=40, default="Active")
    mfa = models.BooleanField(default=False)
    last_seen = models.CharField(max_length=80, default="Just now")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Plan(models.Model):
    id = models.CharField(max_length=40, primary_key=True)
    name = models.CharField(max_length=80)
    price = models.CharField(max_length=40)
    interval = models.CharField(max_length=40, default="Monthly")
    customers = models.PositiveIntegerField(default=0)
    features = models.JSONField(default=list)
    status = models.CharField(max_length=40, default="Public")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Subscription(models.Model):
    id = models.CharField(max_length=40, primary_key=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="subscriptions", null=True, blank=True)
    customer = models.CharField(max_length=140)
    plan = models.CharField(max_length=80)
    status = models.CharField(max_length=40, default="Active")
    billing_cycle = models.CharField(max_length=40, default="Monthly")
    renewal_date = models.DateField()
    mrr = models.CharField(max_length=40)
    payment_method = models.CharField(max_length=80)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["renewal_date", "customer"]

    def __str__(self):
        return f"{self.customer} - {self.plan}"


class Payment(models.Model):
    id = models.CharField(max_length=40, primary_key=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="payments", null=True, blank=True)
    provider = models.CharField(max_length=60)
    customer = models.CharField(max_length=140)
    amount = models.CharField(max_length=40)
    method = models.CharField(max_length=100)
    status = models.CharField(max_length=60, default="Succeeded")
    captured = models.BooleanField(default=True)
    settlement = models.CharField(max_length=80, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "customer"]

    def __str__(self):
        return f"{self.provider} {self.amount}"


class PaymentMethod(models.Model):
    id = models.CharField(max_length=40, primary_key=True)
    provider = models.CharField(max_length=60)
    mode = models.CharField(max_length=40, default="Test")
    capabilities = models.JSONField(default=list)
    status = models.CharField(max_length=40, default="Connected")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["provider"]

    def __str__(self):
        return self.provider


class NotificationRule(models.Model):
    id = models.CharField(max_length=40, primary_key=True)
    channel = models.CharField(max_length=40)
    title = models.CharField(max_length=140)
    audience = models.CharField(max_length=140)
    status = models.CharField(max_length=40, default="Enabled")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["channel", "title"]

    def __str__(self):
        return self.title


class SystemSetting(models.Model):
    id = models.CharField(max_length=40, primary_key=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="settings", null=True, blank=True)
    group = models.CharField(max_length=80)
    label = models.CharField(max_length=140)
    value = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["group", "label"]

    def __str__(self):
        return f"{self.group}: {self.label}"


class LoggedInUser(models.Model):
    id = models.CharField(max_length=80, primary_key=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=120)
    avatar_url = models.URLField(blank=True)
    provider = models.CharField(max_length=40, default="google")
    google_subject = models.CharField(max_length=120, blank=True)
    last_login_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-last_login_at"]

    def __str__(self):
        return self.email

