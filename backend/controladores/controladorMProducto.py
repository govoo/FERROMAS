from flask import Blueprint

Mproducto = Blueprint("producto",__name__)

@Mproducto.route("/mantenedor_producto")
def mantenedor_producto():
    return {"mantenedor_producto":["mantenedor_producto1","mantenedor_producto2"]}