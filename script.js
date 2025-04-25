$(document).ready(function () {
  const flatpickrDate = flatpickr("#dateInput", { 
    dateFormat: "Y-m-d", altInput: true, altFormat: "F j, Y" 
  });
  const flatpickrScan = flatpickr("#scanDate", { 
    dateFormat: "Y-m-d", altInput: true, altFormat: "F j, Y" 
  });  

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

  const congratulations = [
    { range: [4, 8], msg: "Your journey just began. Take care and rest well. 🌼" },
    { range: [9, 13], msg: "First trimester almost complete! 🎉 Time for an NT scan maybe?" },
    { range: [14, 26], msg: "Halfway there! Your baby is growing strong 💪" },
    { range: [27, 35], msg: "You're in the third trimester now. 🍼 Preparing for parenthood!" },
    { range: [36, 40], msg: "Almost time to meet your little one! Pack your hospital bag 👶" }
  ];
  const defaultMessage = "You're doing amazing, mama! 💖 Keep glowing!";

  const trimesters = [
    {
      range: [0, 13],
      label: `
        <strong>First Trimester (Week 1–13)</strong><br>
        Your body is adjusting to pregnancy. It's common to feel <em>fatigue, nausea (morning sickness), breast tenderness</em>, and emotional ups and downs.<br>
        <strong class="text-danger">⚠️ If vomiting prevents you from keeping fluids down, consult a doctor.</strong>
      `
    },
    {
      range: [14, 27],
      label: `
        <strong>Second Trimester (Week 14–27)</strong><br>
        Energy usually improves. You may experience <em>backaches, leg cramps, stretch marks, mild swelling</em>, and feel the baby move.<br>
        <strong class="text-danger">⚠️ Sudden swelling, headaches, or blurred vision? Contact a doctor immediately.</strong>
      `
    },
    {
      range: [28, 40],
      label: `
        <strong>Third Trimester (Week 28–40)</strong><br>
        Expect <em>frequent urination, insomnia, shortness of breath, Braxton Hicks contractions</em> as baby grows.<br>
        <strong class="text-danger">⚠️ If you experience fluid leakage, bleeding, or painful regular contractions — seek care now.</strong>
      `
    }
  ];  

  const nutritionAdvice = [
    "Eat iron-rich foods like lentils, spinach, and fish.",
    "Include calcium from milk, yogurt, or small fish with bones.",
    "Take folic acid supplements if not already advised.",
    "Stay hydrated and eat small, frequent meals.",
    "Avoid street food and raw fish/meat. Cook well."
  ];

  const dearMomNotes = {
    6: "Dear Parent, each flutter of change is your body preparing to nurture. 💞",
    12: "You're nearing the end of your first trimester. You've done wonderfully! 🌱",
    20: "Halfway there! Your strength and love shape the journey ahead. 💪",
    28: "As baby kicks grow stronger, so does your bond. You're amazing. 🤱",
    36: "You're almost there! Breathe, rest, and know you're ready. ❤️",
    default: "Every week is a beautiful step forward. Keep going! 🌸"
  };

  // Load stored values on page load
  function loadLocalData() {
    const saved = JSON.parse(localStorage.getItem("pregnancyData") || "{}");
    
    if (saved.dateInput) flatpickrDate.setDate(saved.dateInput, true);
    if (saved.scanDate) flatpickrScan.setDate(saved.scanDate, true);
    
    $("#calcMethod").val(saved.method || "").trigger("change");
    if (saved.dateInput) $("#dateInput").val(saved.dateInput);
    if (saved.scanDate) $("#scanDate").val(saved.scanDate);
    if (saved.scanWeeks) $("#scanWeeks").val(saved.scanWeeks);
    if (saved.scanDays) $("#scanDays").val(saved.scanDays);
    if (saved.kickCount) {
      kickCount = saved.kickCount;
      $("#kickCount").text(kickCount);
    }

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
      scanDays: $("#scanDays").val(),
      kickCount: kickCount
    };
    localStorage.setItem("pregnancyData", JSON.stringify(data));
  }
  $("#calcMethod").on("change", function () {
    const selected = $(this).val();
    $("#scanInputs").toggleClass("d-none", selected !== "scan");
    $("#dateInput").closest(".mb-3").toggle(selected !== "scan");
  });

  let kickCount = 0;
  $("#kickButton").on("click", function () {
    kickCount++;
    $("#kickCount").text(kickCount);
    saveLocalData();
  });

  $("#resetKicks").on("click", function () {
    kickCount = 0;
    $("#kickCount").text(kickCount);
    saveLocalData();
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
    $("#dearMomNote").text(dearMomNotes[weeks] || dearMomNotes.default);

    $("#recommendations").html(recHTML);
    $("#results, #trimesterInfo, #nutritionAdvice, #dearMomSection, #kickCounter, #printSummarySection").removeClass("d-none");
    
    saveLocalData();
  });
  loadLocalData();
});
