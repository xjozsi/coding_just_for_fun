document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const bookingModal = new bootstrap.Modal(document.getElementById("bookingModal"));
  const form = document.getElementById("bookingForm");
  let selectedSlot = null;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    nowIndicator: true,
    allDaySlot: false,
    slotDuration: "00:30:00",
    height: "auto",
    expandRows: true,
    slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    eventSources: [
      {
        url: "/api/slots",
        method: "GET",
        failure: () => alert("❌ Failed to load events"),
      },
    ],
    eventClick: function (info) {
      const event = info.event;
      if (event.backgroundColor === "#dc3545") {
        alert("❌ This slot is already booked.");
        return;
      }
      selectedSlot = event.id;
      bookingModal.show();
    },
  });

  calendar.render();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedSlot, name, email }),
    });

    const result = await res.json();
    if (result.success) {
      bookingModal.hide();
      form.reset();
      alert("✅ Booking confirmed!");
      calendar.refetchEvents(); // 🔄 Frissítés reload nélkül
    } else {
      alert("❌ " + result.message);
    }
  });
});
