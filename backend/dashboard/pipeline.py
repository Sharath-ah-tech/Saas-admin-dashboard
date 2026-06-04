from .models import AdminUser, LoggedInUser


def save_logged_in_user(backend, user, response, *args, **kwargs):
    """
    After Google OAuth succeeds, upsert LoggedInUser and AdminUser
    so the dashboard surfaces this login.
    """
    if backend.name != "google-oauth2":
        return

    email = user.email
    name = user.get_full_name() or email
    avatar_url = response.get("picture", "")
    google_subject = response.get("sub", "")
    user_id = f"google_{email.lower().replace('@', '_at_')}"

    LoggedInUser.objects.update_or_create(
        email=email,
        defaults={
            "id": user_id,
            "name": name,
            "avatar_url": avatar_url,
            "provider": "google",
            "google_subject": google_subject,
        },
    )

    AdminUser.objects.update_or_create(
        email=email,
        defaults={
            "id": f"usr_{user_id}",
            "name": name,
            "role": "Admin",
            "company": "Google Workspace",
            "status": "Active",
            "mfa": True,
            "last_seen": "Just now",
        },
    )