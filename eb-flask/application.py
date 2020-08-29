import flask
from flask import request, jsonify
from flask_cors import CORS
import re
from lxml import html
import requests

application = flask.Flask(__name__)
cors = CORS(application, resources={r"/api/*": {"origins": "*"}})
application.config["DEBUG"] = True

def load_word_list():
    with open("10000words.txt") as f:
        word_list = f.read().splitlines()
    return word_list

@application.route('/', methods=['GET'])
def home():
    return "<h1>Word sentence API</h1> <p>API for finding words or sentences with matching criteria.</p>"

@application.route('/api/words/all', methods=['GET'])
def api_words_all():
    word_list = load_word_list()
    return jsonify(word_list)


@application.route('/api/words', methods=['GET'])
def api_words_pattern():
    if 'pattern' not in request.args:
        return "pattern missing", 400

    word_list = load_word_list()
    input = request.args['pattern']
    results = []
    for pattern in input.split(','): # build reglex string
        query = ''
        group = 0
        for c in pattern.strip():
            if c=='C':
                query = query + '([b-df-hj-np-tv-xz])' # add ([b-df-hj-np-tv-xz]) to query if detected capital C
                group += 1
            elif c=='V':
                query = query + '([aeiou])' # add ([aeiou]) to query if detected capital V
                group += 1
            elif c=='-':
                query = query + '[a-z]*'; # add [a-z]* to query if detected dash
            elif c>='2' and c<='9':
                query = query + '\\' + str(group) + '{' + str(int(c)-1) + '}' # stuff to do if there is a number
            else:
                query = query + c

        query = '^' + query + '$'
        prog = re.compile(query)
        result = list(filter(lambda s: prog.match(s), word_list))
        results.extend(result)

    return jsonify(results) # return json format


@application.route('/api/sentences', methods=['GET'])
def api_sentences_pattern():
    if 'pattern' not in request.args:
        return "pattern missing", 400

    pattern = request.args['pattern']
    page = requests.get('https://sentence.yourdictionary.com/' + pattern) # get results from yourdictionary
    tree = html.fromstring(page.content)

    sentences = tree.xpath('//div[@class="sentence component"]/p')
    sentences = [e.text_content() for e in sentences]

    return jsonify(sentences)

if __name__ == "__main__":
    application.run(debug=True, use_reloader=False)
