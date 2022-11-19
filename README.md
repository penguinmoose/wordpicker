# The Word Picker is down right now. It should be fixed by Dec 10.

# Word Picker

The Word Picker provides a way to easily find words that follow a spelling or sound pattern. The homepage is the advanced search page, with many options to choose from, wheras the Early Reading page gives a more intuitive interface for people to find words and create word lists.

[Go to main page](http://www.thewordpicker.com)

[Launch now](http://www.thewordpicker.com/main)



# Early Reading

Early Reading provides an intuitive interface to easily find words.

The Early Reading page consists of tabs that have patterns on them, which are labeled by the category of the pattern. One additional tab is the custom tab, in which custom patterns that are not one of the presets can be searched.

## Custom search and the custom box
In the 'custom' tab, a custom pattern can be built 3 ways:

- Clicking the custom box and typing the pattern
- Dragging the custom icons from below the custom box into the custom box
- Clicking the custom icons from below the custom box to append the icon to the custom pattern

### Other buttons
- Pressing the button with the trash icon removes all custom icons from the custom box
- Pressing the find words button finds the inputed custom pattern

### Icon descriptions
- Open: Open vowel - input key is 'o'
- Closed: Closed vowel - input key is 'c'
- Vowel R: Vowel R (ar, er, ir, ur, or) - input key is 'r'
- Vowel Team: Vowel Team - input key is 't'
- Silent E: Silent E - input key is 'e'
- (Consonant): Consonant element - input key is (space)
- (Anything): Any quantity of any element between surrounding icons. If the anything icon is put at the beginning of the pattern, the word must end with the rest of the pattern, and vice versa for if the icon is put at the end. If the custom pattern is only an anything icon, all of the word list will be shown. - input key is '-'


# Word list select
To the right of the Word Picker icon in the top bar, there is a select dropdown in which the word list to search from can be chosen from these options:

- Early reading word list (default): Word list for early readers and contains less than 500 entries
- 10000 words word list: Word list that contains about 10000 of the most commonly used words - note that word list contains individual letters that are not words (such as b, c, z, etc)
- CMU dict (shown as 'all words'): All words, common or uncommon. Some entries may even not be a proper word, such as 'aaa'. Using this word list is not reccomended unless other word lists do not contain any results or the words you want.

# Camera words tab
Camera words are words that usually need to be memorized. Clicking this tab shows a list of them in the result box. No actual content is on this tab.

# Temporary clipboard
The temporary clipboard is a list in which you can add words to from results. In the result box, words can be selected by clicking them. To add results to the temporary clipboard, select words in the result box and press the 'add selected' button to add.

The temporary clipboard list is a sidebar. Open it by clicking the clipboard icon in the top title bar and close it by clicking the 'x' in the temporary clipboard heading.



# The Word Picker API

The Word Picker API is a web API (hosted by Amazon Web Services) in which the webpage makes HTTP requests to. The source code for this API can be found under 'eb-flask' in the Word Picker directory, which contains both the code that is used to find words and also the word lists.

Request URL: http://www.wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com/api/words

Docs to be continued
