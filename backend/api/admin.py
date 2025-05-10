from django.contrib import admin
from .models import Resource

# Register your models here.
@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'quantity', 'unit', 'status', 'date_added', 'added_by', 'storage_location')
    list_filter = ('status', 'category', 'organization')
    search_fields = ('name', 'category', 'added_by', 'organization', 'storage_location')
    date_hierarchy = 'date_added'
