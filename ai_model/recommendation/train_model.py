# recommendation/train_model.py

from collections import defaultdict
from recommendation.models import SearchLog

# 1. Build patient to speciality mapping
def train_patient_speciality_model():
    patient_speciality_count = defaultdict(lambda: defaultdict(int))

    logs = SearchLog.objects.all()

    for log in logs:
        patient_id = str(log.patientId)
        speciality = log.speciality.lower().strip()

        if speciality:
            patient_speciality_count[patient_id][speciality] += 1

    return patient_speciality_count

# 2. Example usage
if __name__ == "__main__":
    model = train_patient_speciality_model()
    for patient, specialities in model.items():
        print(f"Patient: {patient}")
        for speciality, count in specialities.items():
            print(f"  - {speciality}: {count} searches")
