from django.db import models
from django.utils import timezone

# Create your models here.

class Resource(models.Model):
    STATUS_CHOICES = [
        ('available', 'Доступний'),
        ('reserved', 'Зарезервований'),
        ('depleted', 'Вичерпаний'),
    ]
    
    name = models.CharField(max_length=255, verbose_name="Назва")
    category = models.CharField(max_length=100, verbose_name="Категорія")
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Кількість")
    unit = models.CharField(max_length=50, verbose_name="Одиниця виміру")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', verbose_name="Статус")
    date_added = models.DateTimeField(default=timezone.now, verbose_name="Дата додавання")
    added_by = models.CharField(max_length=100, verbose_name="Хто додав")
    organization = models.CharField(max_length=255, verbose_name="Організація")
    expiry_date = models.DateField(null=True, blank=True, verbose_name="Термін придатності")
    storage_location = models.CharField(max_length=255, verbose_name="Місце зберігання")
    comment = models.TextField(blank=True, null=True, verbose_name="Коментар")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Ресурс"
        verbose_name_plural = "Ресурси"
