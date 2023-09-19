from rest_framework import serializers

from freeheat_test.energy_prices.models import EnergyPriceLog, UserCar


class UserCarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCar
        exclude = ["created_at", "updated_at"]
        read_only_fields = ["owner"]

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)


class EnergyPriceLogModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyPriceLog
        exclude = ["created_at"]
