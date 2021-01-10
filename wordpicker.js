// TODO: make phrase picker
//var host = "127.0.0.1:5000";
var host = "www.wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com";

var section_list = ["word_picker", "sentence_picker", "instructions"]; // add phrase_picker when phrase picker is avalible
var button_list = ["wd_button", "sn_button", "in_button"]; // add ph_button when phrase picker is avalible

const queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);

console.log("Welcome to Word Picker!");

function init() {
  var view = urlParams.get('view');

  if (window.location.protocol == "https:") {
    window.location.href = window.location.href.replace("https:", "http:");
  }

  if ((detectMobile() == true) || (view == "mobile")) {
    document.getElementById("main").style.marginLeft = 0;
    document.getElementById("sidenav").style.display = "none";
    document.getElementById("bottomnav").style.display = "block";
  }

  applySettings();
  changepage(1);
  startWords("prev");
  startSentences("prev");
  //startPhrases("prev");
  setBackground();

  setTimeout(() => {
    document.getElementById("loading-container").style.display = "none";
  }, 500);
}

function changepage(pg) {
  event.preventDefault();

  for (var i = 0; i < 3; i++) {
    document.getElementById(section_list[i]).style.display = "none";
    document.getElementById(button_list[i] + "_mobile").className = "";
    document.getElementById(button_list[i]).style.border = "none";
  }

  document.getElementById(section_list[pg - 1]).style.display = "block";
  document.getElementById(button_list[pg - 1]).style.border = "20px solid #1752e8";
  document.getElementById(button_list[pg - 1] + "_mobile").className = "active";
}

function addError(error) {
  document.getElementById("error-alert").style.display = "block";

  var node = document.createElement("LI");
  var textnode = document.createTextNode(error);
  node.appendChild(textnode);
  document.getElementById("errors").appendChild(node);
}

function dismissErrorAlert() {
  document.getElementById('error-alert').style.display = 'none';
  // Remove existing errors from error list
  const errorList = document.getElementById("errors");
  errorList.textContent = '';
}

function clearData() {
  localStorage.clear();
  location.reload();
}

function detectMobile() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}

function setBackground() {
  var backgroundImg = "url('background-" + parseInt(Math.floor(Math.random() * 4) + 1) + ".jpg') no-repeat center center fixed";
  if (randBackground = false) {
    var stored_background = getCookie("background");
    if (stored_background != "") {
      document.body.style.background = stored_background;
    } else {
      document.body.style.background = backgroundImg;
      setCookie("background", backgroundImg, 1);
    }
  } else {
    document.body.style.background = backgroundImg;
  }
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("more-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function toggleMoreDropdown() {
  if (document.getElementById('moreDropdown').style.display == "none") {
    document.getElementById('moreDropdown').style.display = "block";
  } else {
    document.getElementById('moreDropdown').style.display = "none";
  }
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en'
  }, 'google_translate_element');
}

////////////////////////////////////////////////////////
function toggleSoundDropdown() {
  event.preventDefault();
  document.getElementById("soundDropdown").classList.toggle("show");
}

function soundFilterFunction() {
  var input, filter, ul, li, button, i;
  input = document.getElementById("soundSearch");
  filter = input.value.toUpperCase();
  div = document.getElementById("soundDropdown");
  button = div.getElementsByTagName("button");

  for (i = 0; i < button.length; i++) {
    txtValue = button[i].textContent || button[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      button[i].style.display = "";
    } else {
      button[i].style.display = "none";
    }
  }
}

function addSound(sound) {
  event.preventDefault();
  var oldsound = document.getElementById("phone").value;
  document.getElementById("phone").value = oldsound + " " + sound;
}

////////////////////////////////////////////////////////

function startWords(type) {
  var pattern = (document.getElementById("pattern").value);
  var phone = (document.getElementById("phone").value);
  var selectbuttons = document.getElementsByName("filter-button");
  var maxresultselect = document.getElementById("limitresult-options");
  var resultmaxlengh = document.getElementById("resultmaxlengh");

  for (var i = 0, length = selectbuttons.length; i < length; i++) {
    if (selectbuttons[i].checked) {
      var filter = selectbuttons[i].value;
      break;
    }
  }

  if (pattern == "" && phone == "" && type == "") { // Oh, the user didn't enter anything. Alert them.
    alert("Please enter something in the input field. Refer to the instructions (go to the instructions tab in the sidebar) for what to type there.");
    return;
  } else if (pattern == "" && phone == "" && type == "prev") { // Time to load results from previous session!
    pattern = localStorage.getItem("wdpk_pattern");
    phone = localStorage.getItem("wdpk_phone");
    filter = localStorage.getItem("wdpk_filter");

    document.getElementById("pattern").value = pattern;
    document.getElementById("phone").value = phone;
  } else if (pattern != "" && phone != "") { // Time to save!
    localStorage.setItem("wdpk_pattern", document.getElementById("pattern").value);
    localStorage.setItem("wdpk_phone", document.getElementById("phone").value);
  }

  var patternparam = (pattern == "") ? "" : "pattern=" + pattern;
  var phoneparam = (phone == "") ? "" : "&phone=" + phone;
  var resultmaxlenparam = (document.getElementById("limitresult-toggle").checked == false) ? "" : "&resmaxlen=" + maxresultselect.value;
  var wordmaxlenparam = (document.getElementById("resultmaxlen-toggle").checked == false) ? "" : "&wordmaxlen=" + resultmaxlengh.value;

  var url = "http://" + host + "/api/words?" + patternparam + phoneparam + filter + resultmaxlenparam + wordmaxlenparam;
  fetch(url)
    .then(function(response) {
      console.log(response);
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      appendData(data);
    })
    .catch(function(err) {
      addError("Error finding words: " + err);
      console.log("error:" + err);
    });

  function appendData(data) {
    var mainContainer = document.getElementById("matched_words");
    mainContainer.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
      var div = document.createElement("div");
      div.innerHTML = data[i];
      document.getElementById("resultcontainer-1").style.display = "block";
      mainContainer.appendChild(div);
    }
  }
}

//////////////////////////////////////////////////

function startSentences(type) {
  var req = (document.getElementById("reqsentence").value);

  if (req == "" && type == "") { // Oh, the user didn't enter anything. Alert them.
    alert("Please enter something in the input field. Refer to the instructions (go to the instructions tab in the sidebar) for what to type there.");
    return;
  } else if (req == "" && type == "prev") { // Time to load results from previous session!
    var stored_req = localStorage.getItem("snpk_req");
    if (stored_req != null) { // Again, check if nothing is stored.
      req = stored_req;
      document.getElementById("reqsentence").value = localStorage.getItem("snpk_req");
    }
  } else if (req != "") { // Time to save!
    localStorage.setItem("snpk_req", document.getElementById("reqsentence").value);
  }

  var url = "http://" + host + "/api/sentences?pattern=" + req;
  fetch(url)
    .then(function(response) {
      console.log(response);
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      appendData(data);
    })
    .catch(function(err) {
      addError("Error finding sentences: " + err);
      console.log('error: ' + err);
    });

  function appendData(data) {
    var mainContainer = document.getElementById("matched_sentences");
    mainContainer.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
      var div = document.createElement("div");
      div.innerHTML = data[i];
      document.getElementById("resultcontainer-2").style.display = "block";
      mainContainer.appendChild(div);
    }
  }
}

//////////////////////////////////////////////////
/*

function startPhrases(type) {
  var startswith = document.getElementById("phrase_startswith").value;
  var endswith = document.getElementById("phrase_endswith").value;
  var contains = document.getElementById("phrase_contains").value;
  var wordlengh = document.getElementById("phrase_wordlengh").value;
  var wordlengh_comparison_select = document.getElementById("phrase-wordlengh-comparison-select");
  var phraselengh = document.getElementById("phrase_lengh");
  var phraselengh_format_select = document.getElementById("phrase-lengh-format-select");

  if (startswith == "" && endswith == "" && contains == "" && wordlengh == "" && phraselengh == "" && type == "") { // Oh, the user didn't enter anything. Alert them.
    alert("Please enter something in the input field. Refer to the instructions (go to the instructions tab in the sidebar) for what to type there.");
    return;
  } else if (startswith == "" && endswith == "" && contains == "" && wordlengh == "" && phraselengh == "" && type == "prev") { // Time to load results from previous session!
    startswith = localStorage.getItem("phpk_startswith");
    endswith = localStorage.getItem("phpk_endswith");
    contains = localStorage.getItem("phpk_contains");
    wordlengh = localStorage.getItem("phpk_wordlengh");
    phraselengh = localStorage.getItem("phpk_phraselengh");

    document.getElementById("phrase_startswith").value = localStorage.getItem("phpk_startswith");
    document.getElementById("phrase_endswith").value = localStorage.getItem("phpk_endswith");
    document.getElementById("phrase_contains").value = localStorage.getItem("phpk_contains");
    document.getElementById("phrase_wordlengh").value = localStorage.setItem("phpk_wordlengh");
    document.getElementById("phrase_lengh").value = localStorage.setItem("phpk_phraselengh");
  } else if (startswith != "" && endswith != "" && contains != "" && wordlengh != "" && phraselengh != "") { // Time to save!
    localStorage.setItem("phpk_startswith", startswith);
    localStorage.setItem("phpk_endswith", endswith);
    localStorage.setItem("phpk_contains", contains);
    localStorage.setItem("phpk_wordlengh", wordlengh);
    localStorage.setItem("phpk_phraselengh", phraselengh);
  }
}*/
