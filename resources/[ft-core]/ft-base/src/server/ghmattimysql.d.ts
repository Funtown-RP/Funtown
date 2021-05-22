export declare namespace global.exports.ghmattimysql {
	export function execute(query: string, parameters?: object | Array<object>, callback?: Function): void;
	export function execute(query: string, callback?: Function): void;
	export function executeSync(query: string, parameters?: object | Array<object>): any;
}
