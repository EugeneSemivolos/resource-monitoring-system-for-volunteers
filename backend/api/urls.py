from django.urls import path, include
from .views import hello_world, ResourceViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'resources', ResourceViewSet)

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('', include(router.urls)),
]