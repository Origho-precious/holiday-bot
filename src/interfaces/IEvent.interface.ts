interface GoogleCalendarEvent {
  id: string;
  kind: string;
  etag: string;
  status: "confirmed" | "tentative" | "cancelled";
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  creator: {
    email: string;
    displayName: string;
    self: boolean;
  };
  organizer: {
    email: string;
    displayName: string;
    self: boolean;
  };
  start: { date: string };
  end: { date: string };
  transparency: "opaque" | "transparent";
  visibility: "default" | "public" | "private" | "confidential";
  iCalUID: string;
  sequence: number;
  eventType: "default";
}

export interface IHoliday {
  month: string;
  title: string;
  past: boolean;
  startDate: string;
  description: string;
  status: GoogleCalendarEvent["status"];
}

export default GoogleCalendarEvent;
