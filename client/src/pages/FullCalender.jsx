import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { customValidator } from '../utils/validator';
import useDynamicForm from '../components/useDynamicForm';
import { useAddEventMutation, useUpdateEventMutation, useGetAllEventsQuery, useDeleteEventMutation } from '../redux/apis/event.api';

const FullCalendarComponent = () => {
  const [deleteEvent] = useDeleteEventMutation()
  const [addEvent] = useAddEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const { data } = useGetAllEventsQuery();
  // console.log("dataaa", data);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clickedDate, setClickedDate] = useState(null);

  const handleDateClick = (arg) => {
    setClickedDate(arg.date.toISOString().split("T")[0]); // Store only the date part
    setSelectedEvent({
      id: null,
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      organizer: '',
    });
    setIsOpen(true);
  };



  const handleEventClick = (clickInfo) => {
    const event = data.find(event => event._id === clickInfo.event.id);
    if (event) {
      setSelectedEvent({
        id: event._id,
        title: event.title,
        description: event.description,
        startTime: event.startTime.slice(0, 16),
        endTime: event.endTime.slice(0, 16),
        location: event.location,
        organizer: event.organizer,
      });
      setIsOpen(true);
    }
  };

  const fields = [
    { name: "title", label: "Title", type: "text", rules: { required: true, min: 2, max: 100 } },
    { name: "description", label: "Description", type: "text", rules: { required: true, min: 2, max: 500 } },
    { name: "startTime", label: "Start Time", type: "time", rules: { required: true } },
    { name: "endTime", label: "End Time", type: "time", rules: { required: true } },
    { name: "location", label: "Location", type: "text", rules: { required: true } },
    { name: "organizer", label: "Organizer", type: "text", rules: { required: true } }
  ];

  const schema = customValidator(fields);

  // const onSubmit = async (data) => {
  //   if (!clickedDate) {
  //     console.error("No date selected!");
  //     return;
  //   }

  //   try {
  //     // Combine clicked date with selected time
  //     const startDateTime = new Date(`${clickedDate}T${data.startTime}:00`);
  //     const endDateTime = new Date(`${clickedDate}T${data.endTime}:00`);

  //     if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
  //       console.error("Invalid date/time values:", data.startTime, data.endTime);
  //       return; // Prevent submission if dates are invalid
  //     }

  //     const eventData = {
  //       title: data.title,
  //       description: data.description,
  //       startTime: startDateTime.toISOString(),
  //       endTime: endDateTime.toISOString(),
  //       location: data.location,
  //       organizer: data.organizer,
  //     };

  //     if (selectedEvent?.id) {
  //       await updateEvent({ id: selectedEvent._id, ...eventData });
  //     } else {
  //       await addEvent(eventData);
  //     }

  //     setIsOpen(false);
  //   } catch (error) {
  //     console.error("Error in onSubmit:", error);
  //   }
  // };
  const onSubmit = async (data) => {
    // If updating an event, use its existing date
    const eventDate = clickedDate || (selectedEvent?.startTime ? selectedEvent.startTime.split("T")[0] : null);

    if (!eventDate) {
      console.error("No date selected!");
      return;
    }

    try {
      // Combine the correct date with selected time
      const startDateTime = new Date(`${eventDate}T${data.startTime}:00`);
      const endDateTime = new Date(`${eventDate}T${data.endTime}:00`);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.error("Invalid date/time values:", data.startTime, data.endTime);
        return; // Prevent submission if dates are invalid
      }

      const eventData = {
        title: data.title,
        description: data.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: data.location,
        organizer: data.organizer,
      };

      if (selectedEvent?.id) {
        await updateEvent({ id: selectedEvent.id, eventData: eventData });
      } else {
        await addEvent(eventData);
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };


  const { renderSingleInput, handleSubmit, reset, setValue } = useDynamicForm({ schema, fields, onSubmit, defaultValues: {} });
  useEffect(() => {
    if (selectedEvent) {
      setValue("title", selectedEvent.title);
      setValue("description", selectedEvent.description);
      setValue("startTime", selectedEvent.startTime);
      setValue("endTime", selectedEvent.endTime);
      setValue("location", selectedEvent.location);
      setValue("organizer", selectedEvent.organizer);
    }
  }, [selectedEvent, setValue]);
  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear',
        }}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={data
          ?.filter(event => !event.isDelete)
          .map(event => ({
            id: event._id,
            title: event.title,
            start: event.startTime,
            end: event.endTime,
            description: event.description,
            location: event.location,
            organizer: event.organizer
          })) || []
        }
        editable={true}
        selectable={true}
      />


      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="size-1">
        <DialogBackdrop className="fixed inset-0 blur-3xl bg-opacity-0 transition-opacity" />
        <div className="fixed inset-0 z-120 flex items-center justify-center">
        //       <DialogPanel className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 transition-all overflow-y-auto h-full">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {selectedEvent?.id ? "Update Event" : "Add Event"}
              </DialogTitle>
              {selectedEvent?.id && (
                <button
                  onClick={async () => {
                    console.log("============", selectedEvent);

                    await deleteEvent(selectedEvent.id);
                    setIsOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                >
                  Delete
                </button>
              )}
            </div>


            <form onSubmit={handleSubmit(onSubmit)} className="">
              <div>{renderSingleInput("title")}</div>
              <div>{renderSingleInput("description")}</div>
              <div>{renderSingleInput("startTime")}</div>
              <div>{renderSingleInput("endTime")}</div>
              <div>{renderSingleInput("location")}</div>
              <div>{renderSingleInput("organizer")}</div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => { reset(); setIsOpen(false); }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  {selectedEvent?.id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default FullCalendarComponent;
