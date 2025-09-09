import json
import os
from datetime import datetime

USER_FILE = "users.json"

# ---------------- Load Users ----------------
def load_users():
    if os.path.exists(USER_FILE):
        with open(USER_FILE, "r") as f:
            content = f.read().strip()
            if content:
                return json.loads(content)
    return {}

# ---------------- Save Users ----------------
def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=4)

# ---------------- Save Game Result ----------------
def save_game_result(username, game_name, score):
    users = load_users()
    if username in users:
        result = {
            "game": game_name,
            "score": score,
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        users[username]["results"].append(result)
        save_users(users)
        return True
    return False

# ---------------- Calculate Suggestions ----------------
def calculate_suggestions(score):
    suggestions = []
    if score >= 80:
        suggestions.append("Excellent performance! Keep up the good mental activity.")
    elif score >= 50:
        suggestions.append("Good job! Try to improve focus and memory further.")
    else:
        suggestions.append("Needs improvement. Try more concentration exercises.")
    suggestions.append("Remember to take breaks and maintain good sleep.")
    return suggestions
