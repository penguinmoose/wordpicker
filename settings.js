var randBackground = true;

function saveSettings() {
  localStorage.setItem("settings-randbackground", document.getElementById("settings-randbackground").checked.toString());
  localStorage.setItem("settings-italicres", document.getElementById("settings-italicresult").checked.toString());
  localStorage.setItem("settings-reswidth", document.getElementById("resultcontainer-width-slider").value);
  applySettings();
}

function applySettings() {
  randBackground = getCookie("settings-randbackground");
  document.getElementById("settings-randbackground").checked = (randBackground == "true");

  if (localStorage.getItem("settings-italicres") == "true") {
    document.getElementsByClassName("resultcontainer")[0].style.fontStyle = "italic";
    document.getElementsByClassName("resultcontainer")[1].style.fontStyle = "italic";
  } else {
    document.getElementsByClassName("resultcontainer")[0].style.fontStyle = "normal";
    document.getElementsByClassName("resultcontainer")[1].style.fontStyle = "normal";
  }
  document.getElementById("settings-italicresult").checked = (localStorage.getItem("settings-italicres") == "true");

  if (localStorage.getItem("settings-reswidth") != null) {
    document.getElementsByClassName("resultcontainer")[0].style.width = localStorage.getItem("settings-reswidth").toString() + "px";
    document.getElementsByClassName("resultcontainer")[1].style.width = localStorage.getItem("settings-reswidth").toString() + "px";
    document.getElementById("resultcontainer-width-slider").value = localStorage.getItem("settings-reswidth");
  }

  document.getElementById("settings").style.display = "none";
}

function openSettings() {
  if (typeof(Storage) === "undefined") {
    document.getElementsByClassName("settings-nostorage-alert")[0].style.display = "block";
  }
  
  document.getElementById("settings").style.display = "block";
  document.getElementById("moreDropdown").style.display = "none";
}

function showReswidthSliderValue() {
  var value = document.getElementById("resultcontainer-width-slider").value;
  document.getElementById("reswidth-value-text").innerHTML = value + " pixels";
}
