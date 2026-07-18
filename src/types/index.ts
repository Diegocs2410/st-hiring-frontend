export type Currency = 'USD' | 'EUR' | 'GBP'

export interface PaymentMethods {
	cash: boolean
	creditCard: boolean
	comp: boolean
}

export interface TicketDisplay {
	showAvailableCount: boolean
	showSoldOut: boolean
}

export interface Settings {
	siteName: string
	supportEmail: string
	defaultCurrency: Currency
	timezone: string
	enableEmailNotifications: boolean
	maxTicketsPerOrder: number
	paymentMethods: PaymentMethods
	ticketDisplay: TicketDisplay
}

export interface Ticket {
	id: number
	eventId: number
	type: string
	status: string
	price: number
	createdAt: string
	updatedAt: string
}

export interface Event {
	id: number
	name: string
	date: string
	location: string
	description: string
	availableTickets: Ticket[]
	createdAt: string
	updatedAt: string
}
