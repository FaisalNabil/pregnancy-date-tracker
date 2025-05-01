// Kick Counter with full day history, block views, and date range navigation

const kickKey = "kickLog";

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function getPastDateISO(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function loadKickLog() {
  return JSON.parse(localStorage.getItem(kickKey) || "{}");
}

function saveKickLog(log) {
  localStorage.setItem(kickKey, JSON.stringify(log));
}

function recordKick(time = new Date()) {
  const isoDate = getTodayISO();
  const log = loadKickLog();
  if (!log[isoDate]) log[isoDate] = { log: [], manual: 0 };
  log[isoDate].log.push(time.toISOString());
  saveKickLog(log);
}

function addManualKicks(count, date = getTodayISO()) {
  const log = loadKickLog();
  if (!log[date]) log[date] = { log: [], manual: 0 };
  log[date].manual += count;
  saveKickLog(log);
}

function getKicksByBlock(dateStr, blockHours = 6) {
  const log = loadKickLog()[dateStr];
  if (!log) return [];

  const blocks = new Array(24 / blockHours).fill(0);
  const kicks = (log.log || []).concat(new Array(log.manual).fill(null));

  kicks.forEach(entry => {
    let hour = 0;
    if (entry) {
      const h = new Date(entry).getHours();
      hour = h;
    }
    const blockIndex = Math.floor(hour / blockHours);
    blocks[blockIndex]++;
  });

  return blocks;
}

function displayKicksFor(dateStr, blockHours = 6) {
  const blocks = getKicksByBlock(dateStr, blockHours);
  const labels = [];

  for (let i = 0; i < 24; i += blockHours) {
    const end = (i + blockHours) % 24;
    labels.push(`${String(i).padStart(2, "0")}:00–${String(end).padStart(2, "0")}:00`);
  }

  let out = `<p><strong>${dateStr}</strong><br>Total Kicks: <strong>${blocks.reduce((a,b)=>a+b,0)}</strong></p><ul>`;
  blocks.forEach((c, i) => {
    out += `<li>${labels[i]}: ${c}</li>`;
  });
  out += "</ul>";
  document.getElementById("kickBreakdown").innerHTML = out;
}

function displayRecentHistory(blockHours = 6, startOffset = 1, count = 3) {
  const container = document.getElementById("recentKickHistory");
  container.innerHTML = "";

  for (let i = startOffset; i < startOffset + count; i++) {
    const date = getPastDateISO(i);
    const blocks = getKicksByBlock(date, blockHours);
    const total = blocks.reduce((a, b) => a + b, 0);
    container.innerHTML += `<div class="border rounded p-2 mb-2">
      <strong>${date}:</strong> ${total} kicks 
      <button class="btn btn-sm btn-outline-secondary float-end" onclick="displayKicksFor('${date}', ${blockHours})">View</button>
    </div>`;
  }

  container.innerHTML += `
    <div class="d-flex justify-content-between mt-3">
      ${startOffset > 1
        ? `<button class="btn btn-sm btn-outline-secondary" onclick="displayRecentHistory(${blockHours}, 1, 3)">⬅️ Back to Recent</button>`
        : `<div></div>`}
      <button class="btn btn-sm btn-outline-primary" onclick="loadMoreHistory(${startOffset + count})">📅 View More</button>
    </div>`;
}


function loadMoreHistory(newOffset) {
  const blockHours = parseInt(document.getElementById("blockRange").value, 10);
  displayRecentHistory(blockHours, newOffset, 3);
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  const today = getTodayISO();
  let selectedBlockHours = 6;

  // flatpickr
  if (typeof flatpickr !== "undefined") {
    flatpickr("#manualKickDate", { dateFormat: "Y-m-d", defaultDate: today });
    flatpickr("#kickDateSelector", {
      dateFormat: "Y-m-d",
      defaultDate: today,
      onChange: (selectedDates, dateStr) => {
        const hours = parseInt(document.getElementById("blockRange").value, 10);
        displayKicksFor(dateStr, hours);
      }
    });
  }

  // Manual kick entry
  document.getElementById("manualKickAdd").addEventListener("click", () => {
    const date = document.getElementById("manualKickDate").value;
    const count = parseInt(document.getElementById("manualKickCount").value, 10);
    if (!date || !count || count < 1) {
      alert("Please enter a valid date and kick count.");
      return;
    }
    addManualKicks(count, date);
    displayKicksFor(date, selectedBlockHours);
    document.getElementById("manualKickCount").value = "";
  });

  // Kick tap + reset
  document.getElementById("kickButton").addEventListener("click", () => {
    recordKick();
    displayKicksFor(today, selectedBlockHours);

    const todayLog = loadKickLog()[today];
    const totalKicks = (todayLog?.log?.length || 0) + (todayLog?.manual || 0);
    document.getElementById("kickCount").textContent = totalKicks;
  });

  document.getElementById("resetKicks").addEventListener("click", () => {
    const log = loadKickLog();
    delete log[today];
    saveKickLog(log);
    displayKicksFor(today, selectedBlockHours);
    document.getElementById("kickCount").textContent = "0";
  });

  // Block Range Change
  document.getElementById("blockRange").addEventListener("change", () => {
    selectedBlockHours = parseInt(document.getElementById("blockRange").value, 10);
    const date = document.getElementById("kickDateSelector").value || today;
    displayKicksFor(date, selectedBlockHours);
    displayRecentHistory(selectedBlockHours, 1, 3);
  });

  // Initial view
  displayKicksFor(today, selectedBlockHours);
  displayRecentHistory(selectedBlockHours, 1, 3);
});
