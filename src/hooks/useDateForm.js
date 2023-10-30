import { useState } from "react";

const useDateForm = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(tomorrow);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };
};

export default useDateForm;
