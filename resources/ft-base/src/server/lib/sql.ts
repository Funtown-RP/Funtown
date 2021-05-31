/* eslint-disable @typescript-eslint/no-explicit-any */

const timeout = 500;

export function execute (query: string, parameters?: any | Array<any>, callback?: (result: any) => void): void {
	global.exports.ghmattimysql.execute(query, parameters, callback);
}

export async function executeSync (query: string, parameters?: any | Array<any>): Promise<any> {
	return PromiseTimeout(
		new Promise((resolve) => {
			global.exports.ghmattimysql.execute(query, parameters, (result: any) => { resolve(result); });
		}),
		timeout);
}

export function scalar (query: string, parameters?: any | Array<any>, callback?: (result: any) => void): void {
	global.exports.ghmattimysql.scalar(query, parameters, callback);
}

export async function scalarSync (query: string, parameters?: any | Array<any>): Promise<any> {
	return PromiseTimeout(
		new Promise((resolve) => {
			global.exports.ghmattimysql.scalar(query, parameters, (result: any) => { resolve(result); });
		}),
		timeout);
}

async function PromiseTimeout (promise: Promise<any>, ms: number): Promise<any> {
	return Promise.race([
		new Promise((_resolve, reject) => { const wait = setTimeout(() => { clearTimeout(wait); reject("timeout"); }, ms); }),
		promise
	]);
}

export interface ICache<T> {
	[key: string]: T;
}

export interface IMultipleCache<T> {
	[key: string]: T[];
}

function isEmpty (obj: any) {
	return Object.keys(obj).length === 0;
}


// How to use:
// 	const yourCache = new Cache<yourInterface>("table", "keyColumn"); <-- yourInterface is an interface that matches the columns of the database
// 	const row = await yourCache.get(value);  <-- put this in an async function
// 	you can also do: yourCache.get(value).then(...)
//
// If a row is changed:
//	You need to clear out the row in the cache so we get it from the database again
//	yourCache.changed(key)
export class Cache<T> {
	cache: ICache<T>;
	multipleCache: IMultipleCache<T>;
	query: string;

	constructor(table: string, keyColumn: string) {
		this.cache = {};
		this.multipleCache = {};
		this.query = `SELECT * FROM ${table} WHERE ${keyColumn} = ?`;
	}

	async get(key: string): Promise<T> {
		if (!this.cache[key]) {
			const value = await executeSync(this.query, [key]);
			if (!isEmpty(value) && !Array.isArray(value)) {
				this.cache[key] = value;
			} else if (Array.isArray(value)) {
				this.cache[key] = value[0];
			}
		}
		return this.cache[key];
	}

	async getMultiple(key: string): Promise<T[]> {
		if (!this.cache[key]) {
			const value = await executeSync(this.query, [key]);
			if (Array.isArray(value)) {
				this.multipleCache[key] = value;
			}
		}
		return this.multipleCache[key];
	}

	changed (key: string): void {
		delete this.cache[key];
	}
}

export class ArrayCache<T> {
	cache: IMultipleCache<T>;
	query: string;

	constructor(table: string, keyColumn: string) {
		this.cache = {};
		this.query = `SELECT * FROM ${table} WHERE ${keyColumn} = ?`;
	}

	async get(key: string): Promise<T[]> {
		if (!this.cache[key]) {
			const value = await executeSync(this.query, [key]);
			if (!isEmpty(value)) {
				this.cache[key] = value;
			}
		}
		return this.cache[key];
	}

	changed (key: string): void {
		delete this.cache[key];
	}
}

export class TableCache<T> {
	cache: Array<T>;
	query: string;
	isLoaded = false;

	constructor(table: string) {
		this.cache = [];
		this.query = `SELECT * FROM ${table}`;
		this.load();
	}

	rows(): Array<T> {
		return this.cache;
	}

	getRows = this.rows;

	async refresh(): Promise<void> {
		return this.load();
	}

	private async load(): Promise<void> {
		this.cache = [];
		this.cache = await executeSync(this.query);
		this.isLoaded = true;
		return;
	}
}