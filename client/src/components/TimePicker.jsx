// import React, { useState } from 'react'
// import Datepicker from "tailwind-datepicker-react"
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

// const options = {
//     autoHide: false,
//     todayBtn: false,
//     clearBtn: false,
//     // clearBtnText: "Clear",
//     // maxDate: new Date("2030-01-01"),
//     // minDate: new Date("1950-01-01"),
//     theme: {
//         background: "dark:bg-gray-900",
//         todayBtn: "",
//         clearBtn: "",
//         icons: "dark:bg-gray-900 dark:text-white dark:hover:text-black text-gray-900 text-md",
//         text: "dark:text-white dark:hover:text-gray-900",
//         disabledText: "",
//         // input: "block w-80 rounded-md bg-white px-10 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6",
//         // inputIcon: "text-indigo-600",
//         input: "hidden",
//         inputIcon: "hidden",
//         selected: "",
//     },
//     icons: {
//         // () => ReactElement | JSX.Element
//         prev: () => <span>
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fillRule="currentColor" className="size-6 ">
//                 <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
//             </svg>

//         </span>,
//         next: () => <span>
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fillRule="currentColor" className="size-6">
//                 <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
//             </svg>

//         </span>,
//     },
//     datepickerClassNames: "p-0 m-0  relative z-0",
//     defaultDate: new Date(),
//     language: "en",
//     disabledDates: [],
//     weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
//     inputNameProp: "date",
//     inputIdProp: "date",
//     inputPlaceholderProp: "Select Date",
//     inputDateFormatProp: {
//         day: "numeric",
//         month: "long",
//         year: "numeric"
//     }
// }



// const TimePicker = () => {
//     const [openModal, setOpenModal] = useState(false)
//     const [selectedSlot, setSelectedSlot] = useState("")
//     const [selectedDate, setSelectedDate] = useState("")

//     const handleChange = (date) => {
//         setSelectedDate(date)
//         setOpenModal(true)
//     }

//     const timeSlots = [];

//     // Start at 8 AM and go until 12 AM (midnight)
//     for (let hour = 8; hour < 24; hour++) {
//         const ampm = hour < 12 ? "AM" : "PM";  // AM or PM
//         const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;  // Format hour (12-hour clock)

//         // Slot for each hour
//         const startTime = `${hourFormatted}:00 ${ampm}`;

//         // Calculate the next hour correctly, handling AM/PM transitions
//         const nextHour = (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12;
//         const endTime = `${nextHour}:00 ${ampm}`;

//         // Create time slot object
//         const timeSlot = {
//             id: `${hourFormatted}-00-${ampm}`,
//             value: `${startTime} to ${endTime}`,
//         };

//         timeSlots.push(timeSlot);
//     }


//     return (
//         <div>
//             <div className=''>
//                 <Datepicker options={options} onChange={handleChange} show={true} setShow={() => { }} />
//             </div>


//             <Dialog open={openModal} onClose={setOpenModal} className="relative z-10">
//                 <DialogBackdrop
//                     transition
//                     className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
//                 />

//                 <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//                     <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//                         <DialogPanel
//                             transition
//                             className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
//                         >
//                             <div className="sm:flex sm:items-start">
//                                 <div className="mt-3 text-center sm:mt-0 sm:text-left">
//                                     <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
//                                         Select Time Slot
//                                     </DialogTitle>
//                                 </div>
//                             </div>
//                             <div>
//                                 <ul id="timeSlot" className="grid w-full grid-cols-2 gap-2 mt-5">
//                                     {timeSlots.map(item => <li key={item.id}>
//                                         <input type="radio" id={item.id} value={item.value} className="hidden peer" name="timeSlot" onChange={(e) => setSelectedSlot(e.target.value)} />
//                                         <label htmlFor={item.id}
//                                             className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border rounded-lg cursor-pointer text-blue-600 border-blue-600 dark:hover:text-white dark:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white dark:peer-checked:text-white hover:bg-blue-600 dark:text-blue-500 dark:bg-gray-900 dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:peer-checked:bg-blue-500">
//                                             {item.value}
//                                         </label>
//                                     </li>)}
//                                 </ul>
//                             </div>
//                             <div className="mt-7 sm:flex sm:flex-row-reverse">
//                                 <button
//                                     type="button"
//                                     onClick={() => setOpenModal(false)}
//                                     className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
//                                 >
//                                     Save
//                                 </button>
//                                 <button
//                                     type="button"
//                                     data-autofocus
//                                     onClick={() => setOpenModal(false)}
//                                     className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </DialogPanel>
//                     </div>
//                 </div>
//             </Dialog>
//         </div>
//     )
// }

// export default TimePicker

import React, { useEffect, useState } from "react";
import { format, isAfter, isBefore, parse, parseISO, set } from "date-fns";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

const TimePicker = ({ openSlotModal, setOpenSlotModal, selectedDate, setStart, setEnd }) => {

    // const [selectedDate, setSelectedDate] = useState();
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const generateTimeSlots = () => {
        const slots = { day: [], night: [] };
        const now = new Date();
        const today = format(now, "yyyy-MM-dd");

        // Ensure selectedDate is valid
        if (!selectedDate) return slots;

        // Parse selectedDate safely
        const parsedSelectedDate = parseISO(selectedDate);

        // Prevent showing slots for past dates
        if (isBefore(parsedSelectedDate, parseISO(today))) {
            return slots; // Return empty slots if selected date is in the past
        }


        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                let startDateTime = set(new Date(), { hours: hour, minutes: minute, seconds: 0, milliseconds: 0 });
                let endDateTime = set(new Date(), { hours: hour, minutes: minute + 30, seconds: 0, milliseconds: 0 });

                // Skip past time slots if the selected date is today
                if (selectedDate === today && !isAfter(startDateTime, now)) {
                    continue;
                }

                let startTime = format(startDateTime, "h:mm a");
                let endTime = format(endDateTime, "h:mm a");
                let slot = { id: `${hour}-${minute}`, label: `${startTime} - ${endTime}`, startTime, endTime };

                // Categorize slots
                if (hour >= 12) {
                    slots.day.push(slot); // 12 PM - 11:30 PM
                } else {
                    slots.night.push(slot); // 12 AM - 11:30 AM
                }
            }
        }
        return slots;
    };



    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setSelectedSlots([]);
        setStartTime(null);
        setEndTime(null);
    };

    const handleSlotSelection = (slot) => {
        setSelectedSlots((prev) => {
            const newSlots = prev.includes(slot.label)
                ? prev.filter((s) => s !== slot.label)
                : [...prev, slot.label];

            if (newSlots.length > 0) {
                const times = newSlots.map(s => s.split(" - ")[0]);
                const sortedTimes = times.sort((a, b) => parse(a, "h:mm a", new Date()) - parse(b, "h:mm a", new Date()));
                setStartTime(sortedTimes[0]);

                const endTimes = newSlots.map(s => s.split(" - ")[1]);
                const sortedEndTimes = endTimes.sort((a, b) => parse(a, "h:mm a", new Date()) - parse(b, "h:mm a", new Date()));
                setEndTime(sortedEndTimes[sortedEndTimes.length - 1]);
            } else {
                setStartTime(null);
                setEndTime(null);
            }

            return newSlots;
        });
    };

    // const handleSave = () => {
    //     setOpenSlotModal(false)
    //     const time = startTime.split(" ")[0]
    //     console.log(selectedDate, time);


    //     const startDateTime = new Date(`${selectedDate}T${time}:00`)
    //     // const endDateTime = new Date(`${selectedDate}T${endTime}:00`)

    //     console.log(startDateTime.toISOString(  ));

    // }

    const handleSave = () => {
        setOpenSlotModal(false);

        // Ensure selectedDate, startTime, and endTime are defined and properly formatted
        if (!selectedDate || !startTime || !endTime) {
            console.error("Invalid date or time", selectedDate, startTime, endTime);
            return;
        }

        // Function to convert 12-hour format to 24-hour format
        const convertTo24HourFormat = (time) => {
            const timeParts = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
            if (!timeParts) {
                console.error("Invalid time format:", time);
                return null;
            }

            let hours = parseInt(timeParts[1], 10);
            const minutes = timeParts[2];
            const period = timeParts[3].toUpperCase();

            if (period === "PM" && hours !== 12) {
                hours += 12;
            } else if (period === "AM" && hours === 12) {
                hours = 0; // Midnight case
            }

            return `${hours.toString().padStart(2, "0")}:${minutes}`;
        };

        // Convert start and end times to 24-hour format
        const formattedStartTime = convertTo24HourFormat(startTime);
        const formattedEndTime = convertTo24HourFormat(endTime);

        if (!formattedStartTime || !formattedEndTime) {
            return;
        }

        // Construct DateTime objects
        const startDateTime = new Date(`${selectedDate}T${formattedStartTime}:00`);
        const endDateTime = new Date(`${selectedDate}T${formattedEndTime}:00`);

        console.log("Start DateTime:", startDateTime);
        console.log("End DateTime:", endDateTime);

        // Set states
        setStartTime(startDateTime);
        setEndTime(endDateTime);
    };



    useEffect(() => {
        setStart(startTime)
        setEnd(endTime)
    }, [startTime, endTime])


    return (
        <div className="p-4 max-w-md mx-auto">
            <Dialog open={openSlotModal} onClose={setOpenSlotModal} className="relative z-20">
                <DialogBackdrop
                    transition
                    className="fixed bg-gray-500/75 transition-opacity data-[closed]:opacity-0  data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex  min-h-full items-end justify-center p-4 text-center sm:items-center  ">
                        <DialogPanel
                            transition
                            className="relative w-full max-h-[600px] max-w-5xl scrollbar-hide overflow-y-auto transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all 
                            data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in
                             sm:my-8  sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >

                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-lg text-center sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="font-semibold text-gray-900">
                                        Select Time Slot
                                    </DialogTitle>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h4 className="font-semibold">Day</h4>
                                    {
                                        generateTimeSlots().day.length > 0
                                            ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                                                {generateTimeSlots().day.map((slot) => (
                                                    <button
                                                        key={slot.id}
                                                        onClick={() => handleSlotSelection(slot)}
                                                        className={`inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center  border rounded-lg cursor-pointer text-blue-600 border-blue-600 dark:hover:text-white dark:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white dark:peer-checked:text-white hover:bg-blue-600 dark:text-blue-600 dark:bg-gray-900 dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:peer-checked:bg-blue-600 ${selectedSlots.includes(slot.label)
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-white hover:bg-indigo-600"
                                                            }`}
                                                    >
                                                        {slot.label}
                                                    </button>
                                                ))}
                                            </div>
                                            : <h4 className="text-center">Slot Not Found</h4>
                                    }
                                </div>
                                <div>
                                    <h4 className="font-semibold">Night</h4>
                                    {
                                        generateTimeSlots().night.length > 0
                                            ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                                                {generateTimeSlots().night.map((slot) => (
                                                    <button
                                                        key={slot.id}
                                                        onClick={() => handleSlotSelection(slot)}
                                                        className={`inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center  border rounded-lg cursor-pointer text-blue-600 border-blue-600 dark:hover:text-white dark:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white dark:peer-checked:text-white hover:bg-blue-600 dark:text-blue-600 dark:bg-gray-900 dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:peer-checked:bg-blue-600 ${selectedSlots.includes(slot.label)
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-white hover:bg-indigo-600"
                                                            }`}
                                                    >
                                                        {slot.label}
                                                    </button>
                                                ))}
                                            </div>
                                            : <h4 className="text-center">Slot Not Found</h4>
                                    }
                                </div>
                            </div>
                            <div className="mt-7 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    data-autofocus
                                    onClick={() => {
                                        setOpenSlotModal(false)
                                        setSelectedSlots([])
                                        setStartTime(null)
                                        setEndTime(null)
                                    }}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog >

            {/* {
                selectedSlots.length > 0 && (
                    <div className="mt-4 p-2 border rounded">
                        <h3 className="font-semibold">Selected Slots:</h3>
                        <ul>
                            {selectedSlots.map((slot, index) => (
                                <li key={index} className="text-blue-600">{slot}</li>
                            ))}
                        </ul>
                        <p className="mt-2"><strong>Start Time:</strong> {startTime}</p>
                        <p><strong>End Time:</strong> {endTime}</p>
                    </div>
                )
            } */}
        </div >
    );
};

export default TimePicker;