from flask import Flask, render_template, jsonify
import psutil
import platform
import datetime
import os 


PROC_PATH = os.getenv("HOST_PROC", "/proc")

psutil.PROCFS_PATH = PROC_PATH 

app = Flask(__name__)

def get_hostname():
    host_hostname_path = "/host_etc/hostname"
    try:
        if os.path.exists(host_hostname_path):
            with open(host_hostname_path, "r") as f:
                name = f.read().strip()
                if name:
                    return name
    except Exception:
        pass

def get_system_info():
    return {
        "hostname": get_hostname(),
        "os": platform.system(),
        "uptime": str(datetime.timedelta(seconds=int(psutil.boot_time()))),
        "cpu_percent": psutil.cpu_percent(interval=0.5),
        "memory": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage("/").percent,
    }

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/system")
def system_data():
    return jsonify(get_system_info())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
