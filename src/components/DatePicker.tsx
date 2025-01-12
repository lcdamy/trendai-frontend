import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CampaignFormProps } from '@/@types/global';
import dayjs from 'dayjs';

const DatePickerComponent: React.FC<CampaignFormProps> = ({ formData, setFormData, fieldName }) => {

    const handleDateChange = (date: dayjs.Dayjs | null) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: date ? date.toDate() : null
        }));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker value={formData[fieldName] ? dayjs(formData[fieldName]) : null}
                onChange={handleDateChange}
                format="DD/MM/YYYY" />
        </LocalizationProvider>
    );
}

export default DatePickerComponent;