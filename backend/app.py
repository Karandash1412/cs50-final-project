from flask import Flask, jsonify, request
from datetime import date
from cs50 import SQL
import sqlite3

app = Flask(__name__)

db = SQL("sqlite:////backend/database/database.db")

with sqlite3.connect("backend/database/database.db") as conn:
    conn.executescript(open("backend/database/schema.sql").read())

@app.route("/analitics", methods=["GET"])
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
        "SELECT * FROM analitics WHERE date >= datetime('now', ?)", time_range
    )
    return jsonify(data)

@app.route("/analitics", methods=["POST"])
def analitics_post():
    data = request.json.get("currentSession")
        db.execute("INSERT INTO tracking_websites (url, tracking_time, time_spent, date) VALUES (?, ?, ?, ?)", (data["domain"], data["duration"], 0, data["date"]))
    return 0;
 
@app.route("/clear-data", methods=["DELETE"])
def clear_data():
    db.execute("DELETE FROM tracking_websites")
    return jsonify({"message": "Data cleared successfully"})
    
# @app.route("/set-tracking", methods=["POST"])
# def set_tracking():
#     tracking = request.json.get("tracking")
#     db.execute("UPDATE analitics SET tracking = ? WHERE date = ?", (tracking, date.today().strftime("%Y-%m-%d")))
#     return jsonify({"message": "Tracking set successfully"})

# @app.route("/export-data")
# def export_data():
#     data = db.execute("SELECT * FROM analitics")
#     return jsonify(data)

# @app.route("/clear-data", methods=["DELETE"])
# def clear_data():
#     db.execute("DELETE FROM analitics")
#     return jsonify({"message": "Data cleared successfully"})