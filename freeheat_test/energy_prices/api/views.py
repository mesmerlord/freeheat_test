from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from freeheat_test.energy_prices.api.serializers import UserCarModelSerializer
from freeheat_test.energy_prices.models import UserCar
from freeheat_test.utils.pagination import CustomPageNumberPagination


class UserCarViewSet(viewsets.ModelViewSet):
    queryset = UserCar.objects.all()
    serializer_class = UserCarModelSerializer
    permission_classes = []
    ordering_fields = [
        "created_at",
    ]

    pagination_class = CustomPageNumberPagination
