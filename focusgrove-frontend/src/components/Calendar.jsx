import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { getHighlightedDays } from '../api/logApi';

const initialValue = dayjs();

// ⭐ Glassmorphism Badge 스타일
const badgeStyle = {
    '& .MuiBadge-badge': {
        background: 'linear-gradient(145deg, rgba(34,243,231,0.9), rgba(22,174,165,0.95))',
        color: '#fff',
        fontSize: '0.7rem',
        minWidth: '22px',
        height: '22px',
        borderRadius: '50%',
        boxShadow: '0 0 6px rgba(34,243,231,0.6)',
    },
};

function ServerDay(props) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    const dayInfo = highlightedDays.find(d => d.day === day.date());
    const isSelected = !outsideCurrentMonth && dayInfo;

    return (
        <Badge
            key={day.toString()}
            overlap="circular"
            badgeContent={isSelected ? dayInfo.pomodoros : undefined}
            sx={badgeStyle}
        >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
}

export default function HighlightingCalendar() {
    const requestAbortController = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [highlightedDays, setHighlightedDays] = React.useState([]);
    const [error, setError] = React.useState(null);

    const fetchHighlightedDays = (date) => {
        const controller = new AbortController();

        getHighlightedDays(date.year(), date.month() + 1)
            .then(({ daysToHighlight }) => {
                setHighlightedDays(daysToHighlight);
                setIsLoading(false);
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    setError('Failed to fetch highlighted days.');
                    setIsLoading(false);
                }
            });

        requestAbortController.current = controller;
    };

    React.useEffect(() => {
        fetchHighlightedDays(initialValue);
        return () => requestAbortController.current?.abort();
    }, []);

    const handleMonthChange = (date) => {
        requestAbortController.current?.abort();
        setIsLoading(true);
        setHighlightedDays([]);
        setError(null);
        fetchHighlightedDays(date);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div
                className="
                backdrop-blur-xl
                bg-white/5
                border border-white/20
                rounded-2xl
                shadow-2xl
                p-6
                min-w-0
                hover:bg-white/15
                transition duration-300
            "
            >
                {error && <p className="text-red-400 mb-2">{error}</p>}

                <DateCalendar
                    defaultValue={initialValue}
                    loading={isLoading}
                    onMonthChange={handleMonthChange}
                    renderLoading={() => <DayCalendarSkeleton sx={{backgroundColor: 'rgba(255,255,255,0.05)'}}/>}

                    slots={{
                        day: ServerDay,
                    }}

                    slotProps={{
                        day: {highlightedDays},
                    }}

                    sx={{
                        color: 'white',
                        padding: '4px',

                        // 요일 글자 색
                        '& .MuiDayCalendar-weekDayLabel': {
                            color: 'rgba(255,255,255,0.75)',
                            fontWeight: '500',
                        },

                        // 네비게이션 화살표
                        '& .MuiSvgIcon-root': {
                            fill: 'rgba(255,255,255,0.8)',
                            '&:hover': {
                                fill: 'white',
                            }
                        },

                        // 캘린더 헤더 Month-Year
                        '& .MuiPickersCalendarHeader-label': {
                            color: 'rgba(255,255,255,0.95)',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            textShadow: '0 0 6px rgba(34,243,231,0.4)',
                        },

                        // 날짜 스타일
                        '& .MuiPickersDay-root': {
                            color: 'rgba(255,255,255,0.85)',
                            fontWeight: 600,
                            borderRadius: '10px',
                            transition: '0.25s',

                            '&:hover': {
                                backgroundColor: 'rgba(34,243,231,0.15)',
                            },
                        },

                        // 오늘 날짜
                        '& .MuiPickersDay-today': {
                            borderColor: 'rgba(34,243,231,0.9)',
                            borderWidth: '2px',
                            borderRadius: '10px',
                        },

                        // 선택된 날짜
                        '& .Mui-selected': {
                            background:
                                'linear-gradient(145deg, rgba(34,243,231,0.9), rgba(22,174,165,1)) !important',
                            color: '#fff !important',
                            boxShadow: '0 0 6px rgba(34,243,231,0.7)',
                        },
                    }}
                />
            </div>
        </LocalizationProvider>
    );
}
