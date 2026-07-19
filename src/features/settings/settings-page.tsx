import { useEffect } from 'react'
import {
	Alert,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Switch,
	TextField,
	Typography,
} from '@mui/material'
import { Formik, Form, Field, FieldProps } from 'formik'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
	clearSaveStatus,
	loadSettings,
	saveSettings,
} from '../../store/settings-slice'
import { Settings } from '../../types'
import { settingsSchema } from './settings-schema'

export function SettingsPage () {
	const dispatch = useAppDispatch()
	const { data, status, error, saveStatus, saveError } = useAppSelector(
		(state) => state.settings,
	)

	useEffect(() => {
		if (saveStatus === 'succeeded') {
			const timer = window.setTimeout(() => {
				dispatch(clearSaveStatus())
			}, 2500)

			return () => window.clearTimeout(timer)
		}
	}, [dispatch, saveStatus])

	const handleRetry = () => {
		dispatch(loadSettings())
	}

	if (status === 'loading' || status === 'idle') {
		return (
			<Box display="flex" justifyContent="center" py={8}>
				<CircularProgress />
			</Box>
		)
	}

	if (status === 'failed' || !data) {
		return (
			<Stack spacing={2} alignItems="flex-start">
				<Alert severity="error">{error ?? 'Unable to load settings'}</Alert>
				<Button variant="outlined" onClick={handleRetry}>
					Retry
				</Button>
			</Stack>
		)
	}

	const handleSubmit = async (values: Settings) => {
		await dispatch(
			saveSettings({
				...values,
				maxTicketsPerOrder: Number(values.maxTicketsPerOrder),
			}),
		)
	}

	return (
		<Box>
			<Typography variant="h4" component="h1" gutterBottom>
				Settings
			</Typography>
			<Typography variant="body1" color="text.secondary" mb={3}>
				Configure how your ticketing experience behaves.
			</Typography>

			{saveStatus === 'succeeded' && (
				<Alert severity="success" sx={{ mb: 2 }}>
					Settings saved successfully.
				</Alert>
			)}

			{saveStatus === 'failed' && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{saveError}
				</Alert>
			)}

			<Formik
				initialValues={data}
				enableReinitialize
				validationSchema={settingsSchema}
				onSubmit={handleSubmit}
			>
				{({ values, errors, touched, isSubmitting, dirty, setFieldValue }) => (
					<Form>
						<Stack spacing={3} maxWidth={560}>
							<Field name="siteName">
								{({ field }: FieldProps) => (
									<TextField
										{...field}
										label="Site name"
										fullWidth
										error={Boolean(touched.siteName && errors.siteName)}
										helperText={touched.siteName && errors.siteName}
									/>
								)}
							</Field>

							<Field name="supportEmail">
								{({ field }: FieldProps) => (
									<TextField
										{...field}
										label="Support email"
										type="email"
										fullWidth
										error={Boolean(touched.supportEmail && errors.supportEmail)}
										helperText={touched.supportEmail && errors.supportEmail}
									/>
								)}
							</Field>

							<FormControl fullWidth>
								<InputLabel id="currency-label">Default currency</InputLabel>
								<Select
									labelId="currency-label"
									label="Default currency"
									value={values.defaultCurrency}
									onChange={(event) => {
										setFieldValue('defaultCurrency', event.target.value)
									}}
								>
									<MenuItem value="USD">USD</MenuItem>
									<MenuItem value="EUR">EUR</MenuItem>
									<MenuItem value="GBP">GBP</MenuItem>
								</Select>
							</FormControl>

							<Field name="timezone">
								{({ field }: FieldProps) => (
									<TextField
										{...field}
										label="Timezone"
										fullWidth
										placeholder="UTC"
										error={Boolean(touched.timezone && errors.timezone)}
										helperText={touched.timezone && errors.timezone}
									/>
								)}
							</Field>

							<Field name="maxTicketsPerOrder">
								{({ field }: FieldProps) => (
									<TextField
										{...field}
										label="Max tickets per order"
										type="number"
										fullWidth
										inputProps={{ min: 1 }}
										error={Boolean(
											touched.maxTicketsPerOrder && errors.maxTicketsPerOrder,
										)}
										helperText={
											touched.maxTicketsPerOrder && errors.maxTicketsPerOrder
										}
									/>
								)}
							</Field>

							<FormControlLabel
								control={
									<Switch
										checked={values.enableEmailNotifications}
										onChange={(event) => {
											setFieldValue(
												'enableEmailNotifications',
												event.target.checked,
											)
										}}
									/>
								}
								label="Enable email notifications"
							/>

							<Box>
								<Typography variant="subtitle1" gutterBottom>
									Payment methods
								</Typography>
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												checked={values.paymentMethods.cash}
												onChange={(event) => {
													setFieldValue(
														'paymentMethods.cash',
														event.target.checked,
													)
												}}
											/>
										}
										label="Cash"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={values.paymentMethods.creditCard}
												onChange={(event) => {
													setFieldValue(
														'paymentMethods.creditCard',
														event.target.checked,
													)
												}}
											/>
										}
										label="Credit card"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={values.paymentMethods.comp}
												onChange={(event) => {
													setFieldValue(
														'paymentMethods.comp',
														event.target.checked,
													)
												}}
											/>
										}
										label="Comp"
									/>
								</FormGroup>
							</Box>

							<Box>
								<Typography variant="subtitle1" gutterBottom>
									Ticket display
								</Typography>
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												checked={values.ticketDisplay.showAvailableCount}
												onChange={(event) => {
													setFieldValue(
														'ticketDisplay.showAvailableCount',
														event.target.checked,
													)
												}}
											/>
										}
										label="Show available ticket count"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={values.ticketDisplay.showSoldOut}
												onChange={(event) => {
													setFieldValue(
														'ticketDisplay.showSoldOut',
														event.target.checked,
													)
												}}
											/>
										}
										label="Show sold out badge"
									/>
								</FormGroup>
								{typeof errors.ticketDisplay === 'string' && (
									<FormHelperText error>{errors.ticketDisplay}</FormHelperText>
								)}
							</Box>

							<Box>
								<Button
									type="submit"
									variant="contained"
									disabled={
										!dirty || isSubmitting || saveStatus === 'loading'
									}
								>
									{saveStatus === 'loading' ? 'Saving…' : 'Save settings'}
								</Button>
							</Box>
						</Stack>
					</Form>
				)}
			</Formik>
		</Box>
	)
}
