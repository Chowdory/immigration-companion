(function () {
  "use strict";

  UI.mount("applications");
  var S = Store.load();

  var search = document.getElementById("search");
  var statusFilter = document.getElementById("statusFilter");
  var typeFilter = document.getElementById("typeFilter");
  var grid = document.getElementById("appGrid");

  var STATUS_CLASS = {
    "planning": "pill pill-gray",
    "in progress": "pill pill-blue",
    "under review": "pill pill-orange",
    "approved": "pill pill-green",
    "rejected": "pill pill-red"
  };

  var STATUS_LABEL = {
    "planning": "Planning",
    "in progress": "In progress",
    "under review": "Under review",
    "approved": "Approved",
    "rejected": "Rejected"
  };

  function render() {
    var term = search.value.trim().toLowerCase();
    var status = statusFilter.value;
    var type = typeFilter.value;

    var list = S.applications.filter(function (app) {
      if (status !== "all" && app.status !== status) return false;
      if (type !== "all" && app.type !== type) return false;
      if (!term) return true;
      return (
        app.title.toLowerCase().indexOf(term) !== -1 ||
        (app.description || "").toLowerCase().indexOf(term) !== -1 ||
        (app.appId || "").toLowerCase().indexOf(term) !== -1
      );
    });

    if (!list.length) {
      grid.innerHTML =
        '<div class="empty" style="grid-column:1/-1;">' +
        "<h3>No applications found</h3>" +
        "<p>" + (S.applications.length ? "Try a different search or filter." : "Create your first application to start tracking it.") + "</p>" +
        '<button class="btn btn-primary" style="margin-top:14px;" onclick="document.getElementById(\'newApp\').click()">New Application</button>' +
        "</div>";
      return;
    }

    grid.innerHTML = list.map(function (app) {
      return (
        '<article class="app-card">' +
        '<div class="row">' +
        '<div><h3>' + UI.esc(app.title) + "</h3>" +
        (app.appId ? '<div class="app-id">' + UI.esc(app.appId) + "</div>" : "") +
        "</div>" +
        '<span class="' + (STATUS_CLASS[app.status] || "pill pill-gray") + '">' + UI.esc(STATUS_LABEL[app.status] || app.status) + "</span>" +
        "</div>" +
        '<p class="desc">' + UI.esc(app.description || "No notes yet.") + "</p>" +
        '<div class="foot">' +
        '<span class="created">Created: ' + Store.shortDate(app.created) + "</span>" +
        '<span class="card-actions">' +
        '<button class="btn btn-sm" data-edit="' + app.id + '">Edit</button>' +
        '<button class="btn btn-sm btn-danger" data-delete="' + app.id + '" aria-label="Delete ' + UI.esc(app.title) + '">Delete</button>' +
        "</span>" +
        "</div></article>"
      );
    }).join("");
  }

  function openForm(app) {
    document.getElementById("appModalTitle").textContent = app ? "Edit Application" : "New Application";
    document.getElementById("appId").value = app ? app.id : "";
    document.getElementById("fTitle").value = app ? app.title : "";
    document.getElementById("fType").value = app ? app.type : "Study Permit";
    document.getElementById("fStatus").value = app ? app.status : "planning";
    document.getElementById("fRef").value = app ? app.appId || "" : "";
    document.getElementById("fDesc").value = app ? app.description || "" : "";
    UI.openModal("appModal");
  }

  document.getElementById("newApp").addEventListener("click", function () { openForm(null); });
  [search, statusFilter, typeFilter].forEach(function (node) {
    node.addEventListener("input", render);
    node.addEventListener("change", render);
  });

  grid.addEventListener("click", function (event) {
    var editBtn = event.target.closest("[data-edit]");
    var delBtn = event.target.closest("[data-delete]");

    if (editBtn) {
      var found = S.applications.filter(function (a) { return a.id === editBtn.getAttribute("data-edit"); })[0];
      if (found) openForm(found);
      return;
    }

    if (delBtn) {
      var id = delBtn.getAttribute("data-delete");
      var target = S.applications.filter(function (a) { return a.id === id; })[0];
      if (!target) return;
      if (!window.confirm('Delete "' + target.title + '"?')) return;
      S.applications = S.applications.filter(function (a) { return a.id !== id; });
      Store.save();
      render();
      UI.toast("Application deleted");
    }
  });

  document.getElementById("appForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var id = document.getElementById("appId").value;
    var payload = {
      title: document.getElementById("fTitle").value.trim(),
      type: document.getElementById("fType").value,
      status: document.getElementById("fStatus").value,
      appId: document.getElementById("fRef").value.trim(),
      description: document.getElementById("fDesc").value.trim()
    };
    if (!payload.title) return;

    if (id) {
      S.applications = S.applications.map(function (a) {
        return a.id === id ? Object.assign({}, a, payload) : a;
      });
      Store.logActivity(payload.title + " - " + STATUS_LABEL[payload.status], "Application Update");
      UI.toast("Application updated");
    } else {
      payload.id = Store.uid("app");
      payload.created = Store.iso(new Date());
      S.applications.unshift(payload);
      Store.logActivity(payload.title + " created", "Application Created");
      UI.toast("Application created");
    }

    Store.save();
    UI.closeModal("appModal");
    render();
  });

  render();
})();
