from django.apps import AppConfig


class EnergyPricesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "freeheat_test.energy_prices"

    def ready(self):
        try:
            import freeheat_test.energy_prices.signals  # noqa: F401
        except ImportError:
            pass
