from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import uuid
import math
import csv
from io import StringIO

app = Flask(__name__)
CORS(app)

# --- POSTGRESQL CONNECTION ---
# IMPORTANT: Make sure this matches your Postgres password!
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:gunwant@localhost:5432/timetable_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- DATABASE MODELS ---
class Faculty(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    short_code = db.Column(db.String(10), nullable=False)
    department = db.Column(db.String(50), nullable=False)
    max_hours_per_day = db.Column(db.Integer, nullable=False)
    availability = db.Column(db.JSON, nullable=False) 

class Room(db.Model):
    id = db.Column(db.String, primary_key=True)
    room_number = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    building = db.Column(db.String(50), nullable=False)

class Subject(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(20), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    department = db.Column(db.String(50), nullable=False)
    faculty_id = db.Column(db.String, nullable=True)
    color = db.Column(db.String(20), nullable=True)
    class_id = db.Column(db.String, nullable=True) # The column that was missing!

class ClassSection(db.Model):
    id = db.Column(db.String, primary_key=True)
    section_name = db.Column(db.String(20), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    department = db.Column(db.String(50), nullable=False)
    student_strength = db.Column(db.Integer, nullable=False)

class TimetableEntry(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    day = db.Column(db.String(20), nullable=False)
    slot_index = db.Column(db.Integer, nullable=False)
    subject_id = db.Column(db.String, nullable=False)
    faculty_id = db.Column(db.String, nullable=False)
    room_id = db.Column(db.String, nullable=False)
    class_id = db.Column(db.String, nullable=False)
    is_lab = db.Column(db.Boolean, default=False)
    is_locked = db.Column(db.Boolean, default=False) 

# ONLY creates tables if they don't exist. NO data wiping here!
with app.app_context():
    db.create_all()

# --- CORE API ROUTES ---
@app.route('/api/faculty', methods=['GET', 'POST'])
def manage_faculty():
    if request.method == 'GET':
        return jsonify([{'id': f.id, 'name': f.name, 'shortCode': f.short_code, 'department': f.department, 'availability': f.availability, 'maxHoursPerDay': f.max_hours_per_day} for f in Faculty.query.all()])
    data = request.json
    db.session.add(Faculty(id=data['id'], name=data['name'], short_code=data['shortCode'], department=data['department'], max_hours_per_day=data['maxHoursPerDay'], availability=data.get('availability', [])))
    db.session.commit()
    return jsonify({"m": "ok"}), 201

@app.route('/api/subjects', methods=['GET', 'POST'])
def manage_subjects():
    if request.method == 'GET':
        return jsonify([{'id': s.id, 'name': s.name, 'code': s.code, 'credits': s.credits, 'type': s.type, 'semester': s.semester, 'department': s.department, 'facultyId': s.faculty_id, 'color': s.color, 'classId': s.class_id} for s in Subject.query.all()])
    
    data = request.json
    # THE FIX: Added .get('semester', 0) and .get('department', 'Computer Engineering')
    db.session.add(Subject(
        id=data['id'], 
        name=data['name'], 
        code=data.get('code', 'SUB'), 
        credits=data.get('credits', 4), 
        type=data['type'], 
        semester=data.get('semester', 0), 
        department=data.get('department', 'Computer Engineering'), 
        faculty_id=data.get('facultyId'), 
        color=data.get('color'), 
        class_id=data.get('classId')
    ))
    db.session.commit()
    return jsonify({"m": "ok"}), 201

@app.route('/api/classes', methods=['GET', 'POST'])
def manage_classes():
    if request.method == 'GET':
        return jsonify([{'id': c.id, 'sectionName': c.section_name, 'semester': c.semester, 'department': c.department, 'studentStrength': c.student_strength} for c in ClassSection.query.all()])
    data = request.json
    # Fix for missing student strength
    db.session.add(ClassSection(id=data['id'], section_name=data['sectionName'], semester=data['semester'], department=data['department'], student_strength=data.get('studentStrength', 60)))
    db.session.commit()
    return jsonify({"m": "ok"}), 201

@app.route('/api/rooms', methods=['GET', 'POST'])
def manage_rooms():
    if request.method == 'GET':
        return jsonify([{'id': r.id, 'roomNumber': r.room_number, 'capacity': r.capacity, 'type': r.type, 'building': r.building} for r in Room.query.all()])
    data = request.json
    # Fix for missing building name
    db.session.add(Room(id=data['id'], room_number=data['roomNumber'], capacity=data['capacity'], type=data['type'], building=data.get('building', 'Main Block')))
    db.session.commit()
    return jsonify({"m": "ok"}), 201

@app.route('/api/timetable', methods=['GET', 'POST'])
def manage_timetable():
    if request.method == 'GET':
        return jsonify([{'id': e.id, 'day': e.day, 'slotIndex': e.slot_index, 'subjectId': e.subject_id, 'facultyId': e.faculty_id, 'roomId': e.room_id, 'classId': e.class_id, 'isLab': e.is_lab, 'isLocked': e.is_locked} for e in TimetableEntry.query.all()])
    data = request.json
    db.session.add(TimetableEntry(id=str(uuid.uuid4()), day=data['day'], slot_index=data['slotIndex'], subject_id=data['subjectId'], faculty_id=data['facultyId'], room_id=data['roomId'], class_id=data['classId'], is_lab=data.get('isLab', False), is_locked=True))
    db.session.commit()
    return jsonify({"m": "ok"}), 201

# --- DELETE ROUTES ---
# --- DELETE ROUTES ---
@app.route('/api/faculty/<id>', methods=['DELETE'])
def delete_faculty(id):
    try:
        TimetableEntry.query.filter_by(faculty_id=id).delete()
        # Unlink the teacher from any subjects before deleting them
        Subject.query.filter_by(faculty_id=id).update({'faculty_id': None}) 
        item = db.session.get(Faculty, id)
        if item: 
            db.session.delete(item)
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting Faculty: {e}")
        return jsonify({"error": str(e)}), 500
@app.route('/api/faculty/<id>', methods=['PUT'])
def update_faculty(id):
    try:
        data = request.json
        # Find the existing teacher in the database
        faculty = db.session.get(Faculty, id)
        
        if not faculty:
            return jsonify({"error": "Faculty not found"}), 404
        
        # FIXED: These now perfectly match your exact database columns!
        faculty.name = data.get('name', faculty.name)
        faculty.short_code = data.get('shortCode', faculty.short_code)
        faculty.department = data.get('department', faculty.department)
        faculty.max_hours_per_day = data.get('maxHoursPerDay', faculty.max_hours_per_day)
        
        # Save changes to PostgreSQL
        db.session.commit()
        return jsonify({"success": True}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating Faculty: {e}")
        return jsonify({"error": str(e)}), 500
@app.route('/api/subjects/<id>', methods=['DELETE'])
def delete_subject(id):
    try:
        TimetableEntry.query.filter_by(subject_id=id).delete()
        item = db.session.get(Subject, id)
        if item: 
            db.session.delete(item)
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting Subject: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/subjects/<id>', methods=['PUT'])
def update_subject(id):
    try:
        data = request.json
        subject = db.session.get(Subject, id)
        
        if not subject:
            return jsonify({"error": "Subject not found"}), 404
            
        # Update fields, perfectly matching your React frontend payload
        subject.name = data.get('name', subject.name)
        subject.code = data.get('code', subject.code)
        subject.credits = data.get('credits', subject.credits)
        subject.type = data.get('type', subject.type)
        subject.semester = data.get('semester', subject.semester)
        subject.department = data.get('department', subject.department)
        subject.faculty_id = data.get('facultyId', subject.faculty_id)
        subject.color = data.get('color', subject.color)
        subject.class_id = data.get('classId', subject.class_id)
        
        db.session.commit()
        return jsonify({"success": True}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating Subject: {e}")
        return jsonify({"error": str(e)}), 500

        
@app.route('/api/classes/<id>', methods=['DELETE'])
def delete_class(id):
    try:
        TimetableEntry.query.filter_by(class_id=id).delete()
        # Clean up: delete all subjects tied to this section
        Subject.query.filter_by(class_id=id).delete() 
        item = db.session.get(ClassSection, id)
        if item: 
            db.session.delete(item)
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting Class: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/rooms/<id>', methods=['DELETE'])
def delete_room(id):
    try:
        TimetableEntry.query.filter_by(room_id=id).delete()
        item = db.session.get(Room, id)
        if item: 
            db.session.delete(item)
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting Room: {e}")
        return jsonify({"error": str(e)}), 500

# --- ALGORITHMIC SCHEDULING ---
# --- ALGORITHMIC SCHEDULING ---
# --- ALGORITHMIC SCHEDULING ---
# --- ALGORITHMIC SCHEDULING ---
# --- ALGORITHMIC SCHEDULING ---
# --- ALGORITHMIC SCHEDULING ---
# --- ALGORITHMIC SCHEDULING ---
# --- ALGORITHMIC SCHEDULING ---
# --- ALGORITHMIC SCHEDULING ---
@app.route('/api/generate', methods=['POST'])
def generate_timetable():
    try:
        faculties = {f.id: f for f in Faculty.query.all()}
        subjects = Subject.query.all()
        rooms = Room.query.all()
        all_classes = ClassSection.query.all()

        # 🚨 SAFETY CHECK 1: Ensure we have the minimum required data
        if not rooms:
            return jsonify({"success": False, "error": "No rooms found. Please add at least one room."}), 400
        if not all_classes:
            return jsonify({"success": False, "error": "No classes found. Please add at least one class."}), 400
        if not subjects:
            return jsonify({"success": False, "error": "No subjects found. Please add subjects to your classes."}), 400

        # Clear old timetable
        TimetableEntry.query.delete()
        db.session.commit()

        faculty_busy = {}
        DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        SLOTS_PER_DAY = 8
        BREAK_SLOTS = [2]   # Break column
        LUNCH_SLOTS = [5]   # Lunch column

        def get_k(d, s):
            return f"{d}-{s}"

        import random

        lab_rooms = [r for r in rooms if r.type.lower() in ['lab', 'laboratory']]
        class_rooms = [r for r in rooms if r.type.lower() == 'classroom']

        if not lab_rooms:
            lab_rooms = rooms
        if not class_rooms:
            class_rooms = rooms

        for cls in all_classes:
            cls_subjects = [s for s in subjects if s.class_id == cls.id]

            # 🚨 SAFETY CHECK 2: Skip this class if it has no subjects assigned to it!
            if not cls_subjects:
                continue

            placed_credits = {s.id: 0 for s in cls_subjects}
            subject_daily_count = {}

            labs = [s for s in cls_subjects if s.type.lower() != 'theory']
            theories = [s for s in cls_subjects if s.type.lower() == 'theory']

            for day in DAYS:
                subject_daily_count[day] = {}
                slot = 0
                
                while slot < SLOTS_PER_DAY:
                    if slot in BREAK_SLOTS or slot in LUNCH_SLOTS:
                        slot += 1
                        continue

                    assigned = False

                    # 🔷 TRY LAB (2 slots)
                    if slot < SLOTS_PER_DAY - 1 and (slot + 1) not in BREAK_SLOTS and (slot + 1) not in LUNCH_SLOTS:
                        if labs: # Make sure labs list isn't empty before shuffling
                            random.shuffle(labs)
                            for sub in labs:
                                if placed_credits[sub.id] >= sub.credits:
                                    continue
                                count_today = subject_daily_count[day].get(sub.id, 0)
                                if count_today >= 2:
                                    continue

                                fac = faculties.get(sub.faculty_id)
                                k1 = get_k(day, slot)
                                k2 = get_k(day, slot + 1)

                                if fac and (k1 in faculty_busy.get(fac.id, set()) or k2 in faculty_busy.get(fac.id, set())):
                                    continue

                                room = random.choice(lab_rooms)
                                for s in [slot, slot + 1]:
                                    db.session.add(TimetableEntry(
                                        day=day, slot_index=s, subject_id=sub.id, faculty_id=fac.id if fac else None,
                                        room_id=room.id, class_id=cls.id, is_lab=True
                                    ))
                                    if fac:
                                        faculty_busy.setdefault(fac.id, set()).add(get_k(day, s))

                                placed_credits[sub.id] += 2
                                subject_daily_count[day][sub.id] = count_today + 2
                                slot += 2
                                assigned = True
                                break

                    if assigned:
                        continue

                    # 🔷 TRY THEORY (1 slot)
                    if theories: # Make sure theories list isn't empty before shuffling
                        random.shuffle(theories)
                        for sub in theories:
                            if placed_credits[sub.id] >= sub.credits:
                                continue
                            count_today = subject_daily_count[day].get(sub.id, 0)
                            if count_today >= 2:
                                continue

                            fac = faculties.get(sub.faculty_id)
                            k = get_k(day, slot)

                            if fac and k in faculty_busy.get(fac.id, set()):
                                continue

                            room = random.choice(class_rooms)
                            db.session.add(TimetableEntry(
                                day=day, slot_index=slot, subject_id=sub.id, faculty_id=fac.id if fac else None,
                                room_id=room.id, class_id=cls.id, is_lab=False
                            ))
                            if fac:
                                faculty_busy.setdefault(fac.id, set()).add(k)

                            placed_credits[sub.id] += 1
                            subject_daily_count[day][sub.id] = count_today + 1
                            assigned = True
                            break

                    # 🔥 FINAL FALLBACK (NO EMPTY SLOT)
                    if not assigned and cls_subjects: # Ensure cls_subjects isn't empty!
                        sub = random.choice(cls_subjects)
                        fac = faculties.get(sub.faculty_id)
                        room = random.choice(class_rooms)

                        db.session.add(TimetableEntry(
                            day=day, slot_index=slot, subject_id=sub.id, faculty_id=fac.id if fac else None,
                            room_id=room.id, class_id=cls.id, is_lab=False
                        ))

                    slot += 1

        db.session.commit()
        return jsonify({"success": True}), 200

    except Exception as e:
        db.session.rollback()
        print(f"ERROR in generate: {e}") # This will print to your Python terminal!
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

