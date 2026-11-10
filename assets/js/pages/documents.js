(function () {
  "use strict";

  UI.mount("documents");
  var S = Store.load();

  var TYPES = [
    "Passport", "Study Permit", "Work Permit", "Academic Transcript", "Diploma/Certificate",
    "Letter of Acceptance", "Bank Statement", "Employment Letter", "Marriage Certificate",
    "Birth Certificate", "Police Clearance", "Medical Exam", "Language Test Results", "Photos", "Other"
  ];

  var list = document.getElementById("docList");
  var chips = document.getElementById("typeChips");
  var countLabel = document.getElementById("docCount");
  var expiringLabel = document.getElementById("docExpiring");
  var activeType = "All Types";

  document.getElementById("docType").innerHTML = TYPES.map(function (t) {
    return '<option value="' + t + '">' + t + "</option>";
  }).join("");

  function expiryState(doc) {
    if (!doc.expiry) return null;
    var n = Store.daysUntil(doc.expiry);
    if (n === null) return null;
    if (n < 0) return { cls: "pill pill-red", text: "Expired " + Store.longDate(doc.expiry) };
    if (n <= 90) return { cls: "pill pill-orange", text: "Expires in " + n + " days" };
    return { cls: "pill pill-gray", text: "Valid to " + Store.longDate(doc.expiry) };
  }

  function renderChips() {
    var counts = {};
    S.documents.forEach(function (d) { counts[d.type] = (counts[d.type] || 0) + 1; });
    var all = ['<button class="chip' + (activeType === "All Types" ? " active" : "") + '" data-type="All Types">All Types</button>'];
    TYPES.forEach(function (t) {
      all.push('<button class="chip' + (activeType === t ? " active" : "") + '" data-type="' + t + '">' + t + "</button>");
    });
    chips.innerHTML = all.join("");
  }

  function render() {
    renderChips();
    var filtered = S.documents.filter(function (d) {
      return activeType === "All Types" || d.type === activeType;
    });

    countLabel.textContent = "Showing " + filtered.length + " of " + S.documents.length + " documents";

    var soon = S.documents.filter(function (d) {
      var n = Store.daysUntil(d.expiry);
      return n !== null && n >= 0 && n <= 90;
    }).length;
    expiringLabel.textContent = soon ? soon + " expiring within 90 days" : "";

    if (!filtered.length) {
      list.innerHTML =
        '<div class="empty">' +
        "<h3>No Documents Found</h3>" +
        "<p>" + (S.documents.length ? "No documents of this type yet." : "Upload your first immigration document to get started with organized document management.") + "</p>" +
        '<button class="btn btn-primary" style="margin-top:14px;" id="emptyUpload">Upload First Document</button>' +
        "</div>";
      var emptyBtn = document.getElementById("emptyUpload");
      if (emptyBtn) emptyBtn.addEventListener("click", function () { openForm(null); });
      return;
    }

    list.innerHTML = filtered.map(function (doc) {
      var exp = expiryState(doc);
      return (
        '<div class="doc-row">' +
        '<span class="icon-tile ' + (doc.verified ? "tile-green" : "tile-orange") + '" aria-hidden="true">' +
        UI.icon(doc.verified ? "check" : "clock", 17) + "</span>" +
        '<div class="doc-main">' +
        '<div class="doc-name">' + UI.esc(doc.name) + "</div>" +
        '<div class="doc-meta">' + UI.esc(doc.type) + " &middot; " + Store.fileSize(doc.size) + " &middot; uploaded " + Store.longDate(doc.uploaded) + "</div>" +
        "</div>" +
        '<div class="doc-side">' +
        '<span class="' + (doc.verified ? "pill pill-green" : "pill pill-orange") + '">' + (doc.verified ? "Verified" : "Pending") + "</span>" +
        (exp ? '<span class="' + exp.cls + '">' + exp.text + "</span>" : "") +
        '<button class="btn btn-sm" data-toggle="' + doc.id + '">' + (doc.verified ? "Unverify" : "Verify") + "</button>" +
        '<button class="btn btn-sm" data-edit="' + doc.id + '">Edit</button>' +
        '<button class="btn btn-sm btn-danger" data-delete="' + doc.id + '" aria-label="Delete document">Delete</button>' +
        "</div></div>"
      );
    }).join("");
  }

  function openForm(doc) {
    document.getElementById("docModalTitle").textContent = doc ? "Edit Document" : "Upload Document";
    document.getElementById("docId").value = doc ? doc.id : "";
    document.getElementById("docName").value = doc ? doc.name : "";
    document.getElementById("docType").value = doc ? doc.type : "Passport";
    document.getElementById("docExpiry").value = doc ? doc.expiry || "" : "";
    document.getElementById("docFile").value = "";
    UI.openModal("docModal");
  }

  document.getElementById("uploadBtn").addEventListener("click", function () { openForm(null); });

  document.getElementById("docFile").addEventListener("change", function (event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    var nameField = document.getElementById("docName");
    if (!nameField.value) nameField.value = file.name;
    if (file.size) nameField.dataset.size = String(file.size);
  });

  chips.addEventListener("click", function (event) {
    var chip = event.target.closest("[data-type]");
    if (!chip) return;
    activeType = chip.getAttribute("data-type");
    render();
  });

  list.addEventListener("click", function (event) {
    var toggle = event.target.closest("[data-toggle]");
    var edit = event.target.closest("[data-edit]");
    var del = event.target.closest("[data-delete]");

    if (toggle) {
      var id = toggle.getAttribute("data-toggle");
      S.documents = S.documents.map(function (d) {
        return d.id === id ? Object.assign({}, d, { verified: !d.verified }) : d;
      });
      Store.save();
      render();
      UI.toast("Document status updated");
      return;
    }

    if (edit) {
      var found = S.documents.filter(function (d) { return d.id === edit.getAttribute("data-edit"); })[0];
      if (found) openForm(found);
      return;
    }

    if (del) {
      var docId = del.getAttribute("data-delete");
      var doc = S.documents.filter(function (d) { return d.id === docId; })[0];
      if (!doc) return;
      if (!window.confirm('Delete "' + doc.name + '"?')) return;
      S.documents = S.documents.filter(function (d) { return d.id !== docId; });
      Store.save();
      render();
      UI.toast("Document deleted");
    }
  });

  document.getElementById("docForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var id = document.getElementById("docId").value;
    var nameField = document.getElementById("docName");
    var payload = {
      name: nameField.value.trim(),
      type: document.getElementById("docType").value,
      expiry: document.getElementById("docExpiry").value
    };
    if (!payload.name) return;

    if (id) {
      S.documents = S.documents.map(function (d) {
        return d.id === id ? Object.assign({}, d, payload) : d;
      });
      Store.logActivity(payload.name + " updated", "Document Update");
      UI.toast("Document updated");
    } else {
      payload.id = Store.uid("doc");
      payload.uploaded = Store.iso(new Date());
      payload.size = Number(nameField.dataset.size || 0) || 220000;
      payload.verified = false;
      S.documents.unshift(payload);
      Store.logActivity(payload.name + " uploaded", "Document Upload");
      UI.toast("Document uploaded");
    }

    delete nameField.dataset.size;
    Store.save();
    UI.closeModal("docModal");
    render();
  });

  render();
})();
