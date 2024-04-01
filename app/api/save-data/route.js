import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function GET() {
	console.log('running')

	try {
		const auth = new google.auth.GoogleAuth({
			credentials: {
				client_email: 'sooryakant.kant@gmail.com',
				private_key: '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'.split(String.raw`\n`).join('\n'),
			},
			scopes: [
				'https://www.googleapis.com/auth/drive',
				'https://www.googleapis.com/auth/drive.file',
				'https://www.googleapis.com/auth/spreadsheets',
			],
		})

		const sheets = google.sheets({ version: 'v4', auth })

		// Dummy values for demonstration
		const spreadsheetId = '1L1aWMWYkqnV0TXe09ZswMO8R2ETvhgydrLJ6P6htyXs'
		const range = 'Sheet1!A2' // For example, appending to the next row in 'Sheet1', assuming 'A1' is headers
		const valueInputOption = 'USER_ENTERED'
		const values = [['Dummy data']] // Assuming you're writing a single cell here

		const response = await sheets.spreadsheets.values.append({
			spreadsheetId: spreadsheetId,
			range: range,
			valueInputOption: valueInputOption,
			requestBody: {
				values: values,
			},
		})

		console.log(`${response.data.updates.updatedCells} cells updated.`)

		return NextResponse.json({ message: 'success' })
	} catch (e) {
		console.log(e)
		return NextResponse.json({ message: 'some error occurred', error: e })
	}
}
