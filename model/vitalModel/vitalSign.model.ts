export interface vitalSign {
    _id?: String;
    time?: String;
    date?: String;
    temperature?: String;
    blood_pressure?: String;
    heart_rate?: String;
    blood_sugar?: String;
    blood_cholesterol?: String;
}

export interface vitalSigns {
    user_id: String;
    vitalSigns: vitalSign[];
}