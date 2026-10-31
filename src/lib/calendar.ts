/**
 * Calendar links for a single fixed event.
 *
 * Times are stored as UTC instants rather than local times with a VTIMEZONE
 * block. The event is 12:00-13:30 IST (UTC+05:30), which is 06:30-08:00Z, and
 * expressing it that way means every client resolves the same moment without
 * needing to agree on a timezone database. India has no daylight saving, so the
 * offset is fixed and the conversion cannot drift.
 */

export type CalendarEvent = {
  title: string;
  description: string;
  location: string;
  /** Compact UTC form: YYYYMMDDTHHMMSSZ */
  startUtc: string;
  endUtc: string;
  uid: string;
};

export const DATE_EVENT: CalendarEvent = {
  title: "Lunch With Ashuthosh 🌹",
  description:
    "A date with a self-proclaimed pro. Agenda: good food, questionable jokes and absolutely no PowerPoint presentations.",
  location: "Dual Room, Indiranagar, Bengaluru",
  startUtc: "20260927T063000Z", // Sun 27 Sep 2026, 12:00 IST
  endUtc: "20260927T080000Z", //   Sun 27 Sep 2026, 13:30 IST
  uid: "lunch-20260927-ashuthosh@ashuthosh.de",
};

/**
 * The second date is dinner at 8 PM, but the day and the restaurant are
 * Nithya's call, so the event is built from whichever she picks.
 */
export const SECOND_DATE_DAYS = [
  {
    id: "sun",
    label: "Sunday, Nov 1",
    long: "Sunday, November 1, 2026",
    startUtc: "20261101T143000Z", // 20:00 IST
    endUtc: "20261101T163000Z", //   22:00 IST
  },
  {
    id: "mon",
    label: "Monday, Nov 2",
    long: "Monday, November 2, 2026",
    startUtc: "20261102T143000Z", // 20:00 IST
    endUtc: "20261102T163000Z", //   22:00 IST
  },
] as const;

export const SECOND_DATE_VENUES = [
  {
    id: "kalpaney",
    label: "Kalpaney",
    long: "Kalpaney, JP Nagar, Bengaluru",
    blurb: "Playful vegetarian comfort food",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Kalpaney+JP+Nagar+Bengaluru",
  },
  {
    id: "neemsi",
    label: "Neemsi",
    long: "Neemsi, JP Nagar, Bengaluru",
    blurb: "Classic vegetarian, very cosy",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Neemsi+Restaurant+JP+Nagar+Bengaluru",
  },
] as const;

export type SecondDateDay = (typeof SECOND_DATE_DAYS)[number];
export type SecondDateVenue = (typeof SECOND_DATE_VENUES)[number];

export function secondDateEvent(
  day: SecondDateDay,
  venue: SecondDateVenue,
): CalendarEvent {
  return {
    title: "Second Date With the Pro 🌹",
    description:
      "Follow-up dinner. Agenda: review last meeting's action items, more talking from the engineer, and dessert. Map: " +
      venue.mapUrl,
    location: venue.long,
    startUtc: day.startUtc,
    endUtc: day.endUtc,
    // Stable per day, so re-importing after changing the venue updates the
    // same calendar entry instead of adding a second one.
    uid: `dinner-${day.startUtc.slice(0, 8)}-ashuthosh@ashuthosh.de`,
  };
}

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${event.startUtc}/${event.endUtc}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** RFC 5545 escaping for TEXT values: backslash, semicolon, comma, newline. */
function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Content lines are limited to 75 octets, continued by a leading space. The
 * limit counts UTF-8 bytes, not characters, so measure encoded length and never
 * split inside a code point - the rose in the title is four bytes on its own.
 */
function foldLine(line: string) {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const out: string[] = [];
  let current = "";
  let bytes = 0;
  // A continuation line spends one octet on its leading space.
  let limit = 75;

  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > limit) {
      out.push(current);
      current = "";
      bytes = 0;
      limit = 74;
    }
    current += char;
    bytes += size;
  }
  if (current) out.push(current);

  return out.join("\r\n ");
}

export function buildIcs(event: CalendarEvent, now = new Date()) {
  const stamp = `${now.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ashuthosh.de//invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${event.startUtc}`,
    `DTEND:${event.endUtc}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // RFC 5545 requires CRLF between content lines.
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}
