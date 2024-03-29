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
    silent_e = re.compile(".*[AEIOU][B-DF-HJ-NP-TV-XZ]E$")
    if (silent_e.match(spelling) is not None): # if vowel R followed by silent E then ignore VR
        if pron.endswith('_R'):
            pron = pron[:-2] + ' R'
        if pron.endswith('ER'):
            pron = pron[:-2] + 'R'
    sy = pron.split(' ') # full syllable list
    vs = [i for i in pron.split(' ') if i in VOWELS] # vowel sound
    vb = re.split('[B-DF-HJ-NP-TVXZ]', spelling) # vowel blocks
    vb = [value for value in vb if (value != "") and (not (value.startswith("W") and len(value) <= 2))] # remove all empty elements. W is a special case for vowel teams.

    result = []
    j = 0
    for i, v in enumerate(sy):
        #print(str(i) + v + '\n')
        #print(spelling + "-")
        if v not in VOWELS:
            result.append("c")
            continue

        if (v in ["EY", "IY", "AY", "OW", "UW", "AW", "AO", "UH", "EH", "IH"]) \
            and ((j < len(vb)) and (len(vb[j]) >= 2)):
            result.append("T") # vowel team
        elif v in ["EY", "IY", "AY", "OW", "UW", "AW", "AO", "UH"]:
            result.append("O") # open
        elif v in ["AA_R", "AO_R", "ER", "UH_R"]:
            result.append("R") # vowel R
        elif v in ["AE", "EH", "IH", "AA", "AH", "AO"]:
            result.append("C") # closed
        else:
            result.append("U") # unknown
        j = j + 1

    if silent_e.match(spelling) is not None:
        result.append("E") # silent E

    return spelling.lower() + ":" + "".join(result)


if __name__ == '__main__':
    for line in fileinput.input():
        result = arprabet_to_syllable(line)
        if result is not None:
            print(result)
