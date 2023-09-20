from rest_framework import viewsets

from freeheat_test.energy_prices.api.serializers import (
    EnergyPriceLogModelSerializer,
    UserCarDetailModelSerializer,
    UserCarModelSerializer,
)
from freeheat_test.energy_prices.models import EnergyPriceLog, UserCar, UserCarChargeLog
from freeheat_test.utils.pagination import CustomPageNumberPagination


class UserCarViewSet(viewsets.ModelViewSet):
    queryset = UserCar.objects.all()
    serializer_class = UserCarModelSerializer
    permission_classes = []
    ordering_fields = [
        "created_at",
    ]

    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.filter(owner=self.request.user)
        return queryset

    def get_serializer_class(self):
        if self.action in ["retrieve"]:
            return UserCarDetailModelSerializer
        return UserCarModelSerializer


class EnergyPriceLogViewSet(viewsets.GenericViewSet, viewsets.mixins.ListModelMixin):
    queryset = EnergyPriceLog.objects.all()
    serializer_class = EnergyPriceLogModelSerializer
    permission_classes = []
    ordering_fields = [
        "created_at",
    ]

    pagination_class = CustomPageNumberPagination
