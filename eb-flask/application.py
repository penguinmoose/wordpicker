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

def load_word_list(filter):
    dict = {}
    with open("word_phoneme.txt", 'r') as f:
        lines = f.readlines()
        for line in lines:
            r = line.rstrip().split(":")
            word = r[0]
            phone = r[1]
            if len(r) == 3:
                type = r[2]
            else:
                type = None
            if (filter is None) or (filter == type):
                dict[word] = ' ' + phone + ' '
    return dict

@application.route('/', methods=['GET'])
def home():
    return "<h1 style='color: #39568f'>Word Picker API</h1> <p>API for finding words or sentences with matching criteria.</p>"

@application.route('/api/words/all', methods=['GET'])
def api_words_all():
    word_list = load_word_list()
    return jsonify(list(word_list.keys()))

def spelling_match(word_pattern, filter, maxwordlen):
    with open("word-list/" + filter + ".txt", 'r') as f:
        word_list = f.read().splitlines()

    wordlen = 60
    if maxwordlen is not None:
        wordlen = int(maxwordlen)
    word_list = [v for v in word_list if (len(v) > 1) and (len(v) <= wordlen)]

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

    results = []
    for word in word_list:
        matched = True
        for p in re_list:
            if not p.match(word):
                matched = False
                break
        if not matched:
            continue

        results.append(word)
    return results

def phone_match(phone_pattern):
    with open("word-list/phone-dict.txt", 'r') as f:
        word_list = f.read().splitlines()

    if phone_pattern is None:
        return None

    phone_patterns = None
    if phone_pattern:
        phone_patterns = [" " + s.strip() + " " for s in phone_pattern.upper().split(',')]

    results = []
    for line in word_list:
        word, phoneme = line.split(':')
        matched = False
        for p in phone_patterns:
            if p in " " + phoneme + " ":
                matched = True
                break
        if matched:
            results.append(word)

    return results

def st_match(st):
    with open("word-list/syllable-dict.txt", 'r') as f:
        word_list = f.read().splitlines()

    if st is None:
        return None

    re_list = []
    for pattern in st.split(','): # build reglex string
        query = ''
        for c in pattern.strip():
            if c=='-':
                query = query + '.*';
            elif c=='?':
                query = query + '.'
            elif c=='v': # vowels
                query = query + '[COTR]'
            else:
                query = query + c

        query = '^' + query + '$'
        #print(query)
        p = re.compile(query)
        re_list.append(p)

    results = []
    for line in word_list:
        word, syllable = line.split(':')
        matched = False
        for p in re_list:
            if p.match(syllable):
                matched = True
                break
        if matched:
            results.append(word)

    return results

def word_match(word_pattern, phone_pattern, filter, maxwordlen, st):
    result = spelling_match(word_pattern, filter, maxwordlen)

    phone_result = phone_match(phone_pattern)
    if phone_result is not None:
        result = [value for value in result if value.lower() in phone_result]

    st_result = st_match(st)
    if st_result is not None:
        result = [value for value in result if value.lower() in st_result]

    return result

@application.route('/api/words', methods=['GET'])
def api_words_pattern():
    matches = word_match(request.args.get('pattern'),
                        request.args.get('phone'),
                        request.args.get('filter'),
                        request.args.get('maxwordlen'),
                        request.args.get('st'))

    resmaxlen = request.args.get('resmaxlen')
    if resmaxlen:
        matches = matches[:int(resmaxlen)]

    format = request.args.get('format')
    if format == 'txt':
        result = '\n'.join(matches)
    else:
        result = jsonify(matches)

    return result # return json format


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
    #application.run(host="localhost", port=8000)
