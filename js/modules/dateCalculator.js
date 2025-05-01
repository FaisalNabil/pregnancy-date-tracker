$(document).ready(function () {

  new Choices("#calcMethod", { searchEnabled: false, itemSelectText: "" });

  $("#calcMethod").on("change", function () {
    const selected = $(this).val();
    $("#scanInputs").toggleClass("d-none", selected !== "scan");
    $("#dateInput").closest(".mb-3").toggle(selected !== "scan");
  });

  $("#dateForm").on("submit", function (e) {
    e.preventDefault();

    const method = $("#calcMethod").val();
    const today = dayjs();
    let edd, gestationalAgeInDays;

    if (method === "lmp") {
      const lmp = dayjs($("#dateInput").val());
      edd = lmp.add(280, "day");
      gestationalAgeInDays = today.diff(lmp, "day");
    } else if (method === "conception") {
      const conception = dayjs($("#dateInput").val());
      edd = conception.add(266, "day");
      gestationalAgeInDays = today.diff(conception, "day");
    } else if (method === "edd") {
      edd = dayjs($("#dateInput").val());
      gestationalAgeInDays = 280 - edd.diff(today, "day");
    } else if (method === "scan") {
      const scanDate = dayjs($("#scanDate").val());
      const scanWeeks = parseInt($("#scanWeeks").val(), 10);
      const scanDays = parseInt($("#scanDays").val(), 10);
      const scanGAInDays = (scanWeeks * 7) + scanDays;
      edd = scanDate.add(280 - scanGAInDays, "day");
      gestationalAgeInDays = 280 - edd.diff(today, "day");
    }

    const weeks = Math.floor(gestationalAgeInDays / 7);
    const days = gestationalAgeInDays % 7;
    const match = congratulations.find(c => weeks >= c.range[0] && weeks <= c.range[1]);
    const congratsMsg = match ? match.msg : defaultMessage;


    const summary = `
      <strong>Current Gestational Age:</strong> ${weeks} weeks and ${days} days<br>
      <strong>Estimated Due Date:</strong> ${edd.format("MMMM D, YYYY")}<br>
      <div class="mt-2 alert alert-info">${congratsMsg}</div>
    `;

    $("#summaryText").html(summary);

    let recHTML = "<ul>";
    testSchedule.forEach(test => {
      if (weeks >= test.range[0] && weeks <= test.range[1]) {
        recHTML += `<li><strong>Week ${test.range[0]}–${test.range[1]}:</strong> ${test.name} – It's time! ✅</li>`;
      } else if (weeks < test.range[0]) {
        recHTML += `<li><strong>Week ${test.range[0]}–${test.range[1]}:</strong> ${test.name} – Coming up soon ⏳</li>`;
      } else {
        recHTML += `<li><strong>Week ${test.range[0]}–${test.range[1]}:</strong> ${test.name} – Likely done ✔️</li>`;
      }
    });
    recHTML += "</ul>";

    // Trimester Display
    const trimester = trimesters.find(t => weeks >= t.range[0] && weeks <= t.range[1]);
    $("#trimesterText").html(trimester ? trimester.label : "N/A");

    // Nutrition and Notes
    $("#nutritionText").html("<ul><li>" + nutritionAdvice.join("</li><li>") + "</li></ul>");
    const momNote = dearMomNotes.find(n => weeks >= n.range[0] && weeks <= n.range[1]);
    $("#dearMomNote").text(momNote ? momNote.msg : defaultDearNote);

    $("#recommendations").html(recHTML);
    $("#results, #trimesterInfo, #nutritionAdvice, #dearMomSection, #kickCounter, #printSummarySection").removeClass("d-none");
    
    saveLocalData();
  });
  loadLocalData();

  // Flatpickr setup for date picker
  flatpickr("#checkWeeksDate", {
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y"
  });

  $("#checkWeeksBtn").on("click", function () {
    const selectedDate = $("#checkWeeksDate").val();
    const resultEl = $("#checkWeeksResult").html("");
    if (!selectedDate) return resultEl.html(`<div class="text-danger">Please select a date first.</div>`);

    const saved = JSON.parse(localStorage.getItem("pregnancyData") || "{}");
    let edd;

    if (saved.method === "lmp") {
      edd = dayjs(saved.dateInput).add(280, "day");
    } else if (saved.method === "conception") {
      edd = dayjs(saved.dateInput).add(266, "day");
    } else if (saved.method === "edd") {
      edd = dayjs(saved.dateInput);
    } else if (saved.method === "scan") {
      const scanDate = dayjs(saved.scanDate);
      const scanWeeks = parseInt(saved.scanWeeks, 10);
      const scanDays = parseInt(saved.scanDays, 10);
      const scanGAInDays = (scanWeeks * 7) + scanDays;
      edd = scanDate.add(280 - scanGAInDays, "day");
    } else {
      return resultEl.html(`<div class="text-danger">Please calculate your due date in the Summary tab first.</div>`);
    }

    const targetDate = dayjs(selectedDate);
    const gestAgeDays = 280 - edd.diff(targetDate, "day");

    if (gestAgeDays < 0 || gestAgeDays > 300) {
      return resultEl.html(`<div class="text-warning">That date is outside the typical pregnancy range.</div>`);
    }

    const weeks = Math.floor(gestAgeDays / 7);
    const days = gestAgeDays % 7;

    resultEl.html(`On <strong>${targetDate.format("MMMM D, YYYY")}</strong>, you'll be <strong>${weeks} weeks and ${days} days</strong> pregnant.`);
  });

  $("#findDateForWeekBtn").on("click", function () {
    const weeks = parseInt($("#targetWeeks").val(), 10);
    const days = parseInt($("#targetDays").val(), 10) || 0;
    const resultEl = $("#findDateResult").html("");

    if (isNaN(weeks) || weeks < 0 || weeks > 42 || days < 0 || days > 6) {
      return resultEl.html(`<div class="text-danger">Please enter valid weeks (0–42) and days (0–6).</div>`);
    }

    const saved = JSON.parse(localStorage.getItem("pregnancyData") || "{}");
    let edd;

    if (saved.method === "lmp") {
      edd = dayjs(saved.dateInput).add(280, "day");
    } else if (saved.method === "conception") {
      edd = dayjs(saved.dateInput).add(266, "day");
    } else if (saved.method === "edd") {
      edd = dayjs(saved.dateInput);
    } else if (saved.method === "scan") {
      const scanDate = dayjs(saved.scanDate);
      const scanWeeks = parseInt(saved.scanWeeks, 10);
      const scanDays = parseInt(saved.scanDays, 10);
      const scanGAInDays = (scanWeeks * 7) + scanDays;
      edd = scanDate.add(280 - scanGAInDays, "day");
    } else {
      return resultEl.html(`<div class="text-danger">Please calculate your due date in the Summary tab first.</div>`);
    }

    const gaInDays = (weeks * 7) + days;
    const resultDate = edd.subtract(280 - gaInDays, "day");

    resultEl.html(`You will be <strong>${weeks} weeks and ${days} days</strong> pregnant on <strong>${resultDate.format("MMMM D, YYYY")}</strong>.`);
  });

});