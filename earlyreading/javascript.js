var sdtab = document.getElementById('sdtab');
const randomString = (length = 6) => Math.random().toString(20).substr(2, length);

var buttons = [
  "VC",
  "CVC",
  "CVCC",
  "CCVC",
  "CCVCC",
  "CVO",
  "CCVO",
  "R",
  "RC",
  "CRC",
  "CT",
  "TC",
  "CTC",
  "VCE",
  "CVCE",
  "CCVCE"
]

var patternkeycodes = {
  32: 'consonant',
  67: 'closed',
  79: 'open',
  82: 'vowelr',
  84: 'vowelteam',
  69: 'silente',
  189: 'wildcard'
}

var iconids = {
  'custom-closed': 'C',
  'custom-consonant': 'c',
  'custom-open': 'O',
  'custom-end': '',
  'custom-vowelteam': 'T',
  'custom-vowelr': 'R',
  'custom-silente': 'E',
  'custom-wildcard': '-'
}

var camerawords = ['goes','does','what','were','was','their','there','could','should','would','you','been','to','do','are','of','said','from','they','your','some','front','who','one','done','put','both','walk','pull','come','push','full','busy','people','through','listen','hour','eye','month','laugh','son','door','shoe','whose','talk','chalk','own','build','buy','length','half','lose','move','clothes','really','now','know','once','two','none','very','about','friend','won','thought','year','wash','because']

function showSS() {
  sdtab.style.display = 'block';
  document.getElementById('searchtab').checked = true;
  searchbuttons();
}

function hideSS() {
  sdtab.style.display = 'none';

  if (document.getElementById('searchtab').checked == true) {
    document.getElementById('searchtab').checked = '';
    document.getElementById('tab1').checked = true;
  }
}

function searchbuttons() {
  var searchresults = searchlist(document.getElementById('searchinput').value, buttons);
  removeAllChildNodes(document.getElementById('searchresult-buttons'));

  for (i = 0; i < searchresults.length; i++) {
    var buttonelement = document.getElementById('button-' + searchresults[i]);
    var clone = buttonelement.cloneNode(true);
    clone.id = 'searchresult-' + clone.id; // Assign the clone another ID
    document.getElementById('searchresult-buttons').appendChild(clone);
    document.getElementById('searchresult-buttons').appendChild(document.createElement("br"));
  }
}

function processcustomkeypress(ev) {
  var keycode = (event.which || event.keyCode);

  if (keycode in patternkeycodes) {
    addcustomitem(patternkeycodes[keycode]);
  } else if (keycode = 8) {
    var box = document.getElementById('custompatternbox');
    box.removeChild(box.lastChild)
  }
}

function addcustomitem(name) {
  var id = 'custom-' + name;
  var clone = document.getElementById('custom-' + name).cloneNode(true);
  clone.id = clone.id + '-' + randomString(5);
  document.getElementById('custompatternbox').appendChild(clone);
  document.getElementById(id).onclick = () => {
    document.getElementById(data + '-box').prepend(document.getElementById(data))
  };
  document.getElementById('custombox-text').remove();
}

function searchlist(query, list) {
  var result = [];

  for (i = 0; i < list.length; i++) {
    if (list[i].includes(query)) {
      result.push(list[i]);
    }
  }

  return result;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function drag(ev) {
  ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData('text');
  var clone = document.getElementById(data).cloneNode(true);
  clone.id = clone.id + '-' + randomString(5);
  document.getElementById('custompatternbox').appendChild(clone);
  document.getElementById(data).onclick = () => {
    document.getElementById(data + '-box').prepend(document.getElementById(data))
  };
  document.getElementById('custombox-text').remove();
}

function dragdelete(ev) {
  var object = document.getElementById(ev.dataTransfer.getData('text'));
  if (!(ev.target.classList.contains('nodelete') || document.getElementById('dragoptioncontainer').contains(object))) {
    ev.preventDefault();
    object.remove();
  }
}

function getpattern() {
  var result = '';
  var icons = document.getElementById('custompatternbox').children;
  for (i = 0; i < icons.length; i++) {
    result = result + iconids[icons[i].id.substring(0, icons[i].id.length - 6)];
  }
  return result;
}

function findwords(input) {
  document.getElementById('searchresults').style.display = 'block';
  console.log("Finding results for pattern: " + input);
  document.getElementById('searchresults').innerHTML = 'Finding words...';
  request(input, 'http://www.wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com');
}

function showcamerawords() {
  document.getElementById('searchresults').style.display = 'block';
  document.getElementById('searchresults').innerHTML = camerawords.join("<br>");
  console.log('Displayed camera words.');
}

function request(pattern, url) {
  fetch(url + '/api/words?st=' + pattern + '&filter=earlyreading')
    .then(function(response) {
      console.log('Server responce:', response);
      return response.json();
    })
    .then(function(data) {
      console.log('Sucessfully fetched result from server. Processed responce:', data);
      if (data.length) { // there are results
        document.getElementById('searchresults').innerHTML = data.toString().replace(/,/g, '<br>'); // turn the array into a string seperated by HTML newlines (<br>), then change the results
      } else { // there are no results
        document.getElementById('searchresults').innerHTML = 'No results<br><br>Try a broader search, or go to <a href="http://www.thewordpicker.com/">home page</a> for advanced search';
      }
    })
    .catch(function(err) {
      console.log('Error: ' + err);
      document.getElementById('searchresults').innerHTML = 'Sorry, there was an error while finding the words.<br><br>Error message: ' + err
    });
}

setInterval(function() {
  if (document.getElementById('searchinput').offsetWidth < 100) {
    hideSS();
  }
}, 500);

document.getElementById('custompatternbox').setAttribute('ondrop', 'drop(event)');
