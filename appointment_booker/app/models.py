from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

db = SQLAlchemy()


class Slot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    available = db.Column(db.Boolean, default=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "time": self.time,
            "available": self.available,
            "name": self.name,
            "email": self.email,
        }


def seed_slots(app, days=60):
    """Generál félórás időpontokat 9:00–17:00 között a következő `days` napra."""
    if Slot.query.count() > 0:
        print(f"[INFO] {Slot.query.count()} slot már létezik — seed kihagyva.")
        return

    base_date = datetime.now().date()
    for day in range(days):
        date = base_date + timedelta(days=day)
        for hour in range(9, 17):
            for minute in [0, 30]:
                time_str = f"{hour:02d}:{minute:02d}"
                db.session.add(Slot(date=str(date), time=time_str, available=True))
    db.session.commit()
    print(f"[INFO] Seedelve {days} napnyi időpont ({Slot.query.count()} rekord).")
