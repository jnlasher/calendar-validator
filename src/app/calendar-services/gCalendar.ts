export class GCalendar {
  kind:             string;
  etag:             string;
  id:               string;
  summary:          string;
  timeZone:         string;
  colorId:          string;
  bgndColor:        string;
  fgndColor:        string;
  accessRole:       string;
  defaultReminders: [];
  confProperties:   {};
}

export class GCalendarEvent {
  king: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  creator: Editor;
  organizer: Editor;
  start: EventDateTime;
  end: EventDateTime;
}

export class Editor {
  email: string;
  displayName: string;
  self: boolean;
}

export class EventDateTime {
  date: string;
  time: string;
}