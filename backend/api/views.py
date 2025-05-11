from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .models import Resource, Volunteer
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

# Create serializer for the Volunteer model
class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}

# Create API view for Volunteer model
class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer