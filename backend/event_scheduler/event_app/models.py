from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class EventCategory(models.Model):
    """Model for event categories"""
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Event Categories'

    def __str__(self):
        return self.name


class TimeSlot(models.Model):
    """Model for available time slots"""
    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE, related_name='timeslots')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    max_attendees = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_time']
        verbose_name_plural = 'Time Slots'

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError('Start time must be before end time.')

    def __str__(self):
        return f'{self.category.name} - {self.start_time}'

    def get_available_spots(self):
        """Calculate available spots for this time slot"""
        booked_count = self.bookings.filter(unsubscribe=False).count()
        return self.max_attendees - booked_count

    def is_available(self):
        """Check if time slot has available spots"""
        return self.get_available_spots() > 0


class UserPreference(models.Model):
    """Model for user category preferences"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='preferences')
    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE, related_name='user_preferences')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'category']
        verbose_name_plural = 'User Preferences'

    def __str__(self):
        return f'{self.user.username} - {self.category.name}'


class Booking(models.Model):
    """Model for user bookings"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    timeslot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, related_name='bookings')
    unsubscribe = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    unsubscribe_time= models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'timeslot']
        verbose_name_plural = 'Bookings'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.timeslot}'
