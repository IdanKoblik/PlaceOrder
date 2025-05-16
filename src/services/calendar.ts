import { CreateOrderRequest, RemoveOrderRequest } from "../modules/order";
import { MAX_TABLE_TIME } from "../server";

export const createEvent = async (request: CreateOrderRequest): Promise<string> => {
    const description = `
    ${request.name} - ${request.phoneNumber}
    🪑 ${request.tableNumber}
    👥 ${request.guests}

    ------
    ${request.note}
    `;

  const start = new Date(request.time);
  const end = new Date(start.getTime() + MAX_TABLE_TIME);

  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${request.googleToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `${request.name} - ${request.phoneNumber}`,
        description: description,
        start: {
          dateTime: start,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
            dateTime: end,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create event');
    }

    const res = await response.json()
    return res.id;
  } catch (error) {
    console.error('Error creating event:', error);
    return "";
  }
}

export const removeEvent = async (request: RemoveOrderRequest) => {
    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${request.eventId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${(request.googleToken)}`,
        },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to remove event');
      }

      console.log('Event removed successfully');
    } catch (error) {
      console.error('Error removing event:', error);
    }
};
