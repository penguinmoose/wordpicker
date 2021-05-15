#!/usr/bin/env python

import sys
import fileinput
import re

allLettersPattern = re.compile('^[A-Z]*$')
VOWELS = ["AE", "EH", "IH", "AA", "AH", "EY", "IY", "AY", "OW", "UW", "AW", "AA_R", "AO_R", "ER", "UH_R", "AO", "OY", "UH"]

def allLetters(inputString):
    return allLettersPattern.match(inputString) is not None

def arprabet_to_syllable(arprabet):
    if not arprabet[0].isalpha():
        return

    arprabet = arprabet.rstrip('\n')
    # print("processing: " + arprabet)
    spelling, pron = arprabet.split('  ')
    if not allLetters(spelling):
        return
    pron = ''.join([i for i in pron if not i.isdigit()])
    pron = pron.replace('AA R', 'AA_R').replace('AO R', 'AO_R').replace('UH R', 'UH_R')
    vs = [i for i in pron.split(' ') if i in VOWELS] # vowel sound
    vb = re.split('[B-DF-HJ-NP-TV-XZ]', spelling)
    vb = [value for value in vb if value != ""] # remove all empty elements

    silent_e = re.compile(".*[AEIOU][B-DF-HJ-NP-TV-XZ]E$")
    result = []
    for i, v in enumerate(vs):
        if v in ["EY", "IY", "AY", "OW", "UW", "AW"]:
            if (i < len(vb)) and (len(vb[i]) == 2):
                result.append("T") # vowel team
            elif (i == len(vs) - 1) and (silent_e.match(spelling) is not None):
                result.append("E") # silent E
            else:
                result.append("O") # open
        elif v in ["AA_R", "AO_R", "ER", "UH_R"]:
            result.append("R") # vowel R
        elif v in ["AE", "EH", "IH", "AA", "AH"]:
            result.append("C") # closed
        else:
            result.append("U") # unknown

    return spelling.lower() + ":" + "".join(result)


if __name__ == '__main__':
    for line in fileinput.input():
        result = arprabet_to_syllable(line)
        if result is not None:
            print(result)
