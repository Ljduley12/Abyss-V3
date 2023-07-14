let workerLoaded;

document.body.onerror = function (message, source, lineno, colno, error) {
  alert(`DEV: Error: ${message}\nSource: ${source}\nLine: ${lineno}`);
};


if (localStorage.getItem("title") && localStorage.getItem("sc")) {
  document.title = localStorage.getItem("title");
  let oldFavicon = undefined;
  var link = document.createElement('link')
  link.id = 'favicon';
  link.type = 'image/x-icon'
  link.rel = 'icon';
  link.href = localStorage.getItem("sc");
  if (oldFavicon) {
    document.head.removeChild(oldFavicon);
  }
  document.head.appendChild(link);
  document.getElementById("cloakFav").placeholder = localStorage.getItem("sc");
  document.getElementById("cloakTitle").placeholder = localStorage.getItem("title");
}

function cloakFavicon(com) {
  var link = document.createElement('link')
  link.id = 'favicon';
  link.type = 'image/x-icon'
  link.rel = 'icon';
  link.href = com;
  oldFavicon = document.getElementById('favicon');
  if (oldFavicon) {
    document.head.removeChild(oldFavicon);
  }
  document.head.appendChild(link);
  localStorage.setItem("sc", com);
  return com;
}

function cloakTitle(com) {
  document.title = com;
  localStorage.setItem("title", com);
  return com;
}

function cloak() {
  cloakTitle(prompt('If you have a title for the tab, input it here, or the title will be "Google Docs"') || "Google Docs");
  cloakFavicon(prompt("If you have a tab icon, input it here, or Google Doc's icon will be used.") || "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico");
}

function uncloak() {
  if (confirm("This will require a refresh to take effect. Continue?")) {
    localStorage.removeItem("title");
    localStorage.removeItem("sc");
    location.reload();
  }
}

var abt = null;
var fscr = false;
var set = null;

async function runService(URL) {
  var url = document.getElementById("adrbar").value;
  if (URL) url = URL;
  if (url.trim() == "") {
    return;
  }
  console.log("%cDEV:%c Running service: %c" + url, "font-weight: bold", "font-weight: normal", "font-weight: normal");
  if (abt != null) {
    abt.remove();
    abt = null;
  }
  if (set != null) {
    set.remove();
    set = null;
  }
  if (/^(abyss:)(\/){0,2}([a-z]|\d)+$/.test(url.trim()) == true) {
    var path = url.trim().replace(/^(abyss:)\/*/, "");
    if (path == "about" || path == "") {
      ts.getActiveTab().getConnectedElement().querySelector("svg").style.display = "initial";
      if (ts.getActiveTab() == null) {
        document.getElementById("adrbar").value = "";
        return;
      }
      if (ts.getActiveTab().findFirstIFrame() != null) {
        ts.getActiveTab().findFirstIFrame().remove();
      }
      document.getElementById("adrbar").placeholder =
        "About Abyss (abyss://about)";
      document.getElementById("adrbar").value = "";
      abt = document.getElementById("about-template").cloneNode(true);
      abt.style.display = "initial";
      abt.id = ts.genRanId();
      ts.getActiveTab().getTabElement().querySelector(".center").style.display = "none";
      // set background color to transparent
      ts.getActiveTab().getTabElement().style.backgroundColor = "transparent";
      if (fscr) abt.classList.add("fullscreenPaged");
      ts.getActiveTab().getTabElement().appendChild(abt);
      return;
    } else if (path == "newtab") {
      ts.getActiveTab().getConnectedElement().querySelector("svg").style.display = "initial";
      if (ts.getActiveTab() == null) {
        document.getElementById("adrbar").value = "";
        return;
      }
      ts.getActiveTab().getTabElement().querySelector(".center").style.display = "initial";
      // reset transparent
      ts.getActiveTab().getTabElement().style.backgroundColor = "var(--background-color)";
      if (ts.getActiveTab().findFirstIFrame() != null) {
        ts.getActiveTab().findFirstIFrame().remove();
      }
      document.getElementById("adrbar").placeholder =
        "Starting Page (abyss://newtab)";
      document.getElementById("adrbar").value = "";
      return;
    } else if (path == "discord") {
      ts.getActiveTab().getConnectedElement().querySelector("svg").style.display = "initial";
      window.open("https://discord.gg/goabyss");
      document.getElementById("adrbar").value = "";
      return;
    } else if (path == "github") { //dont change anything please just try to fix the error i dont want anything changed i am supposed to release soon
      ts.getActiveTab().getConnectedElement().querySelector("svg").style.display = "initial";
      window.open("https://github.com/code-alt");
      document.getElementById("adrbar").value = "";
      return;
    } else if (path == "settings") {
      ts.getActiveTab().getConnectedElement().querySelector("svg").style.display = "initial";
      if (ts.getActiveTab() == null) {
        document.getElementById("adrbar").value = "";
        return;
      }
      if (ts.getActiveTab().findFirstIFrame() != null) {
        ts.getActiveTab().findFirstIFrame().remove();
      }
      document.getElementById("adrbar").placeholder =
        "Settings (abyss://settings)";
      document.getElementById("adrbar").value = "";
      set = document.getElementById("settings-template").cloneNode(true);
      set.style.display = "initial";
      set.id = ts.genRanId();
      ts.getActiveTab().getTabElement().querySelector(".center").style.display = "none";
      ts.getActiveTab().getTabElement().style.backgroundColor = "transparent";
      if (fscr) set.classList.add("fullscreenPaged");
      ts.getActiveTab().getTabElement().appendChild(set);
      set.querySelector("#themeSelect").value = tHs.getActiveTheme().getName();
      return;
    }
  }
  if (/^:\/{0,2}/.test(url)) {
    url = url.replace(/^:\/{0,2}/, "https://");
  }
  if (!isUrl(url)) {
    url = "https://www.google.com/search?q=" + url;
  }
  if (!hasHttpPrefix(url)) {
    url = "https://" + url;
  }
  document.getElementById("adrbar").placeholder = url;
  if (
    ts.getActiveTab() != null &&
    ts.getActiveTab().findFirstIFrame() == null
  ) {
    console.log("%cDEV:%c Connecting to service -> loading", "font-weight: bold", "font-weight: normal");

    if (typeof navigator.serviceWorker === "undefined")
      alert(
        "An error occured registering your service worker. Please contact support - discord.gg/abyss"
      );

    if (!workerLoaded) await worker();
    var iframe = document.createElement("iframe");
    iframe.src = "/service/route?url=" + encodeURIComponent(url);
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.zIndex = 1000000;
    iframe.style.borderRadius = "15px";
    if (fscr) iframe.style.borderRadius = "0";
    ts.getActiveTab().getTabElement().appendChild(iframe);
    ts.getActiveTab().getConnectedElement().querySelector("svg").style.display = "none";
    var img = document.createElement("img");
    img.src = "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url="+url+"&size=64";
    ts.getActiveTab().getConnectedElement().querySelector("svg").parentNode.appendChild(img);
    fetch("/service/route?url=" + encodeURIComponent(url))
        .then((res) => res.text())
        .then((html) => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, "text/html");
          console.log("%cDEV:%c" + doc, "font-weight: bold", "font-weight: normal");
          var title = doc.querySelector("title").innerText;
          ts.getActiveTab().getConnectedElement().querySelector("svg").parentNode.parentNode.querySelector("label").innerText = title;
        });
    document.getElementById("adrbar").value = "";
  } else if (
    ts.getActiveTab() != null &&
    ts.getActiveTab().findFirstIFrame() != null
  ) {
    ts.getActiveTab().findFirstIFrame().src = "/service/route?url=" + encodeURIComponent(url);
    document.getElementById("adrbar").value = "";
  } else {
    ts.setActiveTab(ts.addTab(new Tab(ts.createTabBtn(), ts.createTabFrame())));
    runService(url);
  }
}

async function worker() {
  return await navigator.serviceWorker.register("/sw.js", {
    scope: "/service",
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  await worker();

  workerLoaded = true;
});

function isUrl(val = "") {
  if (
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g.test(val)
  )
    return true;
  return false;
}
function hasHttpPrefix(val = "") {
  if (/^http(s?):\/\//.test(val)) return true;
  return false;
}

window.addEventListener(
  "keyup",
  (event) => {
    if (event.key == "Enter") {
      if (document.activeElement.id == "adrbar") {
        runService();
      }
      else if (document.activeElement.dataset.is == "clFav") {
        cloakFavicon(document.activeElement.value);
      }
      else if (document.activeElement.dataset.is == "clTitle") {
        cloakTitle(document.activeElement.value);
      }
    }
  },
  true
);

function fcsr() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

document.getElementById("TabsBar").addEventListener(
  "wheel",
  (evt) => {
    evt.preventDefault();

    if (evt.deltaY >= -15 && evt.deltaY <= 15) {
      document.getElementById("TabsBar").scrollLeft += evt.deltaY * 40;
    } else {
      document.getElementById("TabsBar").scrollLeft += evt.deltaY * 5;
    }
  },
  { passive: false }
);

function back() {
  if (ts.getActiveTab() != null) {
    if (ts.getActiveTab().findFirstIFrame() != null) {
      ts.getActiveTab().findFirstIFrame().contentWindow.history.back();
    }
  }
}

function forwards() {
  if (ts.getActiveTab() != null) {
    if (ts.getActiveTab().findFirstIFrame() != null) {
      ts.getActiveTab().findFirstIFrame().contentWindow.history.forward();
    }
  }
}

function reload() {
  if (ts.getActiveTab() != null) {
    if (ts.getActiveTab().findFirstIFrame() != null) {
      ts.getActiveTab().findFirstIFrame().contentWindow.location.reload();
    }
  }
}

function opPO() {
  // pop out the proxy tab
  if (ts.getActiveTab() != null) {
    if (ts.getActiveTab().findFirstIFrame() != null) {
      // open about:blank window, and embed
      var win = window.open("about:blank", "_blank", "width=500,height=500");
      // ts.getActiveTab().findFirstIFrame().src = window.location.host + ts.getActiveTab().findFirstIFrame().src;
      const frame = document.createElement("iframe");
      frame.src = ts.getActiveTab().findFirstIFrame().src;
      win.document.body.appendChild(frame); 
      ts.deleteTab(ts.getActiveTab(), true);
      frame.style.cssText = "margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1000000; border: none; border-radius: 0;";
    }
  }
}

function opNT() {
  if (ts.getActiveTab() != null) {
    if (ts.getActiveTab().findFirstIFrame() != null) {
      var win = window.open("about:blank", "_blank");
      const frame = document.createElement("iframe");
      frame.src = ts.getActiveTab().findFirstIFrame().src;
      win.document.body.appendChild(frame);
      ts.deleteTab(ts.getActiveTab(), true);
      frame.style.cssText = "margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1000000; border: none; border-radius: 0;";
    }
  }
}

function opST() {
  if (ts.getActiveTab() == null) {
    ts.setActiveTab(ts.addTab(new Tab(ts.createTabBtn(), ts.createTabFrame())));
  }
  runService("abyss://settings");
}

function about() {
  if (ts.getActiveTab() == null) {
    ts.setActiveTab(ts.addTab(new Tab(ts.createTabBtn(), ts.createTabFrame())));
  }
  runService("abyss://about");
}


function handleFullscreenChange() {
  if (document.fullscreenElement) {
    if (ts.getActiveTab() != null) {
      ts.getActiveTab().getTabElement().classList.add("fullscreenPaged");
    }
    document.getElementById("TabsBar").style.display = "none";
    document.getElementById("BtnsBar").style.display = "none";
    document.getElementById("leftBorder").style.display = "none";
    if (ts.getActiveTab() && ts.getActiveTab().findFirstIFrame()) ts.getActiveTab().findFirstIFrame().style.borderRadius = "0";
    if (abt != null) abt.classList.add("fullscreenPaged");
    if (set != null) set.classList.add("fullscreenPaged");
    fscr = true;

  } else {
    if (ts.getActiveTab() != null) {
      ts.getActiveTab().getTabElement().classList.remove("fullscreenPaged");
    }
    document.getElementById("TabsBar").style.display = "initial";
    document.getElementById("BtnsBar").style.display = "initial";
    document.getElementById("leftBorder").style.display = "initial";
    if (ts.getActiveTab() && ts.getActiveTab().findFirstIFrame()) ts.getActiveTab().findFirstIFrame().style.borderRadius = "15px";
    if (abt != null) abt.classList.remove("fullscreenPaged");
    if (set != null) set.classList.remove("fullscreenPaged");
    fscr = false;
  }
}

function addDropElem(name) {
  var select = document.getElementById("themeSelect");
  var option = document.createElement("option");
  option.value = name;
  option.innerText = name;
  select.appendChild(option);
}

function getThemes() {
  fetch("/resources/availablethemes.json")
    .then((res) => res.json())
    .then((json) => {
      for (const themeName in json) {
        const theme = json[themeName];
        console.log("%cDEV:%c Found %c" + themeName + " %c" + theme.URL, "font-weight: bold", "font-weight: normal", "font-weight: bold", "font-weight: normal");
        x = new Theme(theme.URL, themeName)
        tHs.addTheme(x);
        addDropElem(themeName);
      }
    });
}

window.onload = () => {
  handleFullscreenChange();
  getThemes();
};

function themeSwitch(sel) {
  tHs.setActiveTheme(tHs.getThemeFromName(sel.value));
}

document.addEventListener("fullscreenchange", handleFullscreenChange);

function log() {
  setTimeout(
    console.log.bind(
      console,
      "%cAbyss Version 3",
      "background: #6670FF;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:30px;"
    )
  );
  setTimeout(
    console.log.bind(
      console,
      "%cIf you are seeing this, the main script system has loaded.",
      "background: #6670FF;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:24px;"
    )
  );
  setTimeout(
    console.log.bind(
      console,
      "%cIf you encounter an error, contact the development team on our discord. DM the info below.",
      "background: #6670FF;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:16px;"
    )
  );
  setTimeout(
    console.log.bind(
      console,
      "%cDo not share output to anyone but trusted Abyss developers with a role in the server! Someone may steal your info.",
      "background: #6670FF;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:16px;"
    )
  );
  let online = navigator.onLine;
  let userAgent = navigator.userAgent;
  let browserName;
  let diagnosticDomain = window.location.href;
  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "Safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "Opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "Edge";
  } else {
    browserName = "Browser not detected!";
  }
  setTimeout(
    console.log.bind(
      console,
      `%c Information: \n Online: ${online} \n URL: ${diagnosticDomain} \n Browser: ${browserName} \n UA: ${userAgent}`, 
      "background: grey;color:white;padding:5px;line-height: 26px; border-radius: 5px;font-size:12px;"
    )
  )

}
log();