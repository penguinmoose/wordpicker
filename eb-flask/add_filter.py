import sys

def update_word_list(filter_file, filter_name):
    with open("word_phoneme.txt", 'r') as f:
        lines = f.readlines()

    with open(filter_file, 'r') as f:
        filter_words = f.read().splitlines()

    with open("word_phoneme-" + filter_name + ".txt", 'w') as f:
        for l in lines:
            word = l.rstrip().split(":")[0]
            if word in filter_words:
                f.write(l.rstrip() + ':' + filter_name + '\n')
            else:
                f.write(l)

update_word_list(sys.argv[1], sys.argv[2])
