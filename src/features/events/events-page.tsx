import { useEffect } from 'react'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Grid,
	Stack,
	Typography,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loadEvents } from '../../store/events-slice'
import { EventCard } from './event-card'

export function EventsPage () {
	const dispatch = useAppDispatch()
	const { items, status, error } = useAppSelector((state) => state.events)
	const settings = useAppSelector((state) => state.settings.data)

	useEffect(() => {
		if (status === 'idle') {
			dispatch(loadEvents())
		}
	}, [dispatch, status])

	const handleRetry = () => {
		dispatch(loadEvents())
	}

	if (status === 'loading' || status === 'idle') {
		return (
			<Box display="flex" justifyContent="center" py={8}>
				<CircularProgress />
			</Box>
		)
	}

	if (status === 'failed') {
		return (
			<Stack spacing={2} alignItems="flex-start">
				<Alert severity="error">{error}</Alert>
				<Button variant="outlined" onClick={handleRetry}>
					Retry
				</Button>
			</Stack>
		)
	}

	if (items.length === 0) {
		return (
			<Alert severity="info">
				No events found. Seed the backend database and try again.
			</Alert>
		)
	}

	const showAvailableCount = settings?.ticketDisplay.showAvailableCount ?? true
	const showSoldOut = settings?.ticketDisplay.showSoldOut ?? true
	const currency = settings?.defaultCurrency ?? 'USD'

	return (
		<Box>
			<Typography variant="h4" component="h1" gutterBottom>
				Events
			</Typography>
			<Typography variant="body1" color="text.secondary" mb={3}>
				Upcoming events from the See Tickets catalog.
			</Typography>

			<Grid container spacing={2}>
				{items.map((event) => (
					<Grid item key={event.id} xs={12} sm={6} md={4}>
						<EventCard
							event={event}
							showAvailableCount={showAvailableCount}
							showSoldOut={showSoldOut}
							currency={currency}
						/>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}
