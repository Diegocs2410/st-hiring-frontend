import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchEvents } from '../api'
import { Event } from '../types'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export const DEFAULT_EVENTS_LIMIT = 12

interface EventsState {
	items: Event[]
	page: number
	limit: number
	total: number
	totalPages: number
	query: string
	status: RequestStatus
	error: string | null
}

const initialState: EventsState = {
	items: [],
	page: 1,
	limit: DEFAULT_EVENTS_LIMIT,
	total: 0,
	totalPages: 0,
	query: '',
	status: 'idle',
	error: null,
}

export const loadEvents = createAsyncThunk(
	'events/loadEvents',
	async (params: { page: number; limit: number; q: string }) => {
		return fetchEvents({
			page: params.page,
			limit: params.limit,
			q: params.q || undefined,
		})
	},
)

const eventsSlice = createSlice({
	name: 'events',
	initialState,
	reducers: {
		setEventsQuery (state, action: PayloadAction<string>) {
			state.query = action.payload
			state.page = 1
		},
		setEventsPage (state, action: PayloadAction<number>) {
			state.page = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadEvents.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(loadEvents.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.items = action.payload.items
				state.page = action.payload.page
				state.limit = action.payload.limit
				state.total = action.payload.total
				state.totalPages = action.payload.totalPages
			})
			.addCase(loadEvents.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message ?? 'Failed to load events'
			})
	},
})

export const { setEventsQuery, setEventsPage } = eventsSlice.actions
export default eventsSlice.reducer
