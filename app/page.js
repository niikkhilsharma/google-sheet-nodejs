import { google } from 'googleapis'

export default function Home() {
	async function saveData(formData) {
		'use server'
		const field = formData.get('field')
		const siteUrl = formData.get('siteUrl')

		// HERE, We are slicing because in google sheet in single block you can save only 50,000 characters max.
		const siteHtml = (await fetch(siteUrl).then(res => res.text())).slice(0, 49999)

		const auth = await google.auth.getClient({
			project_id: process.env.PROJECT_ID,
			credentials: {
				type: 'service_account',
				private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
				client_email: process.env.CLIENT_EMAIL,
				client_id: process.env.CLIENT_ID,
				token_url: 'https://oauth2.googleapis.com/token',
				universe_domain: 'googleapis.com',
			},
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		})
		const sheets = google.sheets({ version: 'v4', auth })

		const getGoogleSheetsData = async function () {
			const data = await sheets.spreadsheets.values.get({
				spreadsheetId: process.env.GOOGLE_SHEET_ID,
				range: `Sheet1!A:E`,
			})
			console.log(data.data.values)
		}

		async function writeGoogleSheet(sheetId) {
			const res = await sheets.spreadsheets.values.append({
				spreadsheetId: sheetId,
				range: `Sheet1!A:E`,
				valueInputOption: 'USER_ENTERED',
				insertDataOption: 'INSERT_ROWS',
				resource: {
					values: [[field, siteHtml]],
				},
			})
			console.log(res)
		}
		writeGoogleSheet(process.env.GOOGLE_SHEET_ID)

		// getGoogleSheetsData(process.env.GOOGLE_SHEET_ID)
	}

	return (
		<main>
			<form action={saveData}>
				<div>
					<label htmlFor="field">Field Name:</label>
					<input type="text" id="field" name="field" className="border border-black" />
				</div>
				<div>
					<label htmlFor="siteUrl">Site URL:</label>
					<input type="text" id="siteUrl" name="siteUrl" className="border border-black" />
				</div>
				<button type="submit" className="p-2 border border-black rounded-xl">
					Save data
				</button>
			</form>
		</main>
	)
}
