# recommendation/utils.py

from django.db import connection

def recommend_doctors(patient_id, speciality_limit=2, doctor_limit=5):
    from recommendation.train_model import train_patient_speciality_model
    
    # Load trained model
    model = train_patient_speciality_model()

    if patient_id not in model:
        return []  # No recommendations for this patient

    # Get top searched specialities
    specialities = sorted(model[patient_id].items(), key=lambda x: x[1], reverse=True)
    top_specialities = [spec for spec, _ in specialities[:speciality_limit]]

    if not top_specialities:
        return []

    doctors = []

    with connection.cursor() as cursor:
        for speciality in top_specialities:
            query = f"""
                SELECT d.id, d.firstName, d.lastName, dd.speciality, dd.country, dd.state, dd.profilePicture, dd.consultationFee
                FROM Doctors d
                JOIN DoctorDetails dd ON d.id = dd.doctorId
                WHERE dd.speciality LIKE %s
                LIMIT {doctor_limit}
            """
            cursor.execute(query, [f"%{speciality}%"])
            results = cursor.fetchall()

            for row in results:
                doctor = {
                    'doctorId': row[0],
                    'firstName': row[1],
                    'lastName': row[2],
                    'speciality': row[3],
                    'country': row[4],
                    'state': row[5],
                    'profilePicture': row[6],
                    'consultationFee': row[7],
                }
                doctors.append(doctor)

    return doctors
