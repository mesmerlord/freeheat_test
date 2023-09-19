from rest_framework import serializers

from freeheat_test.energy_prices.models import UserCar


class UserCarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCar
        fields = "__all__"
