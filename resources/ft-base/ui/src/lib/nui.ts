export function SendMessage (app: string, command: string, data?: any) {
	if (!data) {
		data = {};
	}
	return fetch(`https://ft-base/${app}:${command}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(data)
	});
}