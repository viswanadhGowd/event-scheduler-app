from django.contrib import admin
from .models import EventCategory, TimeSlot, UserPreference, Booking
admin.site.register(EventCategory)
admin.site.register(Booking)
admin.site.register(TimeSlot)
admin.site.register(UserPreference)
