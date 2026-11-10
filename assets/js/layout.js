/* Sidebar shell, icons and small DOM helpers shared by all pages. */
(function () {
  "use strict";

  var ICONS = {
    zap: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/>',
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M2 13h20"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M3 11h18"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2Z"/><path d="M20 5a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2Z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.4-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.3a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4Z"/>',
    check: '<path d="m4 12.5 5 5L20 6.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16.5 5.2a3.5 3.5 0 0 1 0 6.6"/><path d="M18 20a6.4 6.4 0 0 0-2-4.6"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    sparkles: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8Z"/><path d="M18.5 15l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9Z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.4 8.3-8 9-4.6-.7-8-4-8-9V6Z"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    x: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
    map: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M16 14.5h2"/>',
    bell: '<path d="M18 15V10a6 6 0 1 0-12 0v5l-2 3h16Z"/><path d="M10 21h4"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    sliders: '<path d="M4 8h10"/><path d="M18 8h2"/><circle cx="16" cy="8" r="2"/><path d="M4 16h4"/><path d="M12 16h8"/><circle cx="10" cy="16" r="2"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h9"/>',
    send: '<path d="M4 12 20 4l-6 16-3.2-6.8Z"/>',
    chevronLeft: '<path d="m14 6-6 6 6 6"/>',
    chevronRight: '<path d="m10 6 6 6-6 6"/>'
  };

  function icon(name, size) {
    var path = ICONS[name] || ICONS.sparkles;
    return (
      '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      path + "</svg>"
    );
  }

  var NAV = [
    { id: "advisor", href: "ai-advisor.html", tip: "AI Advisor", ic: "zap" },
    { id: "dashboard", href: "index.html", tip: "Dashboard", ic: "home" },
    { id: "applications", href: "applications.html", tip: "Applications", ic: "briefcase" },
    { id: "documents", href: "documents.html", tip: "Documents", ic: "file" },
    { id: "calendar", href: "calendar.html", tip: "Calendar", ic: "calendar" },
    { id: "requirements", href: "requirements.html", tip: "Requirements", ic: "book" }
  ];

  function mountSidebar(active) {
    var nav = NAV.map(function (item) {
      return (
        '<a class="nav-btn' + (item.id === active ? " active" : "") + '" href="' + item.href + '" ' +
        'data-tip="' + item.tip + '" aria-label="' + item.tip + '"' +
        (item.id === active ? ' aria-current="page"' : "") + ">" + icon(item.ic, 19) + "</a>"
      );
    }).join("");

    var html =
      '<aside class="sidebar" aria-label="Main navigation">' +
      '<div class="sidebar-logo" aria-hidden="true">SP</div>' +
      nav +
      '<div class="sidebar-spacer"></div>' +
      '<a class="nav-btn' + (active === "settings" ? " active" : "") + '" href="settings.html" data-tip="Settings" aria-label="Settings">' +
      icon("settings", 19) + "</a>" +
      "</aside>";

    var holder = document.getElementById("sidebar");
    if (holder) holder.outerHTML = html;
    else document.body.insertAdjacentHTML("afterbegin", html);
  }

  var toastTimer = null;
  function toast(message) {
    var node = document.querySelector(".toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "toast";
      node.setAttribute("role", "status");
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { node.classList.remove("show"); }, 2600);
  }

  function modal(id) {
    return document.getElementById(id);
  }

  function openModal(id) {
    var node = modal(id);
    if (!node) return;
    node.classList.add("open");
    node.setAttribute("aria-hidden", "false");
    var focusable = node.querySelector("input, select, textarea, button");
    if (focusable) setTimeout(function () { focusable.focus(); }, 60);
  }

  function closeModal(id) {
    var node = modal(id);
    if (!node) return;
    node.classList.remove("open");
    node.setAttribute("aria-hidden", "true");
  }

  function bindModals() {
    document.addEventListener("click", function (event) {
      var closer = event.target.closest("[data-close-modal]");
      if (closer) {
        event.preventDefault();
        closeModal(closer.getAttribute("data-close-modal"));
      }
      if (event.target.classList && event.target.classList.contains("modal-backdrop")) {
        closeModal(event.target.id);
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        Array.prototype.forEach.call(document.querySelectorAll(".modal-backdrop.open"), function (node) {
          closeModal(node.id);
        });
      }
    });
  }

  function esc(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function qs(selector, root) { return (root || document).querySelector(selector); }
  function qsa(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  function mount(active) {
    mountSidebar(active);
    bindModals();
    document.documentElement.style.colorScheme = "dark";
  }

  window.UI = {
    icon: icon,
    mount: mount,
    toast: toast,
    openModal: openModal,
    closeModal: closeModal,
    esc: esc,
    qs: qs,
    qsa: qsa
  };
})();
