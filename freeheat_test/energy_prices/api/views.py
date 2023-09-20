import csv
from datetime import datetime, timedelta
from decimal import Decimal

from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from freeheat_test.energy_prices.api.serializers import (
    EnergyPriceLogModelSerializer,
    UserCarChargeLogModelSerializer,
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

    parser_classes = (MultiPartParser,)

    @extend_schema(
        description="Upload CSV and seed the EnergyPriceLog model.",
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "file": {"type": "string", "format": "binary", "description": "CSV file containing energy prices."}
                },
                "required": ["file"],
            }
        },
        responses={201: "Data imported successfully.", 400: "Bad request."},
    )
    @action(detail=False, methods=["POST"])
    def upload_csv(self, request):
        if "file" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"detail": "CSV file is required."})

        file = request.data["file"].read().decode("utf-8")
        reader = csv.DictReader(file.splitlines())

        for row in reader:
            days_ago = int(row["Day"])

            # Extract the hour from the Hour column
            hour = int(row["Hour"].split(":")[0])

            price = Decimal(row["EUR/KWH"])  # ensure the price is of Decimal type

            # Calculate the datetime for the energy price log, mock this data to from 3 days ago
            created_at = datetime.now() - timedelta(days=days_ago - 3)

            # Set the correct hour, and zero out minutes, seconds, and microseconds
            created_at = created_at.replace(hour=hour, minute=0, second=0, microsecond=0)
            log_obj = EnergyPriceLog.objects.create(price=price, created_at=created_at)
            log_obj.created_at = created_at
            log_obj.save()

        return Response(status=status.HTTP_201_CREATED, data={"detail": "Data imported successfully."})


class UserCarChargeLogViewSet(viewsets.GenericViewSet, viewsets.mixins.ListModelMixin):
    queryset = UserCarChargeLog.objects.all()
    serializer_class = UserCarChargeLogModelSerializer
    permission_classes = []
    ordering_fields = [
        "created_at",
    ]

    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                user_car__owner=self.request.user,
            )
        )
