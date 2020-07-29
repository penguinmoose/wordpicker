import flask
from flask import request, jsonify

app = flask.Flask(__name__)
app.config["DEBUG"] = True

word_list = ['cat', 'dog', 'turtle']

@app.route('/', methods=['GET'])
def home():
    return "<h1>Word sentence API</h1> <p>API for finding words or sentences with matching criteria.</p>"

@app.route('/api/words/all', methods=['GET'])
def api_words_all():
    return jsonify(word_list)


@app.route('/api/words', methods=['GET'])
def api_words_pattern():
    if 'pattern' in request.args:
        pattern = request.args['pattern']
        return pattern

app.run()
