(function () {
  "use strict";

  UI.mount("calendar");
  var S = Store.load();

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth();
  var selected = Store.iso(today);

  var daysHost = document.getElementById("calDays");
  var monthLabel = document.getElementById("monthLabel");

  document.getElementById("prevMonth").innerHTML = UI.icon("chevronLeft", 15);
  document.getElementById("nextMonth").innerHTML = UI.icon("chevronRight", 15);

  function remindersOn(isoDate) {
    return S.reminders.filter(function (r) { return r.date === isoDate; });
  }

  function renderCalendar() {
    var first = new Date(viewYear, viewMonth, 1);
    var startPad = first.getDay();
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    var prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    monthLabel.textContent = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    var cells = [];
    var i;

    for (i = startPad - 1; i >= 0; i -= 1) {
      cells.push('<div class="cal-day muted">' + (prevMonthDays - i) + "</div>");
    }

    for (i = 1; i <= daysInMonth; i += 1) {
      var iso = Store.iso(new Date(viewYear, viewMonth, i));
      var cls = "cal-day";
      if (iso === Store.iso(today)) cls += " today";
      if (iso === selected) cls += " selected";
      var has = remindersOn(iso).length;
      cells.push(
        '<button type="button" class="' + cls + '" data-date="' + iso + '">' +
        "<span>" + i + "</span>" +
        (has ? '<span class="dot"></span>' : "") +
        "</button>"
      );
    }

    var total = cells.length;
    var trailing = (7 - (total % 7)) % 7;
    for (i = 1; i <= trailing; i += 1) {
      cells.push('<div class="cal-day muted">' + i + "</div>");
    }

    daysHost.innerHTML = cells.join("");
  }

  function renderUpcoming() {
    var upcoming = S.reminders
      .filter(function (r) {
        var n = Store.daysUntil(r.date);
        return !r.done && n !== null && n >= 0;
      })
      .sort(function (a, b) { return a.date.localeCompare(b.date); })
      .slice(0, 6);

    document.getElementById("upcomingCount").textContent = upcoming.length ? upcoming.length + " scheduled" : "";
    var host = document.getElementById("upcomingList");

    host.innerHTML = upcoming.length
      ? upcoming.map(function (r) {
          var n = Store.daysUntil(r.date);
          var cls = n <= 3 ? "pill pill-red" : n <= 10 ? "pill pill-orange" : "pill pill-gray";
          return (
            '<div class="reminder">' +
            '<div class="title">' + UI.esc(r.title) + "</div>" +
            '<div class="sub">' + Store.longDate(r.date) + " &middot; " + UI.esc(r.type) + "</div>" +
            '<div class="bar"><span class="' + cls + '">' + Store.dueLabel(r.date) + "</span>" +
            '<span class="card-actions">' +
            '<button class="btn btn-sm" data-edit="' + r.id + '">Edit</button>' +
            '<button class="btn btn-sm btn-danger" data-delete="' + r.id + '">Delete</button>' +
            "</span></div></div>"
          );
        }).join("")
      : '<div class="empty"><h3>All caught up!</h3><p>No upcoming reminders</p></div>';
  }

  function renderDay() {
    var list = remindersOn(selected).slice().sort(function (a, b) { return a.title.localeCompare(b.title); });
    document.getElementById("dayTitle").textContent = Store.weekdayDate(selected);
    var host = document.getElementById("dayList");

    if (!list.length) {
      host.innerHTML = '<div class="empty" style="padding:26px 16px;"><p>No reminders for this date</p></div>';
      return;
    }

    host.innerHTML = list.map(function (r) {
      return (
        '<div class="reminder">' +
        '<div class="title">' + UI.esc(r.title) + (r.done ? ' <span class="pill pill-green">Done</span>' : "") + "</div>" +
        '<div class="sub">' + UI.esc(r.type) + (r.note ? " &middot; " + UI.esc(r.note) : "") + "</div>" +
        '<div class="bar"><button class="btn btn-sm" data-toggle="' + r.id + '">' + (r.done ? "Reopen" : "Mark done") + "</button>" +
        '<span class="card-actions">' +
        '<button class="btn btn-sm" data-edit="' + r.id + '">Edit</button>' +
        '<button class="btn btn-sm btn-danger" data-delete="' + r.id + '">Delete</button>' +
        "</span></div></div>"
      );
    }).join("");
  }

  function renderAll() {
    renderCalendar();
    renderUpcoming();
    renderDay();
  }

  function openForm(reminder) {
    document.getElementById("reminderTitle").textContent = reminder ? "Edit Reminder" : "Add Reminder";
    document.getElementById("remId").value = reminder ? reminder.id : "";
    document.getElementById("remName").value = reminder ? reminder.title : "";
    document.getElementById("remDate").value = reminder ? reminder.date : selected;
    document.getElementById("remType").value = reminder ? reminder.type : "Deadline";
    document.getElementById("remNote").value = reminder ? reminder.note || "" : "";
    UI.openModal("reminderModal");
  }

  document.getElementById("addReminder").addEventListener("click", function () { openForm(null); });

  document.getElementById("prevMonth").addEventListener("click", function () {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", function () {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderCalendar();
  });

  document.getElementById("todayBtn").addEventListener("click", function () {
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    selected = Store.iso(today);
    renderAll();
  });

  daysHost.addEventListener("click", function (event) {
    var cell = event.target.closest("[data-date]");
    if (!cell) return;
    selected = cell.getAttribute("data-date");
    renderCalendar();
    renderDay();
  });

  document.addEventListener("click", function (event) {
    var toggle = event.target.closest("[data-toggle]");
    var edit = event.target.closest("[data-edit]");
    var del = event.target.closest("[data-delete]");

    if (toggle) {
      var tid = toggle.getAttribute("data-toggle");
      S.reminders = S.reminders.map(function (r) {
        return r.id === tid ? Object.assign({}, r, { done: !r.done }) : r;
      });
      Store.save();
      renderAll();
      return;
    }

    if (edit) {
      var found = S.reminders.filter(function (r) { return r.id === edit.getAttribute("data-edit"); })[0];
      if (found) openForm(found);
      return;
    }

    if (del) {
      var did = del.getAttribute("data-delete");
      var rem = S.reminders.filter(function (r) { return r.id === did; })[0];
      if (!rem) return;
      if (!window.confirm('Delete "' + rem.title + '"?')) return;
      S.reminders = S.reminders.filter(function (r) { return r.id !== did; });
      Store.save();
      renderAll();
      UI.toast("Reminder deleted");
    }
  });

  document.getElementById("reminderForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var id = document.getElementById("remId").value;
    var payload = {
      title: document.getElementById("remName").value.trim(),
      date: document.getElementById("remDate").value,
      type: document.getElementById("remType").value,
      note: document.getElementById("remNote").value.trim()
    };
    if (!payload.title || !payload.date) return;

    if (id) {
      S.reminders = S.reminders.map(function (r) {
        return r.id === id ? Object.assign({}, r, payload) : r;
      });
      UI.toast("Reminder updated");
    } else {
      payload.id = Store.uid("rem");
      payload.done = false;
      S.reminders.push(payload);
      Store.logActivity(payload.title + " scheduled", "Deadline");
      UI.toast("Reminder added");
    }

    Store.save();
    UI.closeModal("reminderModal");
    renderAll();
  });

  renderAll();
})();
