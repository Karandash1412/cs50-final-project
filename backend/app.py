from flask import Flask, jsonify, request
from datetime import date
from cs50 import SQL
import sqlite3
from pathlib import Path

app = Flask(__name__)

BACKEND_PATH = Path(__file__).resolve().parent
DATABASE_DIR = BACKEND_PATH / "database"
DATABASE_PATH = DATABASE_DIR / "database.db"
DATABASE_SCHEMA = DATABASE_DIR / "schema.sql"

conn = sqlite3.connect(DATABASE_PATH)    
try:
    conn.executescript(DATABASE_SCHEMA.read_text())
    conn.commit()
finally:
    conn.close()

db = SQL(f"sqlite:///{DATABASE_PATH}")

@app.route("/analitics")
def analitics_get():
    parameter = request.args.get("date",type=int)

    if parameter == 24:
        time_range = "-24 hours"  
    elif parameter == 7:
        time_range = "-7 days"
    elif parameter == 30:
        time_range = "-30 days"
    else:
        return jsonify({"error": "Invalid range"}), 400

    data = db.execute(
        "SELECT url,time_spent FROM tracking_websites WHERE date >= datetime('now', ?)", (time_range,),
    )
    return jsonify(data)

@app.route("/analitics", methods=["POST"])
def analitics_post():
    data = request.get_json()

    db.execute("INSERT INTO tracking_websites (url, tracking_time, time_spent, date) VALUES (?, ?, ?, ?)",
        data["domain"], data["duration"], data["duration"], data["date"],
    )    
    return jsonify({"message": "Data inserted successfully"})

@app.route("/domain-settings", methods=["GET"])
def domain_settings_get():
    data = db.execute("SELECT * FROM site_categories")
    return jsonify(data)

@app.route("/domain-settings",methods=["POST"])
def domain_settings_post():
    data = request.get_json()
    db.execute("SELECT COUNT(*) FROM site_categories WHERE domain = ?", (data["domain"],))
    if result[0] > 0:
        db.execute("UPDATE site_categories SET category = ? WHERE domain = ?", (data["category"], data["domain"],))
        return jsonify({"message": "Domain updated successfully"})
    else:
        db.execute("INSERT INTO site_categories (domain, category) VALUES (?, ?)", (data["domain"], data["category"],))
        return jsonify({"message": "Domain added successfully"})

@app.route("/clear-data", methods=["DELETE"])
def clear_data():
    db.execute("DELETE FROM tracking_websites")
    return jsonify({"message": "Data cleared successfully"})