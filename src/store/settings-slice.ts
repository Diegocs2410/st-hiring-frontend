import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchSettings, saveSettings as saveSettingsRequest } from '../api'
import { Settings } from '../types'
import type { RequestStatus } from './events-slice'

interface SettingsState {
	data: Settings | null
	status: RequestStatus
	saveStatus: RequestStatus
	error: string | null
	saveError: string | null
}

const initialState: SettingsState = {
	data: null,
	status: 'idle',
	saveStatus: 'idle',
	error: null,
	saveError: null,
}

export const loadSettings = createAsyncThunk(
	'settings/loadSettings',
	async () => fetchSettings(),
)

export const saveSettings = createAsyncThunk(
	'settings/saveSettings',
	async (settings: Settings) => saveSettingsRequest(settings),
)

const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		clearSaveStatus (state) {
			state.saveStatus = 'idle'
			state.saveError = null
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadSettings.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(loadSettings.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.data = action.payload
			})
			.addCase(loadSettings.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message ?? 'Failed to load settings'
			})
			.addCase(saveSettings.pending, (state) => {
				state.saveStatus = 'loading'
				state.saveError = null
			})
			.addCase(saveSettings.fulfilled, (state, action) => {
				state.saveStatus = 'succeeded'
				state.data = action.payload
			})
			.addCase(saveSettings.rejected, (state, action) => {
				state.saveStatus = 'failed'
				state.saveError = action.error.message ?? 'Failed to save settings'
			})
	},
})

export const { clearSaveStatus } = settingsSlice.actions
export default settingsSlice.reducer
