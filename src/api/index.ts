import { Event, Settings, Ticket } from '../types'

interface RawTicket {
	id: number
	event_id?: number
	eventId?: number
	type: string
	status: string
	price: number
	created_at?: string
	updated_at?: string
	createdAt?: string
	updatedAt?: string
}

interface RawEvent {
	id: number
	name: string
	date: string
	location: string
	description: string
	availableTickets?: RawTicket[]
	created_at?: string
	updated_at?: string
	createdAt?: string
	updatedAt?: string
}

export interface EventsQuery {
	page: number
	limit: number
	q?: string
}

export interface EventsPage {
	items: Event[]
	page: number
	limit: number
	total: number
	totalPages: number
	q?: string
}

interface RawEventsPage {
	items: RawEvent[]
	page: number
	limit: number
	total: number
	totalPages: number
	q?: string
}

function normalizeTicket (ticket: RawTicket): Ticket {
	return {
		id: ticket.id,
		eventId: ticket.eventId ?? ticket.event_id ?? 0,
		type: ticket.type,
		status: ticket.status,
		price: ticket.price,
		createdAt: ticket.createdAt ?? ticket.created_at ?? '',
		updatedAt: ticket.updatedAt ?? ticket.updated_at ?? '',
	}
}

function normalizeEvent (event: RawEvent): Event {
	return {
		id: event.id,
		name: event.name,
		date: event.date,
		location: event.location,
		description: event.description,
		availableTickets: (event.availableTickets ?? []).map(normalizeTicket),
		createdAt: event.createdAt ?? event.created_at ?? '',
		updatedAt: event.updatedAt ?? event.updated_at ?? '',
	}
}

async function parseJson <T>(response: Response): Promise<T> {
	if (!response.ok) {
		const message = await response.text()
		throw new Error(message || `Request failed with status ${response.status}`)
	}

	return response.json() as Promise<T>
}

export async function fetchEvents (query: EventsQuery): Promise<EventsPage> {
	const params = new URLSearchParams({
		page: String(query.page),
		limit: String(query.limit),
	})

	if (query.q?.trim()) {
		params.set('q', query.q.trim())
	}

	const response = await fetch(`/events?${params.toString()}`)
	const data = await parseJson<RawEventsPage>(response)

	return {
		items: data.items.map(normalizeEvent),
		page: data.page,
		limit: data.limit,
		total: data.total,
		totalPages: data.totalPages,
		q: data.q,
	}
}

export async function fetchSettings (): Promise<Settings> {
	const response = await fetch('/settings')
	return parseJson<Settings>(response)
}

export async function saveSettings (settings: Settings): Promise<Settings> {
	const response = await fetch('/settings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(settings),
	})

	return parseJson<Settings>(response)
}
