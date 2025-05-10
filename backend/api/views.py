from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .models import Resource
from rest_framework import serializers

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
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer