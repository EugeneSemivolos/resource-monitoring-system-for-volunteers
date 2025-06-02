from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import viewsets, filters, status
from .models import Resource, Volunteer, ActionLog
from rest_framework import serializers
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import transaction
import json
import re
from django.utils.dateparse import parse_date
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

class ActionLoggingMixin:
    def get_performer_name(self):
        """Get the name of the action performer"""
        if self.request.user.is_authenticated:
            volunteer = getattr(self.request.user, 'volunteer', None)
            if volunteer:
                return f"{volunteer.first_name} {volunteer.last_name}"
            return self.request.user.get_full_name() or self.request.user.username
        return None

    def log_action(self, action, subject, description):
        """Create an action log entry"""
        ActionLog.objects.create(
            action=action,
            subject=subject,
            description=description,
            performer=self.get_performer_name()
        )

# Створюємо серіалізатор для моделі Resource
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'

# Створюємо API представлення
class ResourceViewSet(ActionLoggingMixin, viewsets.ModelViewSet):
    queryset = Resource.objects.all().select_related()
    serializer_class = ResourceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'organization', 'storage_location']
    search_fields = ['name', 'comment', 'added_by', 'organization']
    ordering_fields = ['name', 'date_added', 'quantity', 'expiry_date']
    ordering = ['-date_added']
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return []
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        instance = serializer.save()
        self.log_action(
            'added',
            'resource',
            f"Додано новий ресурс: {instance.name} (ID: {instance.id})"
        )

    def perform_update(self, serializer):
        old_instance = self.get_object()
        old_data = {field.name: getattr(old_instance, field.name) for field in old_instance._meta.fields}
        instance = serializer.save()
        new_data = {field.name: getattr(instance, field.name) for field in instance._meta.fields}
        
        changed_fields = [
            f"{key}: '{old_data[key]}' → '{new_data[key]}'"
            for key in new_data
            if old_data[key] != new_data[key]
        ]
        
        description = f"Змінено ресурс: {instance.name} (ID: {instance.id}). "
        if changed_fields:
            description += "Змінені поля: " + "; ".join(changed_fields)
        else:
            description += "Без змін у полях."

        self.log_action('updated', 'resource', description)

    def perform_destroy(self, instance):
        self.log_action(
            'deleted',
            'resource',
            f"Видалено ресурс: {instance.name} (ID: {instance.id})"
        )
        instance.delete()

# Створюємо серіалізатор для моделі Volunteer
class VolunteerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Volunteer
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        volunteer = Volunteer.objects.create(**validated_data)
        return volunteer

# Створюємо API представлення для моделі Volunteer
class VolunteerViewSet(ActionLoggingMixin, viewsets.ModelViewSet):
    queryset = Volunteer.objects.all().select_related('user')
    serializer_class = VolunteerSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'organization']
    search_fields = ['last_name', 'first_name', 'middle_name', 'skills', 'description', 'email', 'phone']
    ordering_fields = ['last_name', 'first_name', 'registration_date', 'last_login']
    ordering = ['last_name', 'first_name']
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'login', 'list', 'retrieve']:
            return []
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        instance = serializer.save()
        self.log_action(
            'added',
            'volunteer',
            f"Додано нового волонтера: {instance.first_name} {instance.last_name} (ID: {instance.id})"
        )

    def perform_update(self, serializer):
        old_instance = self.get_object()
        old_data = {field.name: getattr(old_instance, field.name) for field in old_instance._meta.fields}
        instance = serializer.save()
        new_data = {field.name: getattr(instance, field.name) for field in instance._meta.fields}
        
        changed_fields = [
            f"{key}: '{old_data[key]}' → '{new_data[key]}'"
            for key in new_data
            if old_data[key] != new_data[key]
        ]
        
        description = f"Змінено волонтера: {instance.first_name} {instance.last_name} (ID: {instance.id}). "
        if changed_fields:
            description += "Змінені поля: " + "; ".join(changed_fields)
        else:
            description += "Без змін у полях."

        self.log_action('updated', 'volunteer', description)

    def perform_destroy(self, instance):
        self.log_action(
            'deleted',
            'volunteer',
            f"Видалено волонтера: {instance.first_name} {instance.last_name}"
        )
        instance.delete()
    
    def create(self, request, *args, **kwargs):
        required_fields = ['first_name', 'last_name', 'email', 'phone', 'password']
        missing_fields = [field for field in required_fields if field not in request.data]
        
        if missing_fields:
            return Response(
                {"message": f"Відсутні обов'язкові поля: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data.get('email')
        
        # Перевірка унікальності email
        if User.objects.filter(email=email).exists() or Volunteer.objects.filter(email=email).exists():
            return Response(
                {"message": "Користувач з такою електронною поштою вже існує"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Створюємо користувача Django
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=serializer.validated_data['password'],
                    first_name=serializer.validated_data['first_name'],
                    last_name=serializer.validated_data['last_name']
                )
                
                # Створюємо волонтера
                volunteer = serializer.save(user=user)
                
                # Створюємо токен для користувача
                token = Token.objects.create(user=user)
                
                return Response({
                    "message": "Реєстрація успішна",
                    "token": token.key,
                    "volunteer": self.get_serializer(volunteer).data
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {"message": f"Помилка при реєстрації: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {"message": "Необхідно вказати email та пароль"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "Користувача з такою електронною поштою не знайдено"},
                status=status.HTTP_404_NOT_FOUND
            )

        if not user.check_password(password):
            return Response(
                {"message": "Введено неправильний логін або пароль"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            volunteer = Volunteer.objects.get(user=user)
        except Volunteer.DoesNotExist:
            return Response(
                {"message": "Обліковий запис волонтера не знайдено"},
                status=status.HTTP_404_NOT_FOUND
            )

        if volunteer.status != 'active':
            return Response(
                {"message": "Адміністратор ще не підтвердив вас"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Оновлюємо час останнього входу
        volunteer.last_login = timezone.now()
        volunteer.save()

        # Отримуємо або створюємо токен
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Вхід успішний",
            "token": token.key,
            "volunteer": self.get_serializer(volunteer).data
        })

@api_view(['GET'])
def action_log_list(request):
    if not request.user.is_authenticated:
        return Response({"message": "Необхідна автентифікація"}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Get query parameters
    offset = int(request.GET.get('offset', 0))
    page_size = int(request.GET.get('page_size', 10))
    subject = request.GET.get('subject', '')
    action = request.GET.get('action', '')
    date_from = request.GET.get('date_from', '')
    date_to = request.GET.get('date_to', '')
    
    # Start with all logs
    logs = ActionLog.objects.all()
    
    # Apply filters
    if subject:
        logs = logs.filter(subject=subject)
    if action:
        logs = logs.filter(action=action)
    if date_from:
        logs = logs.filter(timestamp__date__gte=date_from)
    if date_to:
        logs = logs.filter(timestamp__date__lte=date_to)
    
    # Order by timestamp descending
    logs = logs.order_by('-timestamp')
    
    # Get total count
    total_count = logs.count()
    
    # Apply pagination
    logs = logs[offset:offset + page_size]
    
    # Format response
    data = {
        'total': total_count,
        'results': [{
            'id': log.id,
            'timestamp': log.timestamp,
            'action': log.action,
            'subject': log.subject,
            'description': log.description,
            'performer': log.performer
        } for log in logs]
    }
    
    return Response(data)