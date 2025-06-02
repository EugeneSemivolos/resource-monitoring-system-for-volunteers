from django.urls import path, include
from .views import ResourceViewSet, VolunteerViewSet, action_log_list
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'resources', ResourceViewSet)
router.register(r'volunteers', VolunteerViewSet)

urlpatterns = [
    path('history/', action_log_list, name='action_log_list'),
    path('', include(router.urls)),
]