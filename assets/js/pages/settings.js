(function () {
  "use strict";

  UI.mount("settings");
  var S = Store.load();

  /* ---------- tabs ---------- */
  var nav = document.getElementById("settingsNav");
  var PANELS = ["profile", "notifications", "privacy", "preferences", "account"];

  function showTab(tab) {
    PANELS.forEach(function (name) {
      var panel = document.getElementById("panel-" + name);
      if (panel) panel.hidden = name !== tab;
    });
    UI.qsa("button", nav).forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
    });
  }

  nav.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-tab]");
    if (btn) showTab(btn.getAttribute("data-tab"));
  });

  /* ---------- profile ---------- */
  function fillProfile() {
    document.getElementById("pFullName").value = S.profile.fullName || "";
    document.getElementById("pEmail").value = S.profile.email || "";
    document.getElementById("pPhone").value = S.profile.phone || "";
    document.getElementById("pLocation").value = S.profile.location || "";
    document.getElementById("pBio").value = S.profile.bio || "";
    document.getElementById("avatarInitials").textContent = Store.initials(S.profile.fullName || "You");
  }

  document.getElementById("profileForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var fullName = document.getElementById("pFullName").value.trim();
    S.profile.fullName = fullName;
    S.profile.firstName = fullName.split(" ")[0] || "there";
    S.profile.email = document.getElementById("pEmail").value.trim();
    S.profile.phone = document.getElementById("pPhone").value.trim();
    S.profile.location = document.getElementById("pLocation").value.trim();
    S.profile.bio = document.getElementById("pBio").value.trim();
    Store.save();
    fillProfile();
    UI.toast("Profile saved");
  });

  document.getElementById("changePhoto").addEventListener("click", function () {
    UI.toast("Photo upload is disabled in this demo build");
  });

  document.getElementById("removePhoto").addEventListener("click", function () {
    UI.toast("No photo to remove");
  });

  /* ---------- switches ---------- */
  function fillSwitches() {
    UI.qsa("[data-switch]").forEach(function (node) {
      var key = node.getAttribute("data-switch");
      var on = !!S.settings[key];
      node.classList.toggle("on", on);
      node.setAttribute("aria-checked", on ? "true" : "false");
    });
  }

  document.addEventListener("click", function (event) {
    var node = event.target.closest("[data-switch]");
    if (!node) return;
    var key = node.getAttribute("data-switch");
    S.settings[key] = !S.settings[key];
    Store.save();
    fillSwitches();
  });

  document.addEventListener("keydown", function (event) {
    var node = event.target.closest && event.target.closest("[data-switch]");
    if (!node) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      node.click();
    }
  });

  /* ---------- preferences ---------- */
  function fillPreferences() {
    document.getElementById("pLanguage").value = S.settings.language || "English";
    document.getElementById("pCurrency").value = S.settings.currency || "CAD";
    document.getElementById("pTheme").value = S.settings.theme || "Dark";
    document.getElementById("pCountry").value = S.settings.country || "Canada";
  }

  ["pLanguage", "pCurrency", "pTheme", "pCountry"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", function (event) {
      var map = { pLanguage: "language", pCurrency: "currency", pTheme: "theme", pCountry: "country" };
      S.settings[map[id]] = event.target.value;
      Store.save();
      UI.toast("Preference saved");
    });
  });

  /* ---------- data actions ---------- */
  document.getElementById("exportData").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "studypath-data.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    UI.toast("Export started");
  });

  function wipe() {
    var fresh = Store.reset();
    S = fresh;
    fillProfile();
    fillSwitches();
    fillPreferences();
    UI.toast("All data deleted and demo data restored");
  }

  document.getElementById("wipeData").addEventListener("click", function () {
    if (window.confirm("Delete all applications, documents and reminders on this device?")) wipe();
  });

  document.getElementById("resetDemo").addEventListener("click", function () {
    if (window.confirm("Reset everything back to the demo content?")) wipe();
  });

  document.getElementById("signOut").addEventListener("click", function () {
    UI.toast("This demo build has no account session");
  });

  fillProfile();
  fillSwitches();
  fillPreferences();
  showTab("profile");
})();
