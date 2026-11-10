(function () {
  "use strict";

  UI.mount("dashboard");
  var S = Store.load();

  /* ---------- hero greeting ---------- */
  var firstName = (S.profile.firstName || S.profile.fullName || "there").split(" ")[0];
  document.getElementById("firstName").textContent = firstName;

  /* ---------- derived numbers ---------- */
  var active = S.applications.filter(function (a) {
    return a.status === "in progress" || a.status === "under review";
  });
  var docs = S.documents;
  var unverified = docs.filter(function (d) { return !d.verified; }).length;
  var openReminders = S.reminders.filter(function (r) { return !r.done; });
  var daysLeft = Store.daysUntil(S.status.permitExpires);
  var journeyPct = S.status.programProgress;

  var stats = [
    {
      label: "Active Applications",
      value: active.length,
      note: active.length ? (active[0].title + " in progress") : "No applications in progress",
      tile: "tile-pink",
      icon: "file"
    },
    {
      label: "Documents Uploaded",
      value: docs.length,
      note: unverified ? unverified + " awaiting verification" : "All current & verified",
      tile: "tile-green",
      icon: "check"
    },
    {
      label: "Pending Actions",
      value: openReminders.length,
      note: openReminders.length ? "Require attention this week" : "Nothing pending",
      tile: "tile-orange",
      icon: "clock"
    },
    {
      label: "Community Posts",
      value: 24,
      note: "Helpful discussions joined",
      tile: "tile-hotpink",
      icon: "users"
    }
  ];

  document.getElementById("stats").innerHTML = stats.map(function (s) {
    return (
      '<div class="stat-card">' +
      '<div class="top"><div>' +
      '<div class="label">' + UI.esc(s.label) + "</div>" +
      '<div class="value">' + s.value + "</div>" +
      "</div>" +
      '<span class="icon-tile ' + s.tile + '" aria-hidden="true">' + UI.icon(s.icon, 18) + "</span>" +
      "</div>" +
      '<div class="note">' + UI.esc(s.note) + "</div>" +
      "</div>"
    );
  }).join("");

  /* ---------- status card ---------- */
  document.getElementById("statusPill").textContent = S.status.current;
  document.getElementById("statusStrip").innerHTML = [
    '<span class="pill pill-blue">Study permit</span>',
    '<span class="pill pill-gray">' + UI.esc(S.status.program) + "</span>",
    '<span class="pill pill-violet">' + journeyPct + "% complete</span>"
  ].join("");

  document.getElementById("progressLabel").textContent = journeyPct + "% Complete";
  document.getElementById("progressBar").style.width = journeyPct + "%";
  document.getElementById("permitExpires").textContent = S.status.permitValidUntil;
  document.getElementById("daysRemaining").textContent =
    daysLeft === null ? "n/a" : Math.max(0, daysLeft) + " days";
  document.getElementById("extensionStatus").textContent = S.status.extensionStatus;
  document.getElementById("program").textContent = S.status.program;
  document.getElementById("graduation").textContent = S.status.graduation;
  document.getElementById("gpa").textContent = S.status.gpa;

  var months = daysLeft === null ? null : Math.max(0, Math.round(daysLeft / 30));
  document.getElementById("alertText").textContent =
    months === null
      ? "Review your permit expiry date and plan your next application."
      : "Your study permit expires in " + months + " month" + (months === 1 ? "" : "s") +
        ". Consider applying for extension.";

  /* ---------- journey ---------- */
  var thisYear = new Date().getFullYear();
  var journey = [
    { title: "Initial Study Permit", state: "done", stateLabel: "Completed", desc: "Successfully obtained and currently valid.", when: "Sept " + (thisYear - 2) },
    { title: "Academic Progress", state: "active", stateLabel: "In progress", desc: "Maintaining good academic standing.", when: "Current" },
    { title: "Post-Graduation Work Permit", state: "todo", stateLabel: "Upcoming", desc: "Eligible to apply 90 days before graduation.", when: "Expected: " + (S.status.graduation || "") },
    { title: "Permanent Residence", state: "todo", stateLabel: "Planned", desc: "Express Entry pathway recommended.", when: "Expected: " + (thisYear + 2) }
  ];

  document.getElementById("journey").innerHTML = journey.map(function (step) {
    var dotClass = step.state === "done" ? "journey-dot done" : step.state === "active" ? "journey-dot active" : "journey-dot";
    var pillClass = step.state === "done" ? "pill pill-green" : step.state === "active" ? "pill pill-blue" : "pill pill-gray";
    return (
      '<div class="journey-item">' +
      '<span class="' + dotClass + '" aria-hidden="true">' +
      (step.state === "done" ? UI.icon("check", 14) : step.state === "active" ? UI.icon("clock", 14) : UI.icon("map", 14)) +
      "</span>" +
      '<div class="journey-body">' +
      '<div class="title">' + UI.esc(step.title) + ' <span class="' + pillClass + '">' + step.stateLabel + "</span></div>" +
      '<div class="desc">' + UI.esc(step.desc) + "</div>" +
      '<div class="when">' + UI.esc(step.when) + "</div>" +
      "</div></div>"
    );
  }).join("");
  document.getElementById("journeyPct").textContent = journeyPct + "% Complete";

  /* ---------- activity ---------- */
  document.getElementById("activity").innerHTML = S.activity.slice(0, 6).map(function (item) {
    return (
      '<div class="activity-item">' +
      '<span class="icon-tile tile-violet" style="width:30px;height:30px;border-radius:9px;" aria-hidden="true">' +
      UI.icon("sparkles", 14) + "</span>" +
      '<div style="flex:1;min-width:0;">' +
      '<div class="title">' + UI.esc(item.title) + "</div>" +
      '<div class="meta">' + UI.esc(item.kind) + " &middot; " + Store.relative(item.at) + "</div>" +
      "</div></div>"
    );
  }).join("");

  /* ---------- deadlines ---------- */
  var upcoming = openReminders
    .slice()
    .sort(function (a, b) { return a.date.localeCompare(b.date); })
    .slice(0, 3);

  var host = document.getElementById("deadlines");
  host.innerHTML = upcoming.length
    ? upcoming.map(function (r) {
        var n = Store.daysUntil(r.date);
        var pillClass = n !== null && n <= 3 ? "pill pill-red" : n !== null && n <= 10 ? "pill pill-orange" : "pill pill-gray";
        return (
          '<div class="deadline-item">' +
          '<div><div class="title">' + UI.esc(r.title) + "</div>" +
          '<div class="sub">' + Store.dueLabel(r.date) + "</div></div>" +
          '<span class="' + pillClass + '">' + (n === null ? "scheduled" : n + " days") + "</span>" +
          "</div>"
        );
      }).join("")
    : '<div class="empty"><h3>All caught up</h3><p>No upcoming deadlines in the next weeks.</p></div>';

  /* ---------- action tile icons ---------- */
  document.getElementById("ic-upload").innerHTML = UI.icon("upload", 18);
  document.getElementById("ic-ask").innerHTML = UI.icon("sparkles", 18);
  document.getElementById("ic-check").innerHTML = UI.icon("shield", 18);
})();
