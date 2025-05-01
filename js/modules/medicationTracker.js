function loadMedications() {
  const meds = JSON.parse(localStorage.getItem("medications") || "[]");
  renderMedications(meds);
}

function saveMedication(med) {
  const meds = JSON.parse(localStorage.getItem("medications") || "[]");
  meds.push(med);
  localStorage.setItem("medications", JSON.stringify(meds));
  renderMedications(meds);
}

function removeMedication(index) {
  const meds = JSON.parse(localStorage.getItem("medications") || "[]");
  meds.splice(index, 1);
  localStorage.setItem("medications", JSON.stringify(meds));
  renderMedications(meds);
}

function renderMedications(meds) {
  if (meds.length === 0) {
    $("#medList").html("<p class='text-muted'>No medications added yet.</p>");
    return;
  }

  let html = "<ul class='list-group'>";
  meds.forEach((med, index) => {
    let medLine = `<strong>${med.name}</strong>`;

    if (med.meals.length > 0) {
      const mealParts = med.meals.map(m => `${med.timing} ${m} (${med.dosage})`);
      medLine += ` — ${mealParts.join(", ")}`;
    }

    if (med.schedule && med.schedule.trim() !== "") {
      if (medLine.includes("—")) medLine += "; ";
      else medLine += " — ";
      medLine += med.schedule.includes("every")
        ? `every ${med.schedule.replace("every", "").trim()} (${med.dosage})`
        : `at ${med.schedule} (${med.dosage})`;
    }

    html += `
      <li class='list-group-item d-flex justify-content-between align-items-center'>
        <div>${medLine}</div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeMedication(${index})">Remove</button>
      </li>
    `;

  });
  html += "</ul>";
  $("#medList").html(html);
}

$(document).ready(function () {

  $("#medClockTime").on("input", function () {
    const val = $(this).val().trim().toLowerCase();
    const hasTime = val.includes(":") || val.includes("every");
  
    if (hasTime) {
      // Disable meal selections & timing
      $("#mealButtons input").prop("disabled", true).prop("checked", false);
      $("#medTiming").prop("disabled", true);
    } else {
      // Enable meal options
      $("#mealButtons input").prop("disabled", false);
      $("#medTiming").prop("disabled", false);
    }
  });
  
  $("#addMedBtn").on("click", function () {
    const name = $("#medName").val().trim();
    const dosage = $("#medDosage").val().trim() || "1";
    const schedule = $("#medClockTime").val().trim();
    const isTimeBased = schedule && (schedule.includes(":") || schedule.toLowerCase().includes("every"));
    const meals = [];
    if ($("#mealBreakfast").is(":checked")) meals.push("breakfast");
    if ($("#mealLunch").is(":checked")) meals.push("lunch");
    if ($("#mealDinner").is(":checked")) meals.push("dinner");
  
    if (!name) {
      alert("Please enter a medicine name.");
      return;
    }
  
    if (!isTimeBased && meals.length === 0) {
      alert("Please select at least one meal or enter a schedule (time or interval).");
      return;
    }
  
    const timing = isTimeBased ? "" : $("#medTiming").val() || "";
  
    const medication = {
      name,
      dosage,
      timing,
      meals,
      schedule
    };
  
    saveMedication(medication);
  
    // Clear inputs
    $("#medName").val("");
    $("#medDosage").val("");
    $("#medClockTime").val("");
    $("#medTiming").val("before");
    $("#mealBreakfast, #mealLunch, #mealDinner").prop("checked", false).prop("disabled", false);
    $("#medTiming").prop("disabled", false);
  });
  
  
  // Enable global removal
  window.removeMedication = removeMedication;
  loadMedications();
});