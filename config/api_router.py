from django.conf import settings
from django.urls import include, path
from rest_framework.routers import DefaultRouter, SimpleRouter

from freeheat_test.energy_prices.api.views import EnergyPriceLogViewSet, UserCarChargeLogViewSet, UserCarViewSet
from freeheat_test.users.api.views import UserViewSet
from freeheat_test.users.views import RegistrationView

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("energy-logs", EnergyPriceLogViewSet)
router.register("user-cars", UserCarViewSet)
router.register("user-car-charge-logs", UserCarChargeLogViewSet)


app_name = "api"
urlpatterns = router.urls

urlpatterns += [
    path("dj-rest-auth/", include("dj_rest_auth.urls")),
    path("dj-rest-auth/register/", RegistrationView.as_view(), name="register"),
]
