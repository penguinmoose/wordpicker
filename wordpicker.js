var host = "wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com";

console.log("welcome to word picker");

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
  document.getElementById("header") = "loading results..."

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

    document.getElementById("word-copy-button").style.display = "block";

    function appendData(data) {
      var mainContainer = document.getElementById("matched_words");
      mainContainer.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = data[i];
        mainContainer.appendChild(div);

        document.getElementById("header") = "word picker";
      }
    }
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
  } else {
    alert("please type something in the input field.");
  }
}
