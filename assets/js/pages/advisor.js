(function () {
  "use strict";

  UI.mount("advisor");
  var S = Store.load();

  var log = document.getElementById("chatLog");
  var input = document.getElementById("chatInput");
  var form = document.getElementById("chatForm");

  document.getElementById("chatAvatar").innerHTML = UI.icon("sparkles", 17);
  document.getElementById("sendBtn").innerHTML = UI.icon("send", 16);

  var GREETING = "Hello! I'm your AI Immigration Advisor. I can help you navigate Canadian immigration processes, understand requirements, and plan your next steps. What would you like to know?";

  var QUICK = [
    "When should I apply for my PGWP?",
    "What documents do I need for study permit extension?",
    "Am I eligible for Express Entry?",
    "How long can I stay after graduation?",
    "Can I work off-campus during studies?",
    "What are the requirements for bringing my spouse?"
  ];

  var TOPICS = [
    { title: "Study Permit Questions", desc: "Extensions, renewals, and requirements", icon: "book", tile: "tile-violet", q: "What are the study permit extension requirements?" },
    { title: "Work Authorization", desc: "On-campus, off-campus, and PGWP guidance", icon: "briefcase", tile: "tile-orange", q: "How many hours can I work off-campus?" },
    { title: "Permanent Residence", desc: "Pathways, eligibility, and applications", icon: "map", tile: "tile-green", q: "How does Express Entry work?" }
  ];

  /* ---------- local knowledge base ---------- */

  var KB = [
    {
      match: ["pgwp", "post-graduation", "post graduation"],
      answer:
        "Post-Graduation Work Permit (PGWP)\n\n" +
        "You can apply once you have written confirmation of program completion (final transcript or completion letter), and no later than 180 days after that date.\n\n" +
        "Things that matter most:\n" +
        "1. You must have completed an eligible program of at least 8 months at a designated learning institution.\n" +
        "2. You must have held a valid study permit, or have been approved for one, during your studies.\n" +
        "3. Apply before your study permit expires to keep your status and your right to work while you wait.\n" +
        "4. The permit length follows your program length, up to 3 years.\n\n" +
        "Next step for you: your program wraps up in May 2025, so a PGWP application window opens around then. Add a reminder in the Calendar 90 days before graduation so nothing slips."
    },
    {
      match: ["extension", "extend my study permit", "renew study permit"],
      answer:
        "Study Permit Extension\n\n" +
        "Apply at least 30 days before your current permit expires. If IRCC receives your application before expiry you keep studying under maintained status while it is processed.\n\n" +
        "Documents normally needed:\n" +
        "1. Letter of acceptance or enrolment confirmation from your school.\n" +
        "2. Proof of financial support.\n" +
        "3. Transcripts showing you have actively studied.\n" +
        "4. Passport bio page and a compliant digital photo.\n" +
        "5. A short explanation letter if you have had a gap or changed programs.\n\n" +
        "Your current permit runs to December 2025, so aim to file around August 2025 at the latest."
    },
    {
      match: ["express entry", "permanent resid", "pr eligib", "crs"],
      answer:
        "Express Entry and Permanent Residence\n\n" +
        "Express Entry is a points system (CRS) that ranks profiles. Core drivers are age, language test scores, education, and skilled work experience in Canada or abroad.\n\n" +
        "Highlights for a student pathway:\n" +
        "1. A language test is the single biggest lever. CLB 9 scores can move you hundreds of points.\n" +
        "2. One year of skilled Canadian work experience, gained on a PGWP, opens the Canadian Experience Class.\n" +
        "3. Provincial nominations add 600 points and effectively guarantee an invitation.\n\n" +
        "Practical plan: take the language test in your final semester, get an educational credential assessment, and create your Express Entry profile once you have language results and your completion documents."
    },
    {
      match: ["how long can i stay", "after graduation", "stay after"],
      answer:
        "Staying after graduation\n\n" +
        "Your study permit usually expires 90 days after you finish, even if the printed date is later, or on the printed date if that comes first.\n\n" +
        "Options to stay:\n" +
        "1. Apply for a PGWP before your permit expires, and you keep your legal status while waiting.\n" +
        "2. If your status lapses, you have 90 days to restore it or leave Canada.\n" +
        "3. A valid permit plus a work offer can also support a separate work permit application.\n\n" +
        "The safe move is to apply for the PGWP within the 180 day window and well before your study permit expiry date."
    },
    {
      match: ["off-campus", "off campus", "how many hours", "work while"],
      answer:
        "Working while you study\n\n" +
        "During a regular academic session, eligible students may work up to 24 hours per week off campus under the current policy, and full time during scheduled breaks such as summer and winter holidays.\n\n" +
        "Conditions to keep in mind:\n" +
        "1. You need a valid study permit at an eligible institution.\n" +
        "2. Off-campus work is not allowed during a scheduled break only if you are no longer enrolled and not continuing studies.\n" +
        "3. On-campus work has no hourly cap if you work for your institution.\n" +
        "4. Taking a semester off usually means you cannot work, so plan breaks carefully.\n\n" +
        "Always check the hours rule in effect for your permit and period, since it changes."
    },
    {
      match: ["spouse", "partner", "family"],
      answer:
        "Bringing your spouse or partner\n\n" +
        "Two routes are common:\n" +
        "1. An open work permit for a spouse you can sponsor or who qualifies under a study permit holder's family program, depending on program and eligibility rules.\n" +
        "2. A visitor visa, which does not allow work.\n\n" +
        "Typical documents: marriage certificate, proof of relationship, sponsor income and funds, and your own study permit and enrolment proof.\n\n" +
        "Family open work permits for spouses of students are now limited to specific program types such as masters and doctoral programs. Add your program details so I can narrow this down."
    },
    {
      match: ["medical", "exam"],
      answer:
        "Medical examination\n\n" +
        "Book an exam only with an IRCC panel physician. Your results are sent to IRCC directly and stay valid for 12 months.\n\n" +
        "You will typically need a medical exam for a study permit when you studied or lived for 6 months or more in a designated country during the past year, and for permanent residence in all cases.\n\n" +
        "Bring your passport, glasses if worn, a list of medications, and the cost of the exam. Results usually reach IRCC within 10 days."
    },
    {
      match: ["biometric", "fingerprint"],
      answer:
        "Biometrics\n\n" +
        "Biometrics are fingerprints and a photo. They are valid for 10 years. The fee is CAD 85 and you give them within 30 days of the letter requesting them, at a visa application centre.\n\n" +
        "If you gave biometrics within the last 10 years for another application, you usually will not be asked again."
    },
    {
      match: ["fee", "cost", "how much"],
      answer:
        "Typical government fees in CAD\n\n" +
        "1. Study permit: 150\n" +
        "2. Work permit: 155\n" +
        "3. Post-graduation work permit: 255\n" +
        "4. Visitor visa: 100\n" +
        "5. Biometrics: 85\n" +
        "6. Express Entry permanent residence: 1525 per adult, including the right of permanent residence fee\n\n" +
        "The Fee Calculator on the Requirements page totals these for you. Keep the receipt in your Documents library."
    },
    {
      match: ["processing", "how long does it take", "timeline"],
      answer:
        "Processing times vary by application type and country. Current typical ranges:\n\n" +
        "1. Study permit from abroad: 8 to 12 weeks.\n" +
        "2. Study permit extension in Canada: 60 to 120 days.\n" +
        "3. PGWP: 90 to 150 days.\n" +
        "4. Work permit: 8 to 16 weeks.\n" +
        "5. Express Entry PR: 6 to 8 months.\n\n" +
        "Tip: file early, keep document names consistent across applications, and reply to IRCC requests within the stated deadline. The Requirements page has a Processing Times panel with the same figures."
    },
    {
      match: ["document", "checklist", "transcript", "bank"],
      answer:
        "Documents most applications ask for\n\n" +
        "1. Valid passport and a compliant digital photo.\n" +
        "2. Letter of acceptance or enrolment confirmation.\n" +
        "3. Proof of funds, usually 4 months of bank statements, plus tuition proof.\n" +
        "4. Official transcripts and language test results.\n" +
        "5. Medical exam confirmation and police clearance where required.\n\n" +
        "Open the interactive Document Checklist under Requirements and tick items off as you collect them. Your progress is saved on this device."
    }
  ];

  var FALLBACK =
    "I can help with study permits, extensions, work permits, PGWP, Express Entry, biometrics, fees, processing times and document checklists.\n\n" +
    "Try asking something specific, for example: \"What documents do I need for my study permit extension?\" or \"When should I apply for my PGWP?\"\n\n" +
    "For anything case specific, verify with IRCC or a regulated immigration consultant.";

  function answerFor(text) {
    var q = text.toLowerCase();
    for (var i = 0; i < KB.length; i += 1) {
      for (var j = 0; j < KB[i].match.length; j += 1) {
        if (q.indexOf(KB[i].match[j]) !== -1) return KB[i].answer;
      }
    }
    return FALLBACK;
  }

  /* ---------- rendering ---------- */

  function timestamp(iso) {
    var d = iso ? new Date(iso) : new Date();
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });
  }

  function bubble(role, text, iso) {
    if (role === "user") {
      return (
        '<div class="msg user">' +
        '<div class="avatar" aria-hidden="true">' + UI.esc((S.profile.firstName || "You").charAt(0)) + "</div>" +
        '<div><div class="bubble">' + UI.esc(text) + '</div><div class="time">' + timestamp(iso) + "</div></div>" +
        "</div>"
      );
    }
    return (
      '<div class="msg bot">' +
      '<div class="avatar" aria-hidden="true">' + UI.icon("sparkles", 15) + "</div>" +
      '<div><div class="bubble">' + UI.esc(text) + '</div><div class="time">' + timestamp(iso) + "</div></div>" +
      "</div>"
    );
  }

  function render() {
    if (!S.chat.length) {
      S.chat.push({ role: "bot", text: GREETING, at: new Date().toISOString() });
      Store.save();
    }
    log.innerHTML = S.chat.map(function (m) { return bubble(m.role, m.text, m.at); }).join("");
    log.scrollTop = log.scrollHeight;
  }

  function push(role, text) {
    S.chat.push({ role: role, text: text, at: new Date().toISOString() });
    if (S.chat.length > 60) S.chat = S.chat.slice(-60);
    Store.save();
    log.insertAdjacentHTML("beforeend", bubble(role, text));
    log.scrollTop = log.scrollHeight;
  }

  function typing(on) {
    var existing = document.getElementById("typingMsg");
    if (on && !existing) {
      log.insertAdjacentHTML(
        "beforeend",
        '<div class="msg bot" id="typingMsg"><div class="avatar" aria-hidden="true">' + UI.icon("sparkles", 15) +
        '</div><div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div></div>'
      );
      log.scrollTop = log.scrollHeight;
    }
    if (!on && existing) existing.remove();
  }

  function ask(text) {
    var question = text.trim();
    if (!question) return;
    push("user", question);
    typing(true);
    setTimeout(function () {
      typing(false);
      push("bot", answerFor(question));
    }, 650);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value;
    input.value = "";
    ask(text);
  });

  document.getElementById("quickQuestions").innerHTML = QUICK.map(function (q) {
    return '<button class="quick-q" data-q="' + UI.esc(q) + '">' + UI.esc(q) + "</button>";
  }).join("");

  document.getElementById("topics").innerHTML = TOPICS.map(function (t) {
    return (
      '<button class="topic" data-q="' + UI.esc(t.q) + '">' +
      '<span class="icon-tile ' + t.tile + '" style="width:32px;height:32px;border-radius:10px;" aria-hidden="true">' + UI.icon(t.icon, 16) + "</span>" +
      "<span><span class=\"title\">" + UI.esc(t.title) + '</span><br /><span class="desc">' + UI.esc(t.desc) + "</span></span>" +
      "</button>"
    );
  }).join("");

  document.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-q]");
    if (!btn) return;
    ask(btn.getAttribute("data-q"));
  });

  document.getElementById("clearChat").addEventListener("click", function () {
    S.chat = [];
    Store.save();
    render();
    UI.toast("Conversation cleared");
  });

  render();
})();
