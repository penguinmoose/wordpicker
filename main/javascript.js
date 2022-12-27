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

var movedclones = [];

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

var camerawords = ['goes', 'does', 'what', 'were', 'was', 'their', 'there', 'could', 'should', 'would', 'you', 'been', 'to', 'do', 'are', 'of', 'said', 'from', 'they', 'your', 'some', 'front', 'who', 'one', 'done', 'put', 'both', 'walk', 'pull', 'come', 'push', 'full', 'busy', 'people', 'through', 'listen', 'hour', 'eye', 'month', 'laugh', 'son', 'door', 'shoe', 'whose', 'talk', 'chalk', 'own', 'build', 'buy', 'length', 'half', 'lose', 'move', 'clothes', 'really', 'now', 'know', 'once', 'two', 'none', 'very', 'about', 'friend', 'won', 'thought', 'year', 'wash', 'because']

selected = [];
results = [];

function processcustomkeypress(ev) {
  var keycode = (event.which || event.keyCode);

  if (keycode in patternkeycodes) {
    addcustomitem(patternkeycodes[keycode]);
    document.getElementById('custombox-text').remove();
  } else if (keycode = 8) {
    var box = document.getElementById('custompatternbox');
    box.removeChild(box.lastChild)
  }
}

function addcustomitem(name) {
  var id = 'custom-' + name;
  var clone = document.getElementById('custom-' + name).cloneNode(true);
  clone.id = clone.id + '-' + randomString(8);
  document.getElementById('custompatternbox').appendChild(clone);
  document.getElementById(id).onclick = () => {
    document.getElementById(data + '-box').prepend(document.getElementById(data))
  };
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
  clone.id = clone.id + '-' + randomString(8);
  clone.style.position = 'absolute';
  clone.style.left = ev.clientX + 'px';
  document.getElementById('custompatternbox').appendChild(clone);

  customdrag(clone);

  document.getElementById('custombox-text').remove();
}

function dragdelete(ev) {
  var object = document.getElementById(ev.dataTransfer.getData('text'));
  if (!(ev.target.classList.contains('nodelete') || document.getElementById('dragoptioncontainer').contains(object))) {
    ev.preventDefault();
    object.remove();
  }
}

function customdrag(dragItem) {
  var container = document.getElementById("custompatternbox");
  var active = false;
  var currentX, currentY, initialX, initialY;
  var xOffset = 0;
  var yOffset = 0;

  container.addEventListener("touchstart", dragStart, false);
  container.addEventListener("touchend", dragEnd, false);
  container.addEventListener("touchmove", drag, false);
  container.addEventListener("mousedown", dragStart, false);
  container.addEventListener("mouseup", dragEnd, false);
  container.addEventListener("mousemove", drag, false);

  function dragStart(e) {
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
    } else {
      initialX = e.clientX - xOffset;
    }

    if (e.target === dragItem) {
      active = true;
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    active = false;
  }

  function drag(e) {
    if (active) {
      e.preventDefault();
      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
      } else {
        currentX = e.clientX - initialX;
      }

      xOffset = currentX;
      setTranslate(currentX, 0, dragItem);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }
}


function getpattern() {
  var result = '';

  var posmapping = {};
  var positions = [];
  var icons = document.getElementById('custompatternbox').children;

  for (i = 0; i < icons.length; i++) {
    posmapping[icons[i].getBoundingClientRect().left] = iconids[icons[i].id.substring(0, icons[i].id.length - 9)];
    positions.push(icons[i].getBoundingClientRect().left);
  }

  positions.sort();

  for (i = 0; i < icons.length; i++) {
    result = result + posmapping[positions[i]];
  }
  return result;
}


function removeChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function fallbackClipboardCopy(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text; // create a textbox so that it can be copied
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful!' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy:', err);
  }

  document.body.removeChild(textArea);
}

function copyToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackClipboardCopy(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function findwords(input) {
  document.getElementById('searchresultsbox').style.display = 'block';
  console.log("Finding results for pattern: " + input);
  document.getElementById('searchresults').innerHTML = 'Please wait - finding words...';
  request(input, 'http://www.wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com');
}

function showcamerawords() {
  document.getElementById('searchresultsbox').style.display = 'block';
  document.getElementById('selectcountbox').style.display = 'block';
  document.getElementById('searchresults').innerHTML = makeresulthtml(camerawords);
  console.log('Displayed camera words.');
}

function makeresulthtml(results) {
  var lines = [];
  for (i = 0; i < results.length; i++) {
    lines.push(`<div class="resultitem" onclick="selectword('` + results[i] + `', this)">` + results[i] + '</div>');
  }

  return lines.join('<br>');
}

function selectword(word, element) {
  document.getElementsByClassName('addtempclipbtn')[0].innerHTML = 'Add selected to temporary clipboard';
  document.getElementsByClassName('addtempclipbtn')[0].style.padding = '2px 14px';
  selected.push(word);
  element.style.backgroundColor = '#70a5ff';
  document.getElementById('selectcount').innerHTML = parseInt(document.getElementById('selectcount').innerHTML) + 1;
}

function clearselected() {
  selected = [];
  document.getElementById('selectcount').innerHTML = '0';
  resultelement = document.getElementById('searchresults');

  for (i = 0; i < resultelement.children.length; i++) {
    resultelement.children[i].style.backgroundColor = '';
  }

  document.getElementsByClassName('addtempclipbtn')[0].innerHTML = 'Add results to temporary clipboard';
  document.getElementsByClassName('addtempclipbtn')[0].style.padding = '2px 18px';
}

function addselected() {
  if (selected.length) {
    for (i = 0; i < selected.length; i++) {
      tempclipadd(selected[i]);
    }
  } else {
    for (i = 0; i < results.length; i++) {
      tempclipadd(results[i]);
    }
  }

  clearselected();
  updatetempclipcount();
}

function updatetempclipcount() {
  var tempclipcount = document.getElementById('tempclipcontent').children.length;
  document.getElementById('tempclip-itemcount').innerHTML = tempclipcount.toString();
}

function tempclipadd(item) {
  document.getElementById("tempclipcontent").insertAdjacentHTML('beforeend', '<div onclick="this.remove()" class="tempclipitem"><span class="tempclipitemtext">' + item + '</span><span class="material-icons tempclipremove-btn">remove_circle</span></div>');
}

function gettempclip() {
  var contentelements = document.getElementsByClassName('tempclipitemtext');
  var result = [];

  for (i = 0; i < contentelements.length; i++) {
    result.push(contentelements[i].innerHTML);
  }
  return result;
}

function copytempclip() {
  var tempclip = gettempclip();
  copyToClipboard(tempclip.join('\r\n'));
}

function request(pattern, apiurl) {
  spellingparam = (document.getElementById('spellingpatterninput').value == "") ? "&pattern=-" : "&pattern=" + document.getElementById('spellingpatterninput').value;
  rlparam = (document.getElementById('resultlimit').value == "") ? "" : "&resmaxlen=" + document.getElementById('resultlimit').value;
  wlparam = (document.getElementById('resultlengthlimit').value == "") ? "" : "&maxwordlen=" + document.getElementById('resultlengthlimit').value;

  var url = apiurl + '/api/words?st=' + pattern + spellingparam + rlparam + wlparam + '&filter=' + document.getElementById('wordlistselect').value;
  console.log("Request URL: " + url)
  fetch(url)
    .then(function(response) {
      console.log('Server responce:', response);
      return response.json();
    })
    .then(function(data) {
      console.log('Sucessfully fetched result from server. Processed responce:', data);
      if (data.length) { // there are results
        results = data;
        document.getElementById('selectcountbox').style.display = 'block';
        document.getElementById('searchresults').innerHTML = makeresulthtml(data);
      } else { // there are no results
        document.getElementById('searchresults').innerHTML = 'No results<br><br>Try a broader search, or go to <a href="http://www.thewordpicker.com/">home page</a> for advanced search';
      }
    })
    .catch(function(err) {
      console.log('Error: ' + err);
      document.getElementById('selectcountbox').style.display = 'none';
      document.getElementById('searchresults').innerHTML = 'Sorry, there was an error while finding the words.<br><br>Error message: ' + err
    });
}

function toggleTheme() {
  if (document.body.style.backgroundColor == '#0d316f') {
    document.body.style.backgroundColor = '#b5d0ff';
  } else {
    document.body.style.backgroundColor = '#0d316f';
  }
}

document.getElementById('custompatternbox').setAttribute('ondrop', 'drop(event)');
