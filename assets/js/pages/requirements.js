(function () {
  "use strict";

  UI.mount("requirements");
  var S = Store.load();

  var GUIDES = [
    {
      id: "first-time",
      title: "First-Time Student Guide",
      desc: "Complete guide for new international students",
      steps: 8, read: "30 min read", icon: "book", tile: "tile-violet",
      body: [
        "Confirm your designated learning institution (DLI) and program start date.",
        "Collect your letter of acceptance and proof of tuition payment.",
        "Prepare proof of financial support for tuition plus living costs.",
        "Book a medical exam with an IRCC panel physician if your country requires one.",
        "Create an IRCC secure account and complete the study permit application.",
        "Pay the application fee and biometrics fee, then give biometrics within 30 days.",
        "Wait for the port of entry letter of introduction before travelling.",
        "Present your documents to the border officer and receive your study permit."
      ]
    },
    {
      id: "work-ext",
      title: "Work Permit Extension",
      desc: "Step-by-step renewal process",
      steps: 6, read: "20 min read", icon: "briefcase", tile: "tile-orange",
      body: [
        "Apply before your current work permit expires to keep working under maintained status.",
        "Confirm your employer has a valid LMIA or an exempt offer of employment.",
        "Gather your employment contract, job offer number and pay statements.",
        "Complete the IMM 5710 form and upload supporting documents.",
        "Pay the work permit fee and, if required, the biometrics fee.",
        "Track the application in your IRCC account and respond to any requests quickly."
      ]
    },
    {
      id: "pgwp",
      title: "Post-Graduation Work Permit",
      desc: "Transitioning from studies to work",
      steps: 5, read: "15 min read", icon: "sparkles", tile: "tile-green",
      body: [
        "Confirm your program was eligible for the PGWP at the time you enrolled.",
        "Request an official letter from your school confirming program completion.",
        "Apply within 180 days of your final transcript or completion letter.",
        "Hold a valid study permit, or have held one, when you apply.",
        "Pay the work permit fee and wait for the decision before travelling if your status lapses."
      ]
    },
    {
      id: "pr",
      title: "Permanent Residence Pathways",
      desc: "Options for becoming a permanent resident",
      steps: 10, read: "45 min read", icon: "map", tile: "tile-pink",
      body: [
        "Take a language test (IELTS, CELPIP, TEF or TCF) to establish your score.",
        "Request an educational credential assessment for foreign education.",
        "Create an Express Entry profile and confirm your Comprehensive Ranking System score.",
        "Improve your profile with additional language points, work experience or a provincial nomination.",
        "Watch draws and accept an Invitation to Apply when your score is high enough.",
        "Complete the permanent residence application within 60 days of the invitation.",
        "Book the medical exam and request police certificates for every country you lived in.",
        "Pay the processing fee and the right of permanent residence fee.",
        "Provide biometrics and respond to any requests for additional documents.",
        "Receive your Confirmation of Permanent Residence and complete landing."
      ]
    }
  ];

  var GROUPS = [
    {
      title: "Study Permit",
      icon: "book", tile: "tile-violet",
      items: [
        { name: "Letter of Acceptance", hint: "From a designated learning institution", req: true },
        { name: "Proof of Financial Support", hint: "$10,000 + tuition fees", req: true },
        { name: "Medical Exam", hint: "If required by your country", req: false },
        { name: "Police Certificate", hint: "If staying more than 6 months", req: false },
        { name: "Statement of Purpose", hint: "Explaining your study plans", req: true }
      ]
    },
    {
      title: "Work Permit",
      icon: "briefcase", tile: "tile-orange",
      items: [
        { name: "Job Offer", hint: "From Canadian employer with LMIA", req: true },
        { name: "Employment Contract", hint: "Signed agreement with employer", req: true },
        { name: "Work Experience", hint: "Relevant to the position", req: true },
        { name: "Language Proficiency", hint: "English or French test results", req: false },
        { name: "Educational Credentials", hint: "Assessment if required", req: false }
      ]
    },
    {
      title: "Medical Requirements",
      icon: "shield", tile: "tile-green",
      items: [
        { name: "Medical Examination", hint: "By panel physician", req: true },
        { name: "Chest X-ray", hint: "For applicants 11+ years old", req: true },
        { name: "Blood Tests", hint: "HIV and syphilis screening", req: false },
        { name: "Vaccination Records", hint: "Recommended immunizations", req: false },
        { name: "Medical History", hint: "Complete health documentation", req: true }
      ]
    },
    {
      title: "Financial Requirements",
      icon: "wallet", tile: "tile-pink",
      items: [
        { name: "Bank Statements", hint: "Last 4 months of account activity", req: true },
        { name: "Guaranteed Investment", hint: "Certificate or guaranteed income", req: false },
        { name: "Scholarship Letter", hint: "If applicable", req: false },
        { name: "Sponsor's Documents", hint: "If someone is supporting you", req: false },
        { name: "Tax Documents", hint: "Recent tax returns if employed", req: false }
      ]
    }
  ];

  var CHECKLIST = [
    { id: "passport", name: "Valid passport", group: "Identity" },
    { id: "photos", name: "Digital photo meeting IRCC specifications", group: "Identity" },
    { id: "acceptance", name: "Letter of acceptance from a DLI", group: "Study" },
    { id: "tuition", name: "Proof of tuition payment", group: "Study" },
    { id: "transcript", name: "Official academic transcripts", group: "Study" },
    { id: "language", name: "Language test results", group: "Study" },
    { id: "funds", name: "Proof of funds (bank statements, GIC)", group: "Financial" },
    { id: "sponsor", name: "Sponsor letter and income proof", group: "Financial" },
    { id: "medical", name: "Medical exam confirmation", group: "Health" },
    { id: "police", name: "Police clearance certificate", group: "Background" },
    { id: "cv", name: "Resume or CV", group: "Work" },
    { id: "offer", name: "Job offer letter", group: "Work" },
    { id: "contract", name: "Signed employment contract", group: "Work" },
    { id: "fees", name: "Fee payment receipt", group: "Submission" },
    { id: "form", name: "Completed application form", group: "Submission" }
  ];

  var TIMES = [
    { name: "Study permit (outside Canada)", weeks: "8 to 12 weeks" },
    { name: "Study permit extension (inside Canada)", weeks: "60 to 120 days" },
    { name: "Work permit (employer-specific)", weeks: "8 to 16 weeks" },
    { name: "Post-graduation work permit", weeks: "90 to 150 days" },
    { name: "Visitor visa", weeks: "3 to 8 weeks" },
    { name: "Express Entry permanent residence", weeks: "6 to 8 months" },
    { name: "Biometrics appointment", weeks: "Within 30 days of request" }
  ];

  var FEES = {
    study: { label: "Study permit", fee: 150 },
    studyExt: { label: "Study permit extension", fee: 150 },
    work: { label: "Work permit", fee: 155 },
    pgwp: { label: "Post-graduation work permit", fee: 255 },
    visitor: { label: "Visitor visa", fee: 100 },
    pr: { label: "Permanent residence (Express Entry)", fee: 1525 }
  };

  /* ---------- render guides ---------- */
  document.getElementById("guides").innerHTML = GUIDES.map(function (g) {
    return (
      '<button class="guide-card" data-guide="' + g.id + '">' +
      '<span class="icon-tile ' + g.tile + '" aria-hidden="true">' + UI.icon(g.icon, 18) + "</span>" +
      '<div style="font-weight:600;font-size:14.5px;">' + UI.esc(g.title) + "</div>" +
      '<div class="small muted">' + UI.esc(g.desc) + "</div>" +
      '<div class="meta"><span>' + g.steps + " steps</span><span>&middot;</span><span>" + g.read + "</span></div>" +
      "</button>"
    );
  }).join("");

  /* ---------- render groups ---------- */
  document.getElementById("groups").innerHTML = GROUPS.map(function (group, index) {
    return (
      '<div class="card">' +
      '<div class="card-head">' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
      '<span class="icon-tile ' + group.tile + '" aria-hidden="true">' + UI.icon(group.icon, 17) + "</span>" +
      "<h3>" + UI.esc(group.title) + "</h3></div>" +
      '<span class="tiny muted">' + group.items.length + " items</span>" +
      "</div>" +
      '<div class="req-list">' +
      group.items.map(function (item) {
        return (
          '<div class="req-item">' +
          "<div><div class=\"name\">" + UI.esc(item.name) + '</div><div class="hint">' + UI.esc(item.hint) + "</div></div>" +
          '<span class="' + (item.req ? "pill pill-violet" : "pill pill-gray") + '">' + (item.req ? "Required" : "Optional") + "</span>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      '<button class="btn btn-sm" data-group="' + index + '" style="margin-top:14px;align-self:flex-start;">View Detailed Guide</button>' +
      "</div>"
    );
  }).join("");

  /* ---------- icons ---------- */
  document.getElementById("icChecklist").innerHTML = UI.icon("check", 18);
  document.getElementById("icTimes").innerHTML = UI.icon("clock", 18);
  document.getElementById("icFees").innerHTML = UI.icon("wallet", 18);

  /* ---------- guide modal ---------- */
  function openGuide(id) {
    var guide = GUIDES.filter(function (g) { return g.id === id; })[0];
    if (!guide) return;
    document.getElementById("guideModalTitle").textContent = guide.title;
    document.getElementById("guideModalSub").textContent = guide.steps + " steps, " + guide.read;
    document.getElementById("guideModalBody").innerHTML =
      '<div class="journey">' +
      guide.body.map(function (text, index) {
        return (
          '<div class="journey-item">' +
          '<span class="journey-dot active" aria-hidden="true" style="font-size:12px;font-weight:600;">' + (index + 1) + "</span>" +
          '<div class="journey-body"><div class="desc" style="font-size:13px;color:var(--text);">' + UI.esc(text) + "</div></div>" +
          "</div>"
        );
      }).join("") +
      "</div>";
    UI.openModal("guideModal");
  }

  document.getElementById("guides").addEventListener("click", function (event) {
    var card = event.target.closest("[data-guide]");
    if (card) openGuide(card.getAttribute("data-guide"));
  });

  document.getElementById("groups").addEventListener("click", function (event) {
    var btn = event.target.closest("[data-group]");
    if (!btn) return;
    var group = GROUPS[Number(btn.getAttribute("data-group"))];
    if (!group) return;
    document.getElementById("guideModalTitle").textContent = group.title + " Requirements";
    document.getElementById("guideModalSub").textContent = "What to prepare, and what is optional.";
    document.getElementById("guideModalBody").innerHTML =
      '<div class="req-list">' +
      group.items.map(function (item) {
        return (
          '<div class="req-item">' +
          "<div><div class=\"name\">" + UI.esc(item.name) + '</div><div class="hint">' + UI.esc(item.hint) + "</div></div>" +
          '<span class="' + (item.req ? "pill pill-violet" : "pill pill-gray") + '">' + (item.req ? "Required" : "Optional") + "</span>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      '<p class="disclaimer" style="margin-top:14px;">Guidance only. Confirm current requirements on the official IRCC website before submitting.</p>';
    UI.openModal("guideModal");
  });

  /* ---------- checklist ---------- */
  function renderChecklist() {
    var done = CHECKLIST.filter(function (item) { return S.checklist[item.id]; }).length;
    var pct = Math.round((done / CHECKLIST.length) * 100);
    document.getElementById("checklistBar").style.width = pct + "%";
    document.getElementById("checklistLabel").textContent = done + " of " + CHECKLIST.length;

    var groups = {};
    CHECKLIST.forEach(function (item) {
      (groups[item.group] = groups[item.group] || []).push(item);
    });

    document.getElementById("checklistBody").innerHTML = Object.keys(groups).map(function (groupName) {
      return (
        '<div style="margin-bottom:14px;">' +
        '<div class="tiny muted" style="text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px;">' + UI.esc(groupName) + "</div>" +
        groups[groupName].map(function (item) {
          var checked = !!S.checklist[item.id];
          return (
            '<label class="check-item' + (checked ? " done" : "") + '">' +
            '<input type="checkbox" data-check="' + item.id + '"' + (checked ? " checked" : "") + " />" +
            '<span class="name">' + UI.esc(item.name) + "</span>" +
            "</label>"
          );
        }).join("") +
        "</div>"
      );
    }).join("");
  }

  document.getElementById("openChecklist").addEventListener("click", function () {
    renderChecklist();
    UI.openModal("checklistModal");
  });

  document.getElementById("checklistBody").addEventListener("change", function (event) {
    var input = event.target.closest("[data-check]");
    if (!input) return;
    S.checklist[input.getAttribute("data-check")] = input.checked;
    Store.save();
    renderChecklist();
  });

  document.getElementById("resetChecklist").addEventListener("click", function () {
    S.checklist = {};
    Store.save();
    renderChecklist();
    UI.toast("Checklist reset");
  });

  /* ---------- processing times ---------- */
  document.getElementById("openTimes").addEventListener("click", function () {
    document.getElementById("timesBody").innerHTML =
      '<div class="req-list">' +
      TIMES.map(function (row) {
        return (
          '<div class="req-item"><div class="name">' + UI.esc(row.name) + "</div>" +
          '<span class="pill pill-gray">' + UI.esc(row.weeks) + "</span></div>"
        );
      }).join("") +
      "</div>" +
      '<p class="disclaimer" style="margin-top:14px;">These are typical averages used in this demo. Always check the official IRCC processing time tool for your country and application type.</p>';
    UI.openModal("timesModal");
  });

  /* ---------- fee calculator ---------- */
  function calcFees() {
    var app = FEES[document.getElementById("feeApp").value] || FEES.study;
    var applicants = Math.max(1, Math.min(6, Number(document.getElementById("feeApplicants").value) || 1));
    var biometrics = document.getElementById("feeBiometrics").value === "yes";
    var base = app.fee * applicants;
    var bio = biometrics ? 85 * applicants : 0;
    var total = base + bio;
    document.getElementById("feeTotal").textContent = "CAD " + total.toLocaleString("en-CA");
    document.getElementById("feeBreakdown").textContent =
      "CAD " + app.fee + " x " + applicants + (bio ? " + biometrics CAD " + bio : "");
  }

  ["feeApp", "feeApplicants", "feeBiometrics"].forEach(function (id) {
    var node = document.getElementById(id);
    node.addEventListener("input", calcFees);
    node.addEventListener("change", calcFees);
  });

  document.getElementById("openFees").addEventListener("click", function () {
    calcFees();
    UI.openModal("feesModal");
  });
})();
