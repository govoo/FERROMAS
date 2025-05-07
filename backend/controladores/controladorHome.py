from flask import Blueprint, current_app

home_bp = Blueprint("home",__name__)

@home_bp.route("/home")
def home():
    return {"home":["home1","home2"]}