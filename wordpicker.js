var host = "wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com";

console.log("welcome to word picker");

function init() {
  if (window.location.protocol == "https:") {
    window.location.href = window.location.href.replace("https:", "http:");
  }

  document.getElementById("resultcontainer-1").style.display = "none";
  document.getElementById("resultcontainer-2").style.display = "none";
}

function changeUrl(site) {
  document.getElementsByName('resultpage')[0].src = site;
}

////////////////////////////////////////////////////////

function startWords() {
  document.getElementById("resultcontainer-1").style.display = "block";

  var pattern = (document.getElementById("pattern").value);
  var phone = (document.getElementById("phone").value);

  if (pattern !== null) {
    var url = "http://" + host + "/api/words?pattern=" + pattern + "&phone=" + phone;
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
  } else {
    alert("please type something in the input field.");
  }
}

//////////////////////////////////////////////////

function startSentences() {
  document.getElementById("resultcontainer-2").style.display = "block";

  var req = (document.getElementById("reqsentence").value);
  if (req !== null) {
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
