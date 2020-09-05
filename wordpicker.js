var host = "wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com";

console.log("welcome to word picker");


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function loadPrevData() {
  if (matched_words != "" || matched_sentences != "") {
    document.getElementById("reqsentence").innerHTML = getCookie("input_s");
    document.getElementById("req").value = getCookie("input_w");
    document.getElementById("matched_words").value = getCookie("matched_w");
    document.getElementById("matched_sentences").value = getCookie("matched_s");
  }
}


function CopyToClipboard(containerid) {
  var range = document.createRange();
  range.selectNode(document.getElementById(containerid));
  window.getSelection().removeAllRanges(); // clear current selection
  window.getSelection().addRange(range); // to select text
  document.execCommand("copy");
  window.getSelection().removeAllRanges(); // to deselect
}

////////////////////////////////////////////

function changeUrl(site) {
  document.getElementsByName('resultpage')[0].src = site;
}

////////////////////////////////////////////////////////

function startWords() {
  document.getElementById("word-copy-button").style.display = "block";

  var req = (document.getElementById("req").value);

  if (req !== null) {
    var url = "http://" + host + "/api/words?pattern=" + req;
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        appendData(data);
      })
      .catch(function(err) {
        alert("There was a error: " + err);
        console.log('error: ' + err);
      });

    function appendData(data) {
      var mainContainer = document.getElementById("matched_words");
      mainContainer.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = data[i];
        mainContainer.appendChild(div);
      }
    }

    setCookie("matched_w", document.getElementById("matched_words"), 50);
    setCookie("input_w", document.getElementById("req"), 50);
  } else {
    alert("please type something in the input field.");
  }
}

//////////////////////////////////////////////////

function startSentences() {
  document.getElementById("sentence-copy-button").style.display = "block";

  var req = (document.getElementById("reqsentence").value);
  if (req !== null) {
    var url = "http://" + host + "/api/sentences?pattern=" + req;
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        appendData(data);
      })
      .catch(function(err) {
        alert("There was a error: " + err);
        console.log('error: ' + err);
      });

    function appendData(data) {
      var mainContainer = document.getElementById("matched_sentences");
      mainContainer.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = data[i];
        mainContainer.appendChild(div);
      }
    }

    setCookie("matched_s", document.getElementById("matched_sentences"), 50);
    setCookie("input_s", document.getElementById("reqsentence"), 50);
  } else {
    alert("please type something in the input field.");
  }
}
