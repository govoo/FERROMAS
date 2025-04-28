from flask import Flask

app = Flask(__name__)

@app.route("/home")
def home():
    return{"pepito":["pepito1","pepito2 "]}

if __name__ == "__main__":
    app.run(debug=True)