from flask import Flask, jsonify
from datetime import date
from cs50 import SQL
import sqlite3

app = Flask(__name__)

db = SQL("sqlite:////backend/database/database.db")

with sqlite3.connect("backend/database/database.db") as conn:
    conn.executescript(open("backend/database/schema.sql").read())

@app.route("/analitics")
def analitics():
    analitics = db.execute("SELECT * FROM analitics WHERE date = ?", (date.today().strftime("%Y-%m-%d"),));
    return jsonify(analitics)

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