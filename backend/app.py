from flask import Flask, jsonify, request
from cs50 import SQL
import sqlite3
from pathlib import Path
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
        "SELECT url,time_spent FROM tracking_websites WHERE datetime(date / 1000, 'unixepoch') >= datetime('now', ?) GROUP BY url ORDER BY time_spent DESC, LIMIT 5", time_range
    )
    return jsonify(data)

@app.route("/analitics", methods=["POST"])
def analitics_post():
    data = request.get_json()

    if data == None:
        return jsonify({"error": "You didn't visit any site yet"}), 400
    
    db.execute("INSERT INTO tracking_websites (url, tracking_time, time_spent, date) VALUES (?, ?, ?, ?)",
        data["domain"], data["duration"], data["duration"], data["date"],
    )    
    return jsonify({"message": "Data inserted successfully"})

@app.route("/domain-settings", methods=["GET"])
def domain_settings_get():
    data = db.execute(
        "SELECT DISTINCT url AS domain, category FROM tracking_websites "
        "LEFT JOIN site_categories ON domain = url"
    )
    return jsonify(data)

@app.route("/domain-settings",methods=["POST"])
def domain_settings_post():
    data_json = request.get_json()

    if data_json == None:
        return jsonify({"error": "No data provided"}), 400
    
    rows = db.execute("SELECT COUNT(*) AS count FROM site_categories WHERE domain = ?", data_json["domain"])
    if rows[0]["count"] > 0:
        db.execute("UPDATE site_categories SET category = ? WHERE domain = ?", data_json["category"], data_json["domain"])
        return jsonify({"message": "Domain updated successfully"})
    else:
        db.execute("INSERT INTO site_categories (domain, category) VALUES (?, ?)", data_json["domain"], data_json["category"])
        return jsonify({"message": "Domain added successfully"})

@app.route("/clear-data", methods=["DELETE"])
def clear_data():
    db.execute("DELETE FROM tracking_websites")
    return jsonify({"message": "Data cleared successfully"})