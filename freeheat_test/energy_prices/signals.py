import logging

from django.db.models.signals import pre_save
from django.dispatch import receiver

from freeheat_test.energy_prices.models import UserCar, UserCarChargeLog


@receiver(pre_save, sender=UserCar)
def log_user_car_charging(sender, instance, **kwargs):
    # If the car already exists and charging status has changed, log it
    try:
        original = UserCar.objects.get(id=instance.id)
        if original.is_charging != instance.is_charging:
            UserCarChargeLog.objects.create(
                user_car=instance, energy=instance.current_energy, is_charging=instance.is_charging
            )
            logging.info(f"Logged charging status change for car: {instance.name}")
    except UserCar.DoesNotExist:
        # This is likely the car's first creation, so no need to log
        logging.info(f"Car: {instance.name} is being created, no need to log charging status change")
        pass
