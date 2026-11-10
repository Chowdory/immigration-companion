/* Shared data layer: seed content, persistence, helpers. */
(function () {
  "use strict";

  var KEY = "studypath.v1";

  function iso(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function dayOffset(n) {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + n);
    return iso(d);
  }

  function monthYear(value) {
    var d = value ? new Date(value + (String(value).length === 10 ? "T12:00:00" : "")) : new Date();
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  function uid(prefix) {
    return (prefix || "id") + "_" + Math.random().toString(36).slice(2, 9);
  }

  function seed() {
    return {
      profile: {
        firstName: "Rintu",
        fullName: "Rintu Chowdory",
        email: "rintu.chowdory@example.com",
        phone: "+1 (416) 555-0134",
        location: "Toronto, ON, Canada",
        bio: "International student in Canada. Computer Science, University of Toronto. Working towards permanent residence."
      },
      status: {
        current: "Study Permit Holder",
        permitValidUntil: monthYear(dayOffset(240)),
        programProgress: 75,
        program: "Computer Science",
        graduation: monthYear(dayOffset(212)),
        gpa: "3.8/4.0",
        extensionStatus: "Planning",
        permitExpires: dayOffset(240),
        graduationDate: dayOffset(212)
      },
      applications: [
        {
          id: uid("app"),
          appId: "#SP2024001234",
          title: "Study Permit Extension",
          type: "Study Permit Extension",
          status: "in progress",
          description: "Extension application for continued studies in Computer Science program",
          created: dayOffset(-32)
        },
        {
          id: uid("app"),
          appId: "",
          title: "Post-Graduation Work Permit",
          type: "Post-Graduation Work Permit",
          status: "planning",
          description: "Preparing documents for post-graduation work permit application",
          created: dayOffset(-30)
        },
        {
          id: uid("app"),
          appId: "#W987654321",
          title: "Work Permit",
          type: "Work Permit",
          status: "under review",
          description: "Work permit for part-time employment during studies. Waiting for approval.",
          created: dayOffset(-95)
        },
        {
          id: uid("app"),
          appId: "#F123456789",
          title: "Study Permit Extension",
          type: "Study Permit Extension",
          status: "in progress",
          description: "Current study permit expires December 2024. Extension needed for final semester.",
          created: dayOffset(-140)
        },
        {
          id: uid("app"),
          appId: "",
          title: "Post-Graduation Work Permit",
          type: "Post-Graduation Work Permit",
          status: "planning",
          description: "Post-graduation work permit application. Need to apply within 180 days of graduation.",
          created: dayOffset(-180)
        }
      ],
      documents: [
        { id: uid("doc"), name: "Passport - bio page.pdf", type: "Passport", size: 842000, uploaded: dayOffset(-120), expiry: "2029-04-18", verified: true },
        { id: uid("doc"), name: "Study Permit 2024.pdf", type: "Study Permit", size: 512000, uploaded: dayOffset(-96), expiry: "2025-12-31", verified: true },
        { id: uid("doc"), name: "Transcript - Fall 2024.pdf", type: "Academic Transcript", size: 388000, uploaded: dayOffset(-70), expiry: "", verified: true },
        { id: uid("doc"), name: "Bank Statement - October.pdf", type: "Bank Statement", size: 214000, uploaded: dayOffset(-2), expiry: "", verified: false },
        { id: uid("doc"), name: "Letter of Acceptance - UofT.pdf", type: "Letter of Acceptance", size: 176000, uploaded: dayOffset(-320), expiry: "", verified: true },
        { id: uid("doc"), name: "Medical Exam Results.pdf", type: "Medical Exam", size: 690000, uploaded: dayOffset(-40), expiry: "2027-01-30", verified: true },
        { id: uid("doc"), name: "IELTS Test Report.pdf", type: "Language Test Results", size: 302000, uploaded: dayOffset(-410), expiry: "2027-09-01", verified: true },
        { id: uid("doc"), name: "PR Photos 50x70.jpg", type: "Photos", size: 1240000, uploaded: dayOffset(-33), expiry: "", verified: true },
        { id: uid("doc"), name: "High School Diploma.pdf", type: "Diploma/Certificate", size: 456000, uploaded: dayOffset(-430), expiry: "", verified: true },
        { id: uid("doc"), name: "Police Clearance Certificate.pdf", type: "Police Clearance", size: 268000, uploaded: dayOffset(-64), expiry: "2027-06-20", verified: true },
        { id: uid("doc"), name: "Employment Letter - Campus Job.pdf", type: "Employment Letter", size: 198000, uploaded: dayOffset(-24), expiry: "", verified: true },
        { id: uid("doc"), name: "GIC Investment Confirmation.pdf", type: "Bank Statement", size: 154000, uploaded: dayOffset(-350), expiry: "", verified: true }
      ],
      reminders: [
        { id: uid("rem"), title: "Work Permit Application Fee", date: dayOffset(3), type: "Payment", note: "CAD 155 application fee, pay online via IRCC portal.", done: false },
        { id: uid("rem"), title: "Updated Academic Transcripts", date: dayOffset(10), type: "Document", note: "Request official transcript from the registrar.", done: false },
        { id: uid("rem"), title: "Medical Examination", date: dayOffset(15), type: "Appointment", note: "Panel physician appointment, bring passport and photos.", done: false }
      ],
      activity: [
        { id: uid("act"), title: "Bank Statement Uploaded", kind: "Document Upload", at: new Date(Date.now() - 2 * 3600e3).toISOString() },
        { id: uid("act"), title: "Study Permit Extension - Under Review", kind: "Application Update", at: new Date(Date.now() - 26 * 3600e3).toISOString() },
        { id: uid("act"), title: "Asked about PGWP eligibility", kind: "AI Consultation", at: new Date(Date.now() - 72 * 3600e3).toISOString() },
        { id: uid("act"), title: "Medical Exam Scheduled", kind: "Deadline", at: new Date(Date.now() - 168 * 3600e3).toISOString() }
      ],
      checklist: {},
      chat: [],
      settings: {
        notifyEmail: true,
        notifyDeadlines: true,
        notifyDocs: true,
        analytics: false,
        shareAnonymized: true,
        language: "English",
        currency: "CAD",
        theme: "Dark"
      }
    };
  }

  var state = null;

  function load() {
    if (state) return state;
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.applications && parsed.profile) {
          state = Object.assign(seed(), parsed);
          return state;
        }
      }
    } catch (err) {
      /* corrupted store, fall through to seed */
    }
    state = seed();
    save();
    return state;
  }

  function save() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* storage may be unavailable, keep in memory */
    }
  }

  function reset() {
    state = seed();
    save();
    return state;
  }

  function logActivity(title, kind) {
    var s = load();
    s.activity.unshift({ id: uid("act"), title: title, kind: kind, at: new Date().toISOString() });
    s.activity = s.activity.slice(0, 14);
    save();
  }

  /* ---------- formatting ---------- */

  function relative(isoString) {
    var diff = Date.now() - new Date(isoString).getTime();
    var mins = Math.round(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + (mins === 1 ? " minute ago" : " minutes ago");
    var hours = Math.round(mins / 60);
    if (hours < 24) return hours + (hours === 1 ? " hour ago" : " hours ago");
    var days = Math.round(hours / 24);
    if (days < 7) return days + (days === 1 ? " day ago" : " days ago");
    var weeks = Math.round(days / 7);
    if (weeks < 5) return weeks + (weeks === 1 ? " week ago" : " weeks ago");
    var months = Math.round(days / 30);
    return months + (months === 1 ? " month ago" : " months ago");
  }

  function shortDate(value) {
    if (!value) return "";
    var d = new Date(value + (String(value).length === 10 ? "T12:00:00" : ""));
    if (isNaN(d.getTime())) return value;
    return d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
  }

  function longDate(value) {
    if (!value) return "";
    var d = new Date(value + (String(value).length === 10 ? "T12:00:00" : ""));
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function weekdayDate(value) {
    var d = new Date(value + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  function startOfToday() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function daysUntil(value) {
    if (!value) return null;
    var d = new Date(value + "T12:00:00");
    if (isNaN(d.getTime())) return null;
    return Math.round((d - startOfToday()) / 864e5);
  }

  function dueLabel(value) {
    var n = daysUntil(value);
    if (n === null) return "";
    if (n < 0) return Math.abs(n) + (Math.abs(n) === 1 ? " day overdue" : " days overdue");
    if (n === 0) return "Due today";
    if (n === 1) return "Due tomorrow";
    return "Due in " + n + " days";
  }

  function fileSize(bytes) {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function initials(name) {
    return (name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (part) { return part.charAt(0).toUpperCase(); })
      .join("");
  }

  window.Store = {
    KEY: KEY,
    load: load,
    save: save,
    reset: reset,
    uid: uid,
    seed: seed,
    logActivity: logActivity,
    iso: iso,
    dayOffset: dayOffset,
    monthYear: monthYear,
    relative: relative,
    shortDate: shortDate,
    longDate: longDate,
    weekdayDate: weekdayDate,
    daysUntil: daysUntil,
    dueLabel: dueLabel,
    fileSize: fileSize,
    initials: initials
  };
})();
