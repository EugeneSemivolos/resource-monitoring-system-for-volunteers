from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import Resource, Volunteer
from rest_framework import serializers
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, React & Django!"})

# Create serializer for the Resource model
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'

# Create API views
class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all().select_related()
    serializer_class = ResourceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'organization', 'storage_location']
    search_fields = ['name', 'comment', 'added_by', 'organization']
    ordering_fields = ['name', 'date_added', 'quantity', 'expiry_date']
    ordering = ['-date_added']  # По умолчанию сортировка по дате добавления (сначала новые)
    
    @method_decorator(cache_page(60*5))  # Кэширование на 5 минут
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @method_decorator(cache_page(60*60))  # Кэширование на 1 час
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

# Create serializer for the Volunteer model
class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}

# Create API view for Volunteer model
class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all().select_related('user')
    serializer_class = VolunteerSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'organization']
    search_fields = ['last_name', 'first_name', 'middle_name', 'skills', 'description', 'email', 'phone']
    ordering_fields = ['last_name', 'first_name', 'registration_date', 'last_login']
    ordering = ['last_name', 'first_name']  # По умолчанию сортировка по фамилии и имени
    
    @method_decorator(cache_page(60*5))  # Кэширование на 5 минут
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @method_decorator(cache_page(60*60))  # Кэширование на 1 час
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)