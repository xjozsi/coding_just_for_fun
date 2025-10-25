from flask import Blueprint, render_template, jsonify, request
from models import db, Slot

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/")
def index():
    return render_template("index.html")


@user_bp.route("/api/slots")
def get_slots():
    date_str = request.args.get("date")
    if date_str:
        slots = Slot.query.filter_by(date=date_str).all()
    else:
        slots = Slot.query.all()

    events = []
    for s in slots:
        events.append({
            "id": s.id,
            "title": f"{s.time} ({'Free' if s.available else 'Booked'})",
            "start": f"{s.date}T{s.time}:00",
            "color": "#28a745" if s.available else "#dc3545"
        })

    return jsonify(events)


@user_bp.route("/api/book", methods=["POST"])
def book_slot():
    data = request.json
    slot_id = data.get("id")
    name = data.get("name")
    email = data.get("email")

    slot = db.session.get(Slot, slot_id)
    if not slot:
        return jsonify({"success": False, "message": "Slot not found"}), 404
    if not slot.available:
        return jsonify({"success": False, "message": "Slot already booked"}), 400

    slot.available = False
    slot.name = name
    slot.email = email
    db.session.commit()
    return jsonify({"success": True})
