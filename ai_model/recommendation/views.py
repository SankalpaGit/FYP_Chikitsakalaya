# recommendation/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import recommend_doctors

@api_view(['GET'])  # now allows GET
def recommend_doctors_api(request):
    patient_id = request.GET.get('patient_id')
    if not patient_id:
        return Response({"success": False, "message": "patient_id is required"}, status=400)

    doctors = recommend_doctors(patient_id)
    return Response({"success": True, "recommendations": doctors})
