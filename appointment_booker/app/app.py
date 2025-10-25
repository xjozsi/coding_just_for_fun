from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import db, Slot, seed_slots
from admin_routes import admin_bp
from user_routes import user_bp
import os


app = Flask(__name__, static_folder='static', template_folder='templates')
db_password_path = "/run/secrets/db_password"

if os.path.exists(db_password_path):
    with open(db_password_path) as f:
        db_password = f.read().strip()
else:
    # fallback – ha nincs secret, próbálja env-ből
    db_password = os.getenv("POSTGRES_PASSWORD", "")

psql_db_url = f"postgresql://postgres:{db_password}@db:5432/appointments"

db_url = os.getenv(psql_db_url, "sqlite:///appointments.db")
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

app.secret_key = os.getenv("SECRET_KEY", os.urandom(24))

app.register_blueprint(user_bp)
app.register_blueprint(admin_bp, url_prefix="/api/admin")

with app.app_context():
    db.create_all()
    seed_slots(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
