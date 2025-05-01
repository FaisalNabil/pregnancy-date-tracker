// js/shared/uiUtil.js

// Simple show/hide helpers
export function showElement(selector) {
    $(selector).removeClass("d-none");
  }
  
  export function hideElement(selector) {
    $(selector).addClass("d-none");
  }
  
  export function toggleElement(selector, show) {
    $(selector).toggleClass("d-none", !show);
  }
  
  // Set HTML content safely
  export function setHtml(selector, html) {
    $(selector).html(html);
  }
  
  export function setText(selector, text) {
    $(selector).text(text);
  }
  
  // Reset form fields
  export function resetFormFields(selectors) {
    selectors.forEach(id => {
      const el = $(id);
      if (el.is("input") || el.is("textarea")) el.val("");
      if (el.is("select")) el.prop("selectedIndex", 0);
      if (el.is(":checkbox")) el.prop("checked", false);
    });
  }
  
  // Render a Bootstrap list group from an array of strings
  export function renderListGroup(items = []) {
    if (items.length === 0) return "<p class='text-muted'>No data available.</p>";
    let html = `<ul class="list-group">`;
    items.forEach(item => {
      html += `<li class="list-group-item">${item}</li>`;
    });
    html += "</ul>";
    return html;
  }
  
  // Render a Bootstrap alert
  export function renderAlert(message, type = "info") {
    return `<div class="alert alert-${type}">${message}</div>`;
  }
  