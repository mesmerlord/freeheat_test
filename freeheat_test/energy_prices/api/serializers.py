from rest_framework import serializers

from freeheat_test.energy_prices.models import EnergyPriceLog, UserCar


class UserCarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCar
        fields = "__all__"


class EnergyPriceLogModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyPriceLog
        fields = "__all__"
