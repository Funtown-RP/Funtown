const timeout = 500;

export function execute (query: string, parameters?: any | Array<any>, callback?: (result: any) => void): void {
	global.exports.ghmattimysql.execute(query, parameters, callback);
}

export async function executeSync (query: string, parameters?: any | Array<any>): Promise<any> {
	return Promise.race([
		new Promise((_resolve, reject) => { const wait = setTimeout(() => { clearTimeout(wait); reject("timeout"); }, timeout) }),
		new Promise((resolve) => {
			global.exports.ghmattimysql.execute(query, parameters, (result) => { resolve(result); });
		})
	]);
}

export function scalar (query: string, parameters?: any | Array<any>, callback?: (result: any) => void): void {
	global.exports.ghmattimysql.scalar(query, parameters, callback);
}

export async function scalarSync (query: string, parameters?: any | Array<any>): Promise<any> {
	return Promise.race([
		new Promise((_resolve, reject) => { const wait = setTimeout(() => { clearTimeout(wait); reject("timeout"); }, timeout) }),
		new Promise((resolve) => {
			global.exports.ghmattimysql.scalar(query, parameters, (result) => { resolve(result) });
		})
	]);
}

export interface ICache<T> {
	[key: string]: T;
}

function isEmpty (obj) {
	return Object.keys(obj).length === 0;
}

export class Cache<T> {
	cache: ICache<T>;
	query: string;

	constructor(selectQuery: string) {
		this.cache = {};
		this.query = selectQuery;
	}

	async get (key: string): Promise<T> {
		if (!this.cache[key]) {
			const value = await executeSync(this.query, [key]);
			if (!isEmpty(value)) {
				this.cache[key] = value;
			}
		}
		return this.cache[key];
	}

	changed (key: string): void {
		this.cache[key] = null;
	}
}