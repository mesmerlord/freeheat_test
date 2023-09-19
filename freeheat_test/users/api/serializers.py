from django.contrib.auth import get_user_model
from rest_framework import serializers

from freeheat_test.users.models import User as UserType
from dj_rest_auth.registration.serializers import RegisterSerializer


User = get_user_model()


class UserSerializer(serializers.ModelSerializer[UserType]):
    class Meta:
        model = User
        fields = ["username", "name", "url"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "username"},
        }


class RegistrationSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    def custom_signup(self, request, user):
        user.name = self.validated_data.get("first_name", "") + " " + self.validated_data.get("last_name", "")
        user.save(update_fields=["name"])
