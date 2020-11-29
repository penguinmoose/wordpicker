console.log("script");

var host = "wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com";

var section_list = ["word_picker", "sentence_picker", "instructions"];
var button_list = ["wd_button", "sn_button", "in_button"];

console.log("welcome to word picker");

function init() {
  if (window.location.protocol == "https:") {
    window.location.href = window.location.href.replace("https:", "http:");
  }

  document.getElementById("resultcontainer-1").style.display = "none";
  document.getElementById("resultcontainer-2").style.display = "none";

  changepage(1);
  startWords("prev");
  startSentences("prev");
}

function changeUrl(site) {
  document.getElementsByName('resultpage')[0].src = site;
}

function changepage(pg) {
  for (var i = 0; i < 3; i++) {
    document.getElementById(section_list[i]).style.display = "none";
    document.getElementById(button_list[i]).style.border = "none";
  }

  document.getElementById(section_list[pg - 1]).style.display = "block";
  document.getElementById(button_list[pg - 1]).style.border = "20px solid #1752e8";
}

////////////////////////////////////////////////////////

function startWords(type) {
  var pattern = (document.getElementById("pattern").value);
  var phone = (document.getElementById("phone").value);

  if (pattern == "" && phone == "" && type == "") { // Oh, the user didn't enter anything. Alert them.
    alert("Please enter something in the input field. Refer to the instructions (go to the instructions tab in the sidebar) for what to type there.");
    return;
  } else if (pattern == "" && phone == "" && type == "prev") { // Time to load results from previous session!
    pattern = localStorage.getItem("wdpk_pattern");
    phone = localStorage.getItem("wdpk_phone");
    document.getElementById("pattern").value = localStorage.getItem("wdpk_pattern");
    document.getElementById("phone").value = localStorage.getItem("wdpk_phone");
  } else if (pattern != "" && phone != "") { // Time to save!
    localStorage.setItem("wdpk_pattern", document.getElementById("pattern").value);
    localStorage.setItem("wdpk_phone", document.getElementById("phone").value);
  }

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
      if (confirm("An error was detected. \n" + err + "\n Make sure that some software isn't blocking the url wordpicker-eb.eba-zkdtc4h6.us-west-2.elasticbeanstalk.com. \n\n Do you want to retry?") == true) {
        startWords();
      }
      console.log('error: ' + err);
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
    req = localStorage.getItem("snpk_req");
    document.getElementById("reqsentence").value = localStorage.getItem("snpk_req");
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
      if (confirm("An error was detected. \n" + err + "\n\n Do you want to retry?") == true) {
        startSentences();
      }
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
