$(document).ready(function () {
    const testSchedule = [
      { week: 8, name: "First checkup & dating scan" },
      { week: 12, name: "NT scan + blood tests" },
      { week: 20, name: "Anomaly scan (Level 2 ultrasound)" },
      { week: 24, name: "Gestational diabetes screening (GTT)" },
      { week: 28, name: "Anti-D injection if Rh-negative" },
      { week: 32, name: "Growth scan" },
      { week: 36, name: "Position scan + Group B Strep test" },
      { week: 38, name: "Final checkups before delivery" }
    ];
  
    $("#dateForm").on("submit", function (e) {
      e.preventDefault();
  
      const method = $("#calcMethod").val();
      const inputDate = $("#dateInput").val();
  
      if (!inputDate) return;
  
      const baseDate = dayjs(inputDate);
      const today = dayjs();
      const conceptionDate = method === "lmp" ? baseDate.add(14, "day") : baseDate;
  
      const weeksDiff = today.diff(conceptionDate, "week");
      const daysDiff = today.diff(conceptionDate, "day") % 7;
      const dueDate = conceptionDate.add(38, "week");
  
      // Display
      $("#weekInfo").html(`<strong>Gestational Age:</strong> ${weeksDiff} weeks and ${daysDiff} days`);
      $("#dueDate").html(`<strong>Estimated Due Date:</strong> ${dueDate.format("MMMM D, YYYY")}`);
  
      // Timeline
      let timelineHTML = "<strong>Recommended Test Timeline:</strong><ul>";
      testSchedule.forEach(test => {
        const testDate = conceptionDate.add(test.week, "week").format("MMMM D, YYYY");
        timelineHTML += `<li>Week ${test.week}: ${test.name} — <em>${testDate}</em></li>`;
      });
      timelineHTML += "</ul>";
  
      $("#testTimeline").html(timelineHTML);
      $("#results").fadeIn();
    });
  });
  