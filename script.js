$(document).ready(function () {
  flatpickr("#dateInput", { dateFormat: "Y-m-d", altInput: true, altFormat: "F j, Y" });
  flatpickr("#scanDate", { dateFormat: "Y-m-d", altInput: true, altFormat: "F j, Y" });

  new Choices("#calcMethod", { searchEnabled: false, itemSelectText: "" });

  const testSchedule = [
    { range: [6, 8], name: "Early Dating Scan" },
    { range: [11, 14], name: "NT Scan + Dual Marker" },
    { range: [18, 22], name: "Anomaly Scan" },
    { range: [24, 28], name: "Glucose Tolerance Test (GTT)" },
    { range: [28, 32], name: "Anti-D if Rh-negative" },
    { range: [32, 36], name: "Growth Scan" },
    { range: [36, 40], name: "Position Scan / GBS Test" }
  ];

  const congratulations = {
    6: "Your journey just began. Take care and rest well. 🌼",
    12: "First trimester almost complete! 🎉 Time for an NT scan maybe?",
    20: "Halfway there! Your baby is growing strong 💪",
    28: "You're in the third trimester now. 🍼 Preparing for parenthood!",
    36: "Almost time to meet your little one! Pack your hospital bag 👶",
    default: "You're doing amazing, mama! 💖 Keep glowing!"
  };

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
    const congratsMsg = congratulations[weeks] || congratulations.default;

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

    $("#recommendations").html(recHTML);
    $("#results").removeClass("d-none");
  });
});
