from django.test import TestCase
from django.urls import reverse


class DashboardApiTests(TestCase):
    def test_health_endpoint(self):
        response = self.client.get(reverse("health"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_summary_endpoint(self):
        response = self.client.get(reverse("dashboard-summary"))
        payload = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertIn("metrics", payload)
        self.assertIn("tenants", payload)
        self.assertIn("users", payload)
        self.assertIn("plans", payload)
        self.assertIn("subscriptions", payload)
        self.assertIn("payments", payload)
        self.assertIn("analytics", payload)
        self.assertIn("notifications", payload)
        self.assertIn("settings", payload)
        self.assertIn("payment_methods", payload)
