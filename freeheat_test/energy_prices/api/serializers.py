from rest_framework import serializers

from freeheat_test.energy_prices.models import EnergyPriceLog, UserCar, UserCarChargeLog


class UserCarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCar
        exclude = ["created_at", "updated_at"]
        read_only_fields = ["owner"]

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)


class UserCarChargeLogModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCarChargeLog
        exclude = ["updated_at"]


class UserCarDetailModelSerializer(serializers.ModelSerializer):
    user_car_charge_logs = UserCarChargeLogModelSerializer(many=True, read_only=True)

    class Meta:
        model = UserCar
        fields = "__all__"


class EnergyPriceLogModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyPriceLog
        exclude = ["updated_at"]
