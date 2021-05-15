#!/usr/bin/env python3

import string
import sys
import re

allLettersPattern = re.compile('^[A-Z]*$')

def allLetters(inputString):
    return allLettersPattern.match(inputString) is not None

def load_phone_dict():
    dict = {}
    translation = str.maketrans(string.ascii_letters, string.ascii_letters, string.digits)
    with open("word-list/cmudict-0.7b.txt", 'r', encoding='ISO-8859-1') as f:
        for line in f:
            if line.startswith(';;;'):
                continue
            [word, phone] = line.split("  ", 1)
            if not allLetters(word):
                continue

            phone = phone.rstrip().translate(translation) # Don't care about the digits, which represents stress. Stress means the pitch of the sound.
            print(word.lower() + ':' + phone)

load_phone_dict()
