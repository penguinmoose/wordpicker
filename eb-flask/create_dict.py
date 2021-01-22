import string
import sys

def load_phone_dict():
    dict = {}
    translation = str.maketrans(string.ascii_letters, string.ascii_letters, string.digits)
    with open("word-list/cmudict-0.7b.txt", 'r', encoding='ISO-8859-1') as f:
        for line in f:
            if line.startswith(';;;'):
                continue
            [word, phone] = line.split("  ", 1)
            phone = phone.rstrip().translate(translation) # Don't care about the digits, which represents stress. Stress means the pitch of the sound.
            dict[word.lower()] = phone
    return dict

def load_word_list():
    with open(sys.argv[1]) as f:
        word_list = f.read().splitlines()
    return word_list

word_list = load_word_list()
phone_dict = load_phone_dict()
with open(sys.argv[2], "w") as f:
    for w in word_list:
        if w in phone_dict:
            f.write(w + ":" + phone_dict[w] + '\n')
        else:
            print(w)
