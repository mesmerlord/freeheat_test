from django.db import models

from freeheat_test.users.models import User
from freeheat_test.utils.abstract_models import AbstractClient


class UserCar(AbstractClient):
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    year = models.IntegerField()
    max_energy = models.DecimalField(max_digits=10, decimal_places=2)
    current_energy = models.DecimalField(max_digits=10, decimal_places=2)
    is_charging = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_cars")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "User Car"
        verbose_name_plural = "User Cars"
        ordering = ["name"]
        unique_together = ("name", "model", "year", "owner")


class UserCarChargeLog(AbstractClient):
    user_car = models.ForeignKey(UserCar, on_delete=models.CASCADE, related_name="user_car_charge_logs")
    energy = models.DecimalField(max_digits=10, decimal_places=2)
    is_charging = models.BooleanField(default=False)

    def __str__(self):
        return self.user_car.name

    class Meta:
        verbose_name = "User Car Horuly Charge Log"
        verbose_name_plural = "User Car Charge Logs"
        ordering = ["user_car"]


class EnergyPriceLog(AbstractClient):
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return str(self.price)

    class Meta:
        verbose_name = "Energy Price Log"
        verbose_name_plural = "Energy Price Logs"
        ordering = ["price"]
        unique_together = ["price"]
