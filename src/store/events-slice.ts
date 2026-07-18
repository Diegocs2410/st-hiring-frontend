import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchEvents } from '../api'
import { Event } from '../types'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface EventsState {
	items: Event[]
	status: RequestStatus
	error: string | null
}

const initialState: EventsState = {
	items: [],
	status: 'idle',
	error: null,
}

export const loadEvents = createAsyncThunk(
	'events/loadEvents',
	async () => fetchEvents(),
)

const eventsSlice = createSlice({
	name: 'events',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadEvents.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(loadEvents.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.items = action.payload
			})
			.addCase(loadEvents.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message ?? 'Failed to load events'
			})
	},
})

export default eventsSlice.reducer
