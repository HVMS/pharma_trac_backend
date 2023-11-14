export interface vitalSign {
    _id?: String;
    time?: String;
    date?: String;
    temperature?: String;
    blood_pressure?: String;
    pulse_rate?: String;
    blood_sugar?: String;
    bloodcholesterol?: String;
}

export interface vitalSigns {
    user_id: String;
    vitalSigns: vitalSign[];
}