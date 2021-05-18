//var host = "127.0.0.1:5000";
var host = "www.wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com";
var findingWords = false;

var section_list = ["word_picker", "early_reading", "sentence_picker", "instructions"];
var button_list = ["wd_button", "el_button", "sn_button", "in_button"];
var currentPage = 1;

const queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);

console.log(`
_   _  __   _    __    _       __   _____    ___   _ __   ___   ___
\\ \\/ \\/  / / \\  |   \\ | \\     |  \\ |_   _|  /  _| | / /  | __| |   \\
 \\  /\\  / |   | |   / |  |    |  /  _| |_   | |_  |  |   | __| |   /
  \\/  \\/  \\__/  |_|\\_\\|_/     |_|  |_____|  \\___| |_\\_\\  |___| |_|\\_\\
`);

window.onload = function() {
  var toggler = document.getElementsByClassName("caret");
  var i;
  var view = urlParams.get('view');

  if (window.location.protocol == "https:") {
    window.location.href = window.location.href.replace("https:", "http:");
  }

  if ((detectMobile() == true) || (view == "mobile")) {
    document.getElementById("main").style.marginLeft = 0;
    document.getElementsByClassName("heading-icon")[0].style.marginLeft = "30px";
    document.getElementById("sidenav").style.display = "none";
    document.getElementById("bottomnav").style.display = "block";
    document.getElementsByClassName("mobile-heading")[0].style.display = "block";
  } else {
    document.getElementsByClassName("heading-1")[0].style.display = "block";
  }

  applySettings();
  if (getCookie("prevuser") == "") {
    toggleTooltip();
  }
  changepage(1);
  startWords("prev");
  startSentences("prev");
  setBackground();

  for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }

  setTimeout(() => {
    document.getElementById("loading-container").style.display = "none";
  }, 800);
}

function changepage(pg) {
  event.preventDefault();

  for (var i = 0; i < 4; i++) {
    document.getElementById(section_list[i]).style.display = "none";
    document.getElementById(button_list[i] + "_mobile").className = "";
    document.getElementById(button_list[i]).style.border = "none";
  }

  document.getElementById(section_list[pg - 1]).style.display = "block";
  document.getElementById(button_list[pg - 1]).style.border = "20px solid #1752e8";
  document.getElementById(button_list[pg - 1] + "_mobile").className = "active";
  currentPage = pg;
}

function closeMobileSidebar() {
  document.getElementsByClassName('mobilesidebar')[0].style.width = '0px';
}

$(document).keydown(function(event) {
  var key = (event.keyCode ? event.keyCode : event.which);

  if (key == 40 && currentPage != 4) {
    changepage(currentPage + 1);
  } else if (key == 38 & currentPage != 1) {
    changepage(currentPage - 1);
  }
});

$(function() {
  $('#phone').keypress(function(e) {
    let disallowed_char = [192, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 186, 190, 191, 186, 222, 187, 219, 221, 220];
    if (disallowed_char.indexOf(e.which) !== -1) {
      return false;
    }
  });
});

function toggleTooltip(off) {
  if (off == 'off') {
    document.getElementById("newuser-tooltip").classList.remove("show-tooltip");
    return;
  } else {
    document.getElementById("newuser-tooltip").classList.toggle("show-tooltip");
    setCookie("prevuser", "true", 100);
  }
}

function openWordList() {
  window.open('http://www.johanneschan.com/wordpicker/eb-flask/word-list/10000words.txt', 'popUpWindow',
    'height=500, width=400, left=300, top=200, resizable=yes, scrollbars=yes, toolbar=yes, menubar=no, location=no, directories=no, status=yes');
}

function changeTheme(theme) {
  if (theme == "d") {
    document.body.style.color = "white";
    changeBackgroundOfElements("sidebuttons", "#213c8c");
    changeBackgroundOfElements("heading-1", "#858585");
    changeBackgroundOfElements("inputcontainer", "#666666");
    changeBackgroundOfElements("instructioncontainer", "#505050");
    changeBackgroundOfElements("settings", "#1c539c");
    changeBackgroundOfElements("more-dropdown-content-button", "#888");
    changeBackgroundOfElements("error-alert", "#bd2e2e");
    changeBackgroundOfElements("bluebox", "#3171b4");

    document.getElementById("theme-icon").src = "icons/light-mode-icon.png";
    document.getElementById("theme-change-button").innerHTML = "Light Mode";
    document.getElementById("theme-change-button").setAttribute("onclick", "changeTheme('l')");
    document.getElementById("mobile-theme-change-button").innerHTML = "Light Mode";
    document.getElementById("mobile-theme-change-button").setAttribute("onclick", "changeTheme('l')");
  } else {
    document.body.style.color = "black";
    changeBackgroundOfElements("sidebuttons", "#00c2f5");
    changeBackgroundOfElements("heading-1", "#dddddd");
    changeBackgroundOfElements("inputcontainer", "#9c9c9c");
    changeBackgroundOfElements("instructioncontainer", "#b9b9b9");
    changeBackgroundOfElements("settings", "#2f89ff");
    changeBackgroundOfElements("more-dropdown-content-button", "#eeeeee");
    changeBackgroundOfElements("error-alert", "#ff2f2f");
    changeBackgroundOfElements("bluebox", "#5b9cdf");

    document.getElementById("theme-icon").src = "icons/dark-mode-icon.png";
    document.getElementById("theme-change-button").innerHTML = "Dark Mode";
    document.getElementById("theme-change-button").setAttribute("onclick", "changeTheme('d')");
    document.getElementById("mobile-theme-change-button").innerHTML = "Dark Mode";
    document.getElementById("mobile-theme-change-button").setAttribute("onclick", "changeTheme('d')");
  }
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

function detectMobile() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
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
  if (!findingWords) {
    document.getElementById("findwords-btn").innerHTML = "Finding words...";
    document.getElementById("findwords-btn").style.backgroundColor = "#86f48b";
    document.getElementById("findwords-btn-loadicon").style.display = "block";
    findingWords = true;

    var pattern = (document.getElementById("pattern").value);
    var phone = (document.getElementById("phone").value);
    var syllabletype = (document.getElementById("syllabletype").value);
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
    var syllabletypeparam = (syllabletype == "") ? "" : "&st=" + syllabletype;
    var resultmaxlenparam = (document.getElementById("limitresult-toggle").checked == false) ? "" : "&resmaxlen=" + maxresultselect.value;
    var wordmaxlenparam = (document.getElementById("resultmaxlen-toggle").checked == false) ? "" : "&maxwordlen=" + resultmaxlengh.value;

    var url = "http://" + host + "/api/words?" + patternparam + phoneparam + filter + resultmaxlenparam + wordmaxlenparam + syllabletypeparam;
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

        findingWords = false
        document.getElementById("findwords-btn").innerHTML = "find words";
        document.getElementById("findwords-btn").style.backgroundColor = "#35c43b";
        document.getElementById("findwords-btn-loadicon").style.display = "none";
      });

    function appendData(data) {
      var mainContainer = document.getElementById("matched_words");
      mainContainer.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = data[i];
        document.getElementById("resultcontainer-1").style.display = "block";
        mainContainer.appendChild(div);

        findingWords = false
        document.getElementById("findwords-btn").innerHTML = "find words";
        document.getElementById("findwords-btn").style.backgroundColor = "#35c43b";
        document.getElementById("findwords-btn-loadicon").style.display = "none";
      }
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
      console.error("There was an error.\n" + err);
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
