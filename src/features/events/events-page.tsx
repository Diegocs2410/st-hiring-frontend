import { useEffect, useState } from 'react'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Grid,
	Pagination,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
	loadEvents,
	setEventsPage,
	setEventsQuery,
} from '../../store/events-slice'
import { EventCard } from './event-card'

const SEARCH_DEBOUNCE_MS = 300

export function EventsPage () {
	const dispatch = useAppDispatch()
	const {
		items,
		status,
		error,
		page,
		limit,
		total,
		totalPages,
		query,
	} = useAppSelector((state) => state.events)
	const settings = useAppSelector((state) => state.settings.data)
	const [searchInput, setSearchInput] = useState(query)

	useEffect(() => {
		const timer = window.setTimeout(() => {
			if (searchInput !== query) {
				dispatch(setEventsQuery(searchInput))
			}
		}, SEARCH_DEBOUNCE_MS)

		return () => window.clearTimeout(timer)
	}, [dispatch, query, searchInput])

	useEffect(() => {
		dispatch(loadEvents({ page, limit, q: query }))
	}, [dispatch, page, limit, query])

	const handleRetry = () => {
		dispatch(loadEvents({ page, limit, q: query }))
	}

	const handlePageChange = (_event: unknown, nextPage: number) => {
		dispatch(setEventsPage(nextPage))
	}

	const showAvailableCount = settings?.ticketDisplay.showAvailableCount ?? true
	const showSoldOut = settings?.ticketDisplay.showSoldOut ?? true
	const currency = settings?.defaultCurrency ?? 'USD'
	const isInitialLoading = status === 'loading' && items.length === 0

	return (
		<Box>
			<Typography variant="h4" component="h1" gutterBottom>
				Events
			</Typography>
			<Typography variant="body1" color="text.secondary" mb={3}>
				Upcoming events from the See Tickets catalog.
			</Typography>

			<TextField
				value={searchInput}
				onChange={(event) => setSearchInput(event.target.value)}
				label="Search events"
				placeholder="Name, location, or description"
				fullWidth
				sx={{ mb: 3, maxWidth: 480 }}
			/>

			{status === 'failed' && (
				<Stack spacing={2} alignItems="flex-start" mb={3}>
					<Alert severity="error">{error}</Alert>
					<Button variant="outlined" onClick={handleRetry}>
						Retry
					</Button>
				</Stack>
			)}

			{isInitialLoading && (
				<Box display="flex" justifyContent="center" py={8}>
					<CircularProgress />
				</Box>
			)}

			{!isInitialLoading && status !== 'failed' && items.length === 0 && (
				<Alert severity="info">
					{query.trim()
						? `No events matched “${query.trim()}”.`
						: 'No events found. Seed the backend database and try again.'}
				</Alert>
			)}

			{items.length > 0 && (
				<>
					<Typography variant="body2" color="text.secondary" mb={2}>
						Showing {items.length} of {total} events
						{query.trim() ? ` for “${query.trim()}”` : ''}
					</Typography>

					<Grid container spacing={2} sx={{ opacity: status === 'loading' ? 0.6 : 1 }}>
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

					{totalPages > 1 && (
						<Box display="flex" justifyContent="center" mt={4}>
							<Pagination
								count={totalPages}
								page={page}
								onChange={handlePageChange}
								color="primary"
							/>
						</Box>
					)}
				</>
			)}
		</Box>
	)
}
