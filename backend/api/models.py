from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.

class Resource(models.Model):
    STATUS_CHOICES = [
        ('available', 'Доступний'),
        ('reserved', 'Зарезервований'),
        ('depleted', 'Вичерпаний'),
    ]
    
    CATEGORY_CHOICES = [
        ('медичні засоби', 'Медичні засоби'),
        ('спорядження', 'Спорядження'),
        ('продукти', 'Продукти'),
        ('обладнання', 'Обладнання'),
        ('одяг', 'Одяг'),
        ('інше', 'Інше'),
    ]
    
    name = models.CharField(max_length=255, verbose_name="Назва")
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='інше', verbose_name="Категорія")
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Кількість")
    unit = models.CharField(max_length=50, verbose_name="Одиниця виміру")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', verbose_name="Статус")
    date_added = models.DateTimeField(default=timezone.now, verbose_name="Дата додавання")
    added_by = models.CharField(max_length=100, verbose_name="Хто додав")
    organization = models.CharField(max_length=255, verbose_name="Організація")
    expiry_date = models.DateField(null=True, blank=True, verbose_name="Термін придатності")
    storage_location = models.CharField(max_length=255, verbose_name="Місце зберігання")
    comment = models.TextField(blank=True, null=True, verbose_name="Коментар")
    photo = models.ImageField(upload_to='resource_photos/', blank=True, null=True, verbose_name="Фото")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Ресурс"
        verbose_name_plural = "Ресурси"

class Volunteer(models.Model):
    STATUS_CHOICES = [
        ('active', 'Активний'),
        ('inactive', 'Неактивний'),
        ('pending', 'Очікує підтвердження'),
        ('blocked', 'Заблокований'),
    ]
    
    last_name = models.CharField(max_length=100, verbose_name="Прізвище")
    first_name = models.CharField(max_length=100, verbose_name="Ім'я")
    middle_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="По Батькові")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    email = models.EmailField(max_length=100, verbose_name="Email")
    telegram_id = models.CharField(max_length=100, blank=True, null=True, verbose_name="Telegram ID")
    registration_date = models.DateTimeField(default=timezone.now, verbose_name="Дата реєстрації")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Статус")
    skills = models.TextField(blank=True, null=True, verbose_name="Навички")
    description = models.TextField(blank=True, null=True, verbose_name="Опис")
    organization = models.CharField(max_length=255, blank=True, null=True, verbose_name="Організація")
    photo = models.ImageField(upload_to='volunteer_photos/', blank=True, null=True, verbose_name="Фото")
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True, verbose_name="Користувач")
    last_login = models.DateTimeField(blank=True, null=True, verbose_name="Останній вхід")
    
    def __str__(self):
        return f"{self.last_name} {self.first_name}"
    
    class Meta:
        verbose_name = "Волонтер"
        verbose_name_plural = "Волонтери"
