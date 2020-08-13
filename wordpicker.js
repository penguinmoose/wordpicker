console.log("welcome to word picker");


function CopyToClipboard(containerid) {
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();// to deselect
}


function go(to) {
  document.getElementById('0').style.display = "none";
  document.getElementById('1').style.display = "none";
  document.getElementById(to).style.display = "block";

  var tabs = document.getElementsByClassName("fancytab");
  tabs[0].classList.remove('active');
  tabs[1].classList.remove('active');
  tabs[to].classList.add('active');
}

////////

function init() {
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}

////////

function changeUrl(site) {
  document.getElementsByName('resultpage')[0].src = site;
}


function startWords() {
  var req = (document.getElementById("req").value);
  if (req !== null) {
    var url = "http://wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com/api/words?pattern=" + req;
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        appendData(data);
      })
      .catch(function(err) {
        alert("there was a error. + err");
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
  } else {
    alert("please type something in the input field.");
  }
}


function startSentences() {
  var req = (document.getElementById("reqsentence").value);
  if (req !== null) {
    var url = "http://127.0.0.1:5000/api/sentences?pattern=" + req;
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        appendData(data);
      })
      .catch(function(err) {
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
