from flask import Blueprint

Mbodega = Blueprint("bodega",__name__)

@Mbodega.route("/mantenedor_bodega")
def mantenedor_bodega():
    return {"mantenedor_bodega":["mantenedor_bodega1","mantenedor_bodega2"]}