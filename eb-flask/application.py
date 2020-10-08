import flask
from flask import request, jsonify
from flask_cors import CORS
import re
from lxml import html
import requests
from string import digits

application = flask.Flask(__name__)
cors = CORS(application, resources={r"/api/*": {"origins": "*"}})
application.config["DEBUG"] = True

def load_word_list():
    dict = {}
    with open("word_phoneme.txt", 'r') as f:
        lines = f.readlines()
        for line in lines:
            [word, phone] = line.rstrip().split(":")
            dict[word] = ' ' + phone + ' '
    return dict

@application.route('/', methods=['GET'])
def home():
    return "<h1>Word sentence API</h1> <p>API for finding words or sentences with matching criteria.</p>"

@application.route('/api/words/all', methods=['GET'])
def api_words_all():
    word_list = load_word_list()
    return jsonify(list(word_list.keys()))

def word_match(word_pattern, phone_pattern):
    word_list = load_word_list()
    re_list = []
    if word_pattern:
        for pattern in word_pattern.split(','): # build reglex string
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
            p = re.compile(query)
            re_list.append(p)

    if phone_pattern:
        phone_pattern = " " + phone_pattern + " "
    else:
        phone_pattern = ""

    results = []
    for word, phoneme in word_list.items():
        matched = True
        for p in re_list:
            if not p.match(word):
                matched = False
                break
        if not matched:
            continue

        if phone_pattern not in phoneme:
            continue

        results.append(word)
    return results

@application.route('/api/words', methods=['GET'])
def api_words_pattern():
    #if 'pattern' not in request.args:
    #    return "pattern missing", 400

    matches = word_match(request.args.get('pattern'), request.args.get('phone'))

    matches = matches[:50] # max 50 results

    return jsonify(matches) # return json format


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
