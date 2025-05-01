// Load stored values on page load
function loadLocalData() {
  const flatpickrDate = flatpickr("#dateInput", { 
    dateFormat: "Y-m-d", altInput: true, altFormat: "F j, Y" 
  });
  const flatpickrScan = flatpickr("#scanDate", { 
    dateFormat: "Y-m-d", altInput: true, altFormat: "F j, Y" 
  }); 
  const saved = JSON.parse(localStorage.getItem("pregnancyData") || "{}");
  
  if (saved.dateInput) flatpickrDate.setDate(saved.dateInput, true);
  if (saved.scanDate) flatpickrScan.setDate(saved.scanDate, true);
  
  $("#calcMethod").val(saved.method || "").trigger("change");
  if (saved.dateInput) $("#dateInput").val(saved.dateInput);
  if (saved.scanDate) $("#scanDate").val(saved.scanDate);
  if (saved.scanWeeks) $("#scanWeeks").val(saved.scanWeeks);
  if (saved.scanDays) $("#scanDays").val(saved.scanDays);
  const today = new Date().toISOString().split("T")[0];
  const kickLog = JSON.parse(localStorage.getItem("kickLog") || "{}");
  const todayKicks = (kickLog[today]?.log?.length || 0) + (kickLog[today]?.manual || 0);
  $("#kickCount").text(todayKicks);


  // Optional: auto-submit to restore summary
  if (saved.dateInput || saved.scanDate) {
    setTimeout(() => $("#dateForm").trigger("submit"), 100); 
  }
}

// Save to local storage
function saveLocalData() {
  const data = {
    method: $("#calcMethod").val(),
    dateInput: $("#dateInput").val(),
    scanDate: $("#scanDate").val(),
    scanWeeks: $("#scanWeeks").val(),
    scanDays: $("#scanDays").val()
  };
  localStorage.setItem("pregnancyData", JSON.stringify(data));
}