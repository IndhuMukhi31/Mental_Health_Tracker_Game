from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = "supersecretkey"

USER_FILE = "users.json"

# ---------------- User Utilities ----------------
def load_users():
    if os.path.exists(USER_FILE):
        with open(USER_FILE, "r") as f:
            content = f.read().strip()
            if content:
                return json.loads(content)
    return {}

def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=4)

def save_game_result(username, game_name, score):
    users = load_users()
    if username in users:
        users[username]["results"].append({
            "game": game_name,
            "score": score,
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        save_users(users)

# ---------------- Login / Name Input ----------------
@app.route("/", methods=["GET", "POST"])
@app.route("/login", methods=["GET", "POST"])
def login():
    message = ""
    if request.method == "POST":
        username = request.form["username"].strip()
        if username:
            session["username"] = username
            users = load_users()
            if username not in users:
                users[username] = {"results": []}  # Only store name + results
                save_users(users)
            return redirect(url_for("dashboard"))
        else:
            message = "Please enter your name."
    return render_template("login.html", message=message)

# ---------------- Dashboard ----------------
@app.route("/dashboard")
def dashboard():
    if "username" not in session:
        return redirect(url_for("login"))

    games = [
        "Memory Displacement",
        "Grid Flicker Recall",
        "Color Dice Match",
        "Mirrored Path",
    ]
    
    return render_template("dashboard.html", username=session["username"], games=games)

# ---------------- Game Instructions ----------------
@app.route("/game_instruction/<game_name>")
def game_instruction(game_name):
    if "username" not in session:
        return redirect(url_for("login"))
    
    instructions = {
        "Memory Displacement": "Test your spatial memory. Remember positions of items and recall them.",
        "Grid Flicker Recall": "Recall the flashed pattern on the grid.",
        "Color Dice Match": "Click the button that matches the COLOR of the word shown.",
        "Mirrored Path": "Navigate the path with mirrored controls.",
    }
    
    return render_template(
        "game_instruction.html", 
        game_name=game_name, 
        instruction=instructions.get(game_name, "No instructions available.")
    )

# ---------------- Play Routes ----------------
@app.route("/play_memory_displacement")
def play_memory_displacement():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("game_memory_displacement.html", game_name="Memory Displacement")

@app.route("/play_grid_flicker_recall")
def play_grid_flicker_recall():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("game_grid_flicker.html", game_name="Grid Flicker Recall")

@app.route("/play_color_dice_match")
def play_color_dice_match():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("game_color_dice_match.html", game_name="Color Dice Match")

@app.route("/play_mirrored_path")
def play_mirrored_path():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("game_mirrored_path.html", game_name="Mirrored Path")

# ---------------- Save Game Result ----------------
@app.route("/save_result", methods=["POST"])
def save_result():
    if "username" not in session:
        return jsonify({"status":"error", "message":"Not logged in"})
    data = request.json
    username = session["username"]
    game_name = data.get("game_name")
    score = int(data.get("score",0))
    save_game_result(username, game_name, score)
    return jsonify({"status":"success"})

# ---------------- View Results ----------------
@app.route("/results")
def results():
    if "username" not in session:
        return redirect(url_for("login"))
    users = load_users()
    username = session["username"]
    user_results = users.get(username, {}).get("results", [])
    return render_template("result.html", results=user_results)

if __name__ == "__main__":
    app.run(debug=True)

import os

if __name__ == "__main__":
    # Get the port Render assigns, default to 5000 locally
    port = int(os.environ.get("PORT", 5000))
    # Bind to 0.0.0.0 to allow external access
    app.run(host="0.0.0.0", port=port)