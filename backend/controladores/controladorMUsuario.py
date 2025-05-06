from flask import Blueprint

Musuario = Blueprint("usuario",__name__)

@Musuario.route("/mantenedor_usuario")
def mantenedor_usuario():
    return {"mantenedor_usuario":["mantenedor_usuario1","mantenedor_usuario2"]}