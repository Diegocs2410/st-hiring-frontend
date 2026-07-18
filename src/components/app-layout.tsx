import { SyntheticEvent, useState } from 'react'
import {
	AppBar,
	Box,
	Container,
	Tab,
	Tabs,
	Toolbar,
	Typography,
} from '@mui/material'
import { EventsPage } from '../features/events/events-page'
import { SettingsPage } from '../features/settings/settings-page'
import { useAppSelector } from '../store/hooks'

export function AppLayout () {
	const [tab, setTab] = useState(0)
	const siteName = useAppSelector(
		(state) => state.settings.data?.siteName ?? 'See Tickets',
	)

	const handleTabChange = (_event: SyntheticEvent, value: number) => {
		setTab(value)
	}

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
			<AppBar position="sticky" elevation={0}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						{siteName}
					</Typography>
				</Toolbar>
				<Tabs
					value={tab}
					onChange={handleTabChange}
					textColor="inherit"
					indicatorColor="secondary"
					sx={{ px: 2 }}
				>
					<Tab label="Events" />
					<Tab label="Settings" />
				</Tabs>
			</AppBar>

			<Container maxWidth="lg" sx={{ py: 4 }}>
				{tab === 0 ? <EventsPage /> : <SettingsPage />}
			</Container>
		</Box>
	)
}
