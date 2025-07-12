from flask import Flask, request, jsonify, render_template_string, current_app
from controladores import home_bp, Musuario, Mproducto, Mventa, Mbodega
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.integration_type import IntegrationType
from transbank.common.options import WebpayOptions

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'ferromas_db'
app.config['JWT_SECRET_KEY'] = 'clave-super-secreta'

CORS(app)
mysql = MySQL(app)
app.extensions["mysql"] = mysql
jwt = JWTManager(app)

commerce_code = '597055555532'
api_key = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
integration_type = IntegrationType.TEST
options = WebpayOptions(commerce_code, api_key, integration_type)
tx = Transaction(options)

@app.route('/')
def index():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM usuario")
    data = cur.fetchall()
    cur.close()
    usuarios = [{"id": u[0], "nombre": u[1], "correo": u[4]} for u in data]
    return jsonify({"usuarios": usuarios})

@app.route('/pago', methods=['POST'])
def crear_pago():
    data = request.json
    monto = data.get('monto', 0)
    usuario = data.get('usuario', 'anon')
    buy_order = f"orden-{usuario}-{str(data.get('timestamp', '0'))}"
    session_id = f"session-{usuario}"
    return_url = "http://localhost:3000/retorno"

    if not monto or not usuario:
        return jsonify({"error": "Datos insuficientes"}), 400

    try:
        response = tx.create(buy_order, session_id, monto, return_url)
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/retorno', methods=['GET', 'POST'])
def retorno():
    token_ws = request.args.get('token_ws') or request.form.get('token_ws')
    if not token_ws:
        return "Token no recibido"

    try:
        response = tx.commit(token_ws)
        if response['status'] == 'AUTHORIZED':
            mysql = current_app.extensions["mysql"]
            cur = mysql.connection.cursor()
            cur.execute("""
                INSERT INTO ventas (Usuario_idUsuario, cantidad_productos, fecha_venta, total)
                VALUES (%s, %s, NOW(), %s)
            """, (1, 1, response['amount']))
            mysql.connection.commit()
            cur.close()
            html = f"<h1>Pago exitoso</h1><p>Monto: {response['amount']}</p>"
        else:
            html = "<h1>Pago no autorizado</h1>"
        return render_template_string(html)
    except Exception as e:
        return "Error al procesar el pago"

@app.route('/redireccionar_pago/<token>', methods=['GET'])
def redireccionar_pago(token):
    html = f'''
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Redireccionando a Webpay...</title>
    </head>
    <body onload="document.forms['pagoForm'].submit();">
      <h2>Redireccionando a Webpay...</h2>
      <form id="pagoForm" name="pagoForm" action="https://webpay3gint.transbank.cl/webpayserver/initTransaction" method="POST">
        <input type="hidden" name="token_ws" value="{token}">
        <noscript>
          <p>JavaScript está deshabilitado. Haz clic en el botón para continuar con el pago.</p>
          <button type="submit">Continuar</button>
        </noscript>
      </form>
    </body>
    </html>
    '''
    return html

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')  # Correo electrónico
    password = data.get('password')  # Clave del usuario

    cur = mysql.connection.cursor()
    cur.execute("SELECT idUsuario, clave_usuario FROM usuario WHERE correo_usuario = %s", (username,))
    user = cur.fetchone()
    cur.close()

    if not user or user[1] != password:
        return jsonify({'msg': 'Credenciales inválidas'}), 401

    access_token = create_access_token(identity=user[0])
    return jsonify(access_token=access_token), 200

@app.route('/perfil', methods=['GET'])
@jwt_required()
def perfil():
    usuario_id = get_jwt_identity()
    return jsonify({"mensaje": f"Acceso autorizado. Usuario ID: {usuario_id}"})

def obtener_usuario_id_por_session(session_id):
    mysql = app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("SELECT idUsuario FROM usuario WHERE correo_usuario = %s", (session_id,))
    data = cur.fetchone()
    cur.close()
    if data:
        return data[0]
    return None

def obtener_carrito(usuario_id):
    cantidad_productos = 3
    productos = [
        {"id": 1, "cantidad": 1, "precio": 1000},
        {"id": 2, "cantidad": 2, "precio": 2000}
    ]
    return cantidad_productos, productos

def guardar_venta(usuario_id, cantidad_productos, total, productos):
    mysql = app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""
        INSERT INTO ventas (Usuario_idUsuario, cantidad_productos, fecha_venta, total)
        VALUES (%s, %s, NOW(), %s)
    """, (usuario_id, cantidad_productos, total))
    venta_id = cur.lastrowid
    for producto in productos:
        cur.execute("""
            INSERT INTO detalle_venta (Ventas_idVentas, Producto_idProducto, cantidad)
            VALUES (%s, %s, %s)
        """, (venta_id, producto["id"], producto["cantidad"]))
    mysql.connection.commit()
    cur.close()

app.register_blueprint(home_bp)
app.register_blueprint(Musuario)
app.register_blueprint(Mproducto)
app.register_blueprint(Mventa)
app.register_blueprint(Mbodega)

if __name__ == "__main__":
    app.run(debug=True)
