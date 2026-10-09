from flask import Flask, jsonify
from datetime import date
from cs50 import SQL
import sqlite3

app = Flask(__name__)

db = SQL("sqlite:////backend/database/database.db")

with sqlite3.connect("backend/database/database.db") as conn:
    conn.executescript(open("backend/database/schema.sql").read())

@app.route("/analitics", methods=["POST"])
def analitics_post():
    data = request.json.get("currentSession")
    tracking_website = db.execute("SELECT * FROM tracking_websites WHERE url = ?", (data["domain"],))
    if tracking_website:
        db.execute("UPDATE tracking_websites SET time_spent = time_spent + ? WHERE url = ?", (data["duration"],data["domain"]))
    else:
        db.execute("INSERT INTO tracking_websites (url, tracking_time, time_spent) VALUES (?, ?, ?)", (data["domain"], data["duration"], 0))
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