from flask import Flask, render_template, jsonify
import psutil
import platform
import os
import datetime
import json

PROC_PATH = os.getenv("HOST_PROC")
if PROC_PATH and os.path.exists(PROC_PATH):
    psutil.PROCFS_PATH = PROC_PATH

app = Flask(__name__)

def get_readable_hostname():
    env_name = os.getenv("HOST_DESCRIBED_NAME") or os.getenv("HOST_NAME")
    if env_name:
        return env_name
    host_hostname_path = "/host_etc/hostname"
    try:
        if os.path.exists(host_hostname_path):
            with open(host_hostname_path, "r") as f:
                name = f.read().strip()
                if name:
                    return name
    except Exception:
        pass
    return platform.node()

def get_system_data():
    # alap rendszeradatok
    boot_time = datetime.datetime.fromtimestamp(psutil.boot_time())
    uptime = datetime.datetime.now() - boot_time
    net_io = psutil.net_io_counters()

    return {
        "hostname": get_readable_hostname(),
        "os": platform.system(),
        "kernel": platform.release(),
        "arch": platform.machine(),
        "uptime": str(uptime).split(".")[0],
        "cpu_percent": psutil.cpu_percent(interval=0.5),
        "cpu_count": psutil.cpu_count(),
        "memory": {
            "percent": psutil.virtual_memory().percent,
            "used": round(psutil.virtual_memory().used / (1024 ** 3), 2),
            "total": round(psutil.virtual_memory().total / (1024 ** 3), 2),
        },
        "disk": [
            {
                "device": d.device,
                "mountpoint": d.mountpoint,
                "fstype": d.fstype,
                "percent": psutil.disk_usage(d.mountpoint).percent,
                "used": round(psutil.disk_usage(d.mountpoint).used / (1024**3), 2),
                "total": round(psutil.disk_usage(d.mountpoint).total / (1024**3), 2),
            }
            for d in psutil.disk_partitions(all=False)
        ],
        "net": {
            "bytes_sent": net_io.bytes_sent,
            "bytes_recv": net_io.bytes_recv,
        },
        "processes": sorted(
            [
                {
                    "pid": p.info["pid"],
                    "name": p.info["name"],
                    "cpu": p.info["cpu_percent"],
                    "mem": p.info["memory_percent"],
                }
                for p in psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent"])
            ],
            key=lambda x: x["cpu"],
            reverse=True
        )[:5]
    }

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/system")
def api_system():
    return jsonify(get_system_data())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
