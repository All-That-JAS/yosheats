import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarApp() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="app">
      <h1>User History:</h1>
      <h3 className="text-center">Pick a date:</h3>
      <div className="calendar-container">
        <Calendar onChange={setDate} value={date} />
      </div>
      <p className="text-center">
        <span className="bold">Selected Date:</span> {date.toDateString()}
      </p>
    </div>
  );
}

export default CalendarApp;
