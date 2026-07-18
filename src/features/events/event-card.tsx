import {
	Card,
	CardContent,
	Chip,
	Stack,
	Typography,
} from '@mui/material'
import { Event } from '../../types'

interface EventCardProps {
	event: Event
	showAvailableCount: boolean
	showSoldOut: boolean
	currency: string
}

function formatDate (value: string) {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) {
		return value
	}

	return new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(date)
}

function formatPrice (cents: number, currency: string) {
	return new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency,
	}).format(cents / 100)
}

export function EventCard ({
	event,
	showAvailableCount,
	showSoldOut,
	currency,
}: EventCardProps) {
	const availableCount = event.availableTickets.length
	const isSoldOut = availableCount === 0
	const lowestPrice = event.availableTickets.reduce<number | null>((min, ticket) => {
		if (min === null || ticket.price < min) {
			return ticket.price
		}
		return min
	}, null)

	return (
		<Card variant="outlined" sx={{ height: '100%' }}>
			<CardContent>
				<Stack spacing={1.5}>
					<Typography variant="h6" component="h2">
						{event.name}
					</Typography>

					<Typography variant="body2" color="text.secondary">
						{formatDate(event.date)}
					</Typography>

					<Typography variant="body2" color="text.secondary">
						{event.location || 'Location TBA'}
					</Typography>

					<Typography variant="body1">
						{event.description}
					</Typography>

					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
						{showAvailableCount && (
							<Chip
								size="small"
								label={`${availableCount} available`}
								color={isSoldOut ? 'default' : 'success'}
							/>
						)}
						{showSoldOut && isSoldOut && (
							<Chip size="small" label="Sold out" color="error" />
						)}
						{lowestPrice !== null && (
							<Chip
								size="small"
								label={`From ${formatPrice(lowestPrice, currency)}`}
								variant="outlined"
							/>
						)}
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	)
}
