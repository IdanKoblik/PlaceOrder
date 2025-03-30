import { CreateReadStreamOptions } from "fs/promises";
import { CreateEventRequest } from "../modules/order";
import { MAX_TABLE_TIME } from "../server";
import express, { Request, Response } from 'express';

const router = express.Router();

export const createEvent = async (request: CreateEventRequest) => {
    const description = `
        ${request.name} - ${request.phone_number}
        🪑 ${request.table_num}
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
            'Authorization': `Bearer ${request.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: `${request.name} - ${request.phone_number}`,
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

    } catch (error) {
        console.error('Error creating event:', error);
    }
};

export default router;
