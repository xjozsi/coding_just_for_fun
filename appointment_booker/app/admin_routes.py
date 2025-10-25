from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from functools import wraps
from models import db, Slot
import os
import bcrypt

admin_bp = Blueprint("admin_bp", __name__, template_folder="templates")


ADMIN_USER = os.getenv("ADMIN_USER")
ADMIN_PASS_HASH = os.getenv("ADMIN_PASS_HASH")


@admin_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form["username"]
        pw = request.form["password"].encode("utf-8")
        if user == ADMIN_USER and bcrypt.checkpw(pw, ADMIN_PASS_HASH.encode("utf-8")):
            session["admin_logged_in"] = True
            return redirect(url_for("admin_bp.admin_dashboard"))
        return render_template("login.html", error="Invalid credentials")
    return render_template("login.html")


@admin_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("admin_bp.login"))


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("admin_logged_in"):
            return redirect(url_for("admin_bp.login"))
        return f(*args, **kwargs)
    return decorated_function


@admin_bp.route("/dashboard")
@admin_required
def admin_dashboard():
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin_bp.login"))
    slots = Slot.query.order_by(Slot.date, Slot.time).all()
    return render_template("admin.html", slots=slots)


@admin_bp.route("/api/slots")
@admin_required
def get_events():
    """FullCalendar kompatibilis JSON formátum"""
    slots = Slot.query.all()
    events = []
    for s in slots:
        color = "#28a745" if s.available else "#dc3545"  # zöld = szabad, piros = foglalt
        events.append({
            "id": s.id,
            "title": f"{s.time} {'(Free)' if s.available else '(Booked)'}",
            "start": f"{s.date}T{s.time}:00",
            "color": color
        })
    return jsonify(events)


@admin_bp.route("/toggle/<int:slot_id>", methods=["POST"])
def toggle_slot(slot_id):
    slot = db.session.get(Slot, slot_id)
    if not slot:
        return jsonify({"success": False, "message": "Slot not found"}), 404

    slot.available = not slot.available
    if slot.available:
        slot.name = None
        slot.email = None
    db.session.commit()
    return jsonify({"success": True, "available": slot.available})
