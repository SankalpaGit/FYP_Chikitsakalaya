# recommendation/models.py

from django.db import models

class SearchLog(models.Model):
    id = models.CharField(max_length=36, primary_key=True)
    patientId = models.UUIDField()
    doctorId = models.UUIDField()
    doctorName = models.CharField(max_length=255)
    speciality = models.CharField(max_length=255)
    query = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'searchlogs'  # <-- tell Django to use Node.js table
        managed = False          # <-- Django will NOT create/drop/migrate this table
