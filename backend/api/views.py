from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets, filters, status
from .models import Resource, Volunteer
from rest_framework import serializers
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import transaction
import json
import re

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, React & Django!"})

# Створюємо серіалізатор для моделі Resource
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'

# Створюємо API представлення
class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all().select_related()
    serializer_class = ResourceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'organization', 'storage_location']
    search_fields = ['name', 'comment', 'added_by', 'organization']
    ordering_fields = ['name', 'date_added', 'quantity', 'expiry_date']
    ordering = ['-date_added']  # За замовчуванням сортування за датою додавання (спочатку нові)
    
    @method_decorator(cache_page(60*5))  # Кешування на 5 хвилин
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @method_decorator(cache_page(60*60))  # Кешування на 1 годину
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

# Створюємо серіалізатор для моделі Volunteer
class VolunteerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Volunteer
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}
        
    def create(self, validated_data):
        # Видаляємо пароль з даних, які будуть використані для створення Volunteer
        password = validated_data.pop('password', None)
        volunteer = Volunteer.objects.create(**validated_data)
        return volunteer

# Створюємо API представлення для моделі Volunteer
class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all().select_related('user')
    serializer_class = VolunteerSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'organization']
    search_fields = ['last_name', 'first_name', 'middle_name', 'skills', 'description', 'email', 'phone']
    ordering_fields = ['last_name', 'first_name', 'registration_date', 'last_login']
    ordering = ['last_name', 'first_name']  # За замовчуванням сортування за прізвищем та ім'ям
    
    @method_decorator(cache_page(60*5))  # Кешування на 5 хвилин
    @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @method_decorator(cache_page(60*60))  # Кешування на 1 годину
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        """
        Створює нового волонтера разом із користувачем Django User
        """
        # Для діагностики виводимо отримані дані
        print(f"Отримано дані для реєстрації: {request.data}")
        print(f"Content-Type: {request.content_type}")
        
        # Перевіряємо, чи всі необхідні поля присутні
        required_fields = ['first_name', 'last_name', 'email', 'phone', 'password']
        missing_fields = [field for field in required_fields if field not in request.data]
        
        if missing_fields:
            error_message = f"Відсутні обов'язкові поля: {', '.join(missing_fields)}"
            print(f"Помилка валідації: {error_message}")
            return Response(
                {"message": error_message},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Помилки валідації: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        
        # Розширена перевірка унікальності email
        user_exists = User.objects.filter(email=email).exists()
        volunteer_exists = Volunteer.objects.filter(email=email).exists()
        
        if user_exists or volunteer_exists:
            error_sources = []
            if user_exists:
                error_sources.append("таблиці користувачів Django (auth_user)")
            if volunteer_exists:
                error_sources.append("таблиці волонтерів (api_volunteer)")
                
            error_message = f"Користувач з такою електронною поштою вже існує в {' та '.join(error_sources)}."
            print(f"Помилка унікальності email: {error_message}")
            
            # Детальна інформація для діагностики
            if user_exists:
                user = User.objects.get(email=email)
                print(f"Знайдено користувача Django: id={user.id}, username={user.username}")
            if volunteer_exists:
                volunteer = Volunteer.objects.get(email=email)
                print(f"Знайдено волонтера: id={volunteer.id}, name={volunteer.first_name} {volunteer.last_name}")
                
            return Response(
                {"message": "Користувач з такою електронною поштою вже існує."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Перевірка надійності пароля
        if len(password) < 8:
            error_message = "Пароль повинен містити щонайменше 8 символів."
            print(f"Помилка валідації: {error_message}")
            return Response(
                {"message": error_message},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                # Створюємо Django User
                username = email  # Використовуємо email як ім'я користувача
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=serializer.validated_data.get('first_name', ''),
                    last_name=serializer.validated_data.get('last_name', '')
                )
                
                # Створюємо Volunteer і пов'язуємо з User
                # Пароль буде видалено з validated_data в методі create серіалізатора
                volunteer = serializer.save(user=user)
                
                # Повертаємо дані у форматі camelCase для клієнта
                response_data = {
                    "id": volunteer.id,
                    "firstName": volunteer.first_name,
                    "lastName": volunteer.last_name,
                    "email": volunteer.email,
                    "photoUrl": request.build_absolute_uri(volunteer.photo.url) if volunteer.photo and volunteer.photo.name else None
                }
                
                print(f"Успішно створено волонтера: {volunteer.email}")
                return Response({
                    "success": True,
                    "message": "Волонтера успішно зареєстровано",
                    "volunteer": response_data
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            print(f"Помилка при реєстрації: {str(e)}")
            return Response(
                {"message": f"Помилка при реєстрації: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """Ендпоінт для входу волонтерів"""
        data = request.data
        
        # Логуємо отримані дані для діагностики (без відображення пароля для безпеки)
        print(f"Отримано дані для входу: email={data.get('email')}")
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response(
                {"message": "Необхідно вказати email та пароль."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Шукаємо користувача за email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"message": "Користувача з такою електронною поштою не знайдено."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Перевіряємо пароль
            user_auth = authenticate(username=user.username, password=password)
            if not user_auth:
                return Response(
                    {"message": "Невірний пароль."},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Знаходимо пов'язаний профіль волонтера
            try:
                volunteer = Volunteer.objects.get(user=user)
            except Volunteer.DoesNotExist:
                return Response(
                    {"message": "Профіль волонтера не знайдено."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Оновлюємо час останнього входу
            volunteer.last_login = timezone.now()
            volunteer.save()
            
            # Конвертуємо модель у словник з camelCase ключами для фронтенду
            volunteer_data = {
                "id": volunteer.id,
                "firstName": volunteer.first_name,
                "lastName": volunteer.last_name,
                "email": volunteer.email,
                "photoUrl": request.build_absolute_uri(volunteer.photo.url) if volunteer.photo and volunteer.photo.name else None
            }
            
            # Генеруємо простий токен (в продакшені використовуйте JWT або OAuth)
            token = f"token-{volunteer.id}-{timezone.now().timestamp()}"
            
            return Response({
                "success": True,
                "message": "Успішний вхід",
                "token": token,
                "volunteer": volunteer_data
            })
            
        except Exception as e:
            print(f"Помилка при вході: {str(e)}")
            return Response(
                {"message": "Помилка при вході в систему."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )