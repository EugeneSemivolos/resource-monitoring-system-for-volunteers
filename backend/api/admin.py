from django.contrib import admin
from .models import Resource, Volunteer

# Register your models here.
@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'quantity', 'unit', 'status', 'date_added', 'added_by', 'storage_location')
    list_filter = ('status', 'category', 'organization')
    search_fields = ('name', 'category', 'added_by', 'organization', 'storage_location')
    date_hierarchy = 'date_added'
    fieldsets = (
        ('Основна інформація', {
            'fields': ('name', 'category', 'quantity', 'unit', 'status', 'photo')
        }),
        ('Деталі зберігання', {
            'fields': ('storage_location', 'organization', 'expiry_date')
        }),
        ('Додаткова інформація', {
            'fields': ('comment',)
        }),
        ('Службова інформація', {
            'fields': ('added_by', 'date_added'),
        }),
    )

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'email', 'phone', 'status', 'organization', 'registration_date', 'last_login')
    list_filter = ('status', 'registration_date', 'organization')
    search_fields = ('last_name', 'first_name', 'email', 'phone', 'telegram_id', 'skills', 'organization', 'description')
    date_hierarchy = 'registration_date'
    fieldsets = (
        ('Особиста інформація', {
            'fields': ('last_name', 'first_name', 'middle_name', 'photo')
        }),
        ('Контактна інформація', {
            'fields': ('phone', 'email', 'telegram_id')
        }),
        ('Додаткова інформація', {
            'fields': ('status', 'skills', 'description', 'organization')
        }),
        ('Системна інформація', {
            'fields': ('user', 'registration_date', 'last_login'),
            'classes': ('collapse',)
        }),
    )
