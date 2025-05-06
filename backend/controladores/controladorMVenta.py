from flask import Blueprint

Mventa = Blueprint("venta",__name__)

@Mventa.route("/mantenedor_venta")
def mantenedor_venta():
    return {"mantenedor_venta":["mantenedor_venta1","mantenedor_venta2"]}