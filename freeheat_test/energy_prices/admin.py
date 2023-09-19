from django.contrib import admin

from freeheat_test.energy_prices.models import EnergyPriceLog, UserCar, UserCarChargeLog


@admin.register(EnergyPriceLog)
class EnergyPriceLogAdmin(admin.ModelAdmin):
    list_display = ("id", "created_at", "price")


@admin.register(UserCar)
class UserCarAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "model", "year", "max_energy", "current_energy", "is_charging", "is_active", "owner"]
    search_fields = ["name"]


@admin.register(UserCarChargeLog)
class UserCarChargeLogAdmin(admin.ModelAdmin):
    list_display = ["id", "user_car", "energy", "is_charging"]
    search_fields = ["user_car__name"]
