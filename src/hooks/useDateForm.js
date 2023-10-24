import { useState } from 'react';

const useDateForm = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    return {
        startDate,
        endDate,
        setStartDate,
        setEndDate
    };
}

export default useDateForm;