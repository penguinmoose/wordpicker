var randBackground = true;

function saveSettings() {
  var selectbuttons = document.getElementsByClassName("colorselect");
  localStorage.setItem("settings-randbackground", document.getElementById("settings-randbackground").checked.toString());
  localStorage.setItem("settings-italicres", document.getElementById("settings-italicresult").checked.toString());
  localStorage.setItem("settings-reswidth", document.getElementById("resultcontainer-width-slider").value);
  for (var i = 0, length = selectbuttons.length; i < length; i++) {
    if (selectbuttons[i].checked) {
      localStorage.setItem("settings-themecolor", selectbuttons[i].value);
      break;
    }
  }

  applySettings();
}

function applySettings() {
  var hexdict = {
    "#45d938": "greenselect",
    "#3895d9": "blueselect",
    "#6c38d9": "purpleselect",
    "#d93855": "redselect",
    "#d99438": "orangeselect",
    "#d9c938": "yellowselect"
  }
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

  if (localStorage.getItem("settings-themecolor") != null) {
    document.getElementsByClassName("heading-1")[0].style.backgroundColor = localStorage.getItem("settings-themecolor");
  }

  document.getElementById("settings").style.display = "none";
}

function openSettings() {
  if (typeof(Storage) === "undefined") {
    document.getElementsByClassName("settings-nostorage-alert")[0].style.display = "block";
  }

  document.getElementById("settings").style.display = "block";
  document.getElementById("moreDropdown").style.display = "none";
  closeMobileSidebar();
}

function showReswidthSliderValue() {
  var value = document.getElementById("resultcontainer-width-slider").value;
  document.getElementById("reswidth-value-text").innerHTML = value + " pixels";
}
