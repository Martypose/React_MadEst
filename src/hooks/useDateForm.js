import { useState } from "react";

const useDateForm = () => {
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(today.getDay + 1);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };
};

export default useDateForm;
