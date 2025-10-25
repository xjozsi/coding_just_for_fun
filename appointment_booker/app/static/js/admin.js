async function toggleSlot(id) {
  const res = await fetch(`/api/admin/toggle/${id}`, { method: "POST" });
  const data = await res.json();
  if (data.success) location.reload();
  else alert("❌ Failed to update slot");
}

document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("slotsTable");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.getElementsByTagName("tr"));
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const prevBtn = document.getElementById("prevDay");
  const nextBtn = document.getElementById("nextDay");
  const dayPicker = $("#dayPicker");

  const days = {};
  rows.forEach(row => {
    const date = row.dataset.date;
    if (!days[date]) days[date] = [];
    days[date].push(row);
  });

  const allDates = Object.keys(days).sort();
  let currentDayIndex = 0;

  // Biztonságos datepicker init
  dayPicker.datepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true
  }).on("changeDate", (e) => {
    const selectedDate = e.format("yyyy-mm-dd");
    const idx = allDates.indexOf(selectedDate);
    if (idx !== -1) {
      currentDayIndex = idx;
      renderDay();
    } else {
      alert(`❌ No data for ${selectedDate}`);
    }
  });

  function renderDay() {
    const date = allDates[currentDayIndex];
    const slots = days[date];
    const search = searchInput.value.toLowerCase();
    const statusVal = statusFilter.value;

    dayPicker.datepicker("update", date);
    tbody.innerHTML = "";

    const filtered = slots.filter(row => {
      const time = row.cells[0].textContent.toLowerCase();
      const status = row.cells[1].dataset.status;
      const name = row.cells[2].textContent.toLowerCase();
      const email = row.cells[3].textContent.toLowerCase();

      return (
        [time, name, email].some(v => v.includes(search)) &&
        (statusVal === "all" || status === statusVal)
      );
    });

    filtered.forEach(row => tbody.appendChild(row));
    prevBtn.disabled = currentDayIndex === 0;
    nextBtn.disabled = currentDayIndex === allDates.length - 1;
  }

  prevBtn.addEventListener("click", () => {
    if (currentDayIndex > 0) {
      currentDayIndex--;
      renderDay();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentDayIndex < allDates.length - 1) {
      currentDayIndex++;
      renderDay();
    }
  });

  searchInput.addEventListener("keyup", renderDay);
  statusFilter.addEventListener("change", renderDay);

  renderDay();
});
