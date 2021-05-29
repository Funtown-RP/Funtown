const webpack = require("webpack");
const path = require("path");
const RemovePlugin = require("remove-files-webpack-plugin");
const WebpackGlobEntriesPlugin = require("webpack-glob-entries-plugin");

const serverFolder = new WebpackGlobEntriesPlugin("src/server/*.ts");
const clientFolder = new WebpackGlobEntriesPlugin("src/client/*.ts");

const buildPath = path.resolve(__dirname, "dist");
const contextPath = path.resolve(__dirname, "src");

const server = {
	context: contextPath,
	entry: serverFolder.entries(),
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ["ts-loader", "eslint-loader"],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({ "global.GENTLY": false }),
		new RemovePlugin({
			before: {include: [path.resolve(buildPath, "server")],},
			watch: {include: [path.resolve(buildPath, "server")],},
		}),
	],
	optimization: {minimize: true,},
	resolve: {extensions: [".tsx", ".ts", ".js"],},
	output: {
		filename: "[contenthash].server.js",
		path: path.resolve(buildPath, "server"),
	},
	target: "node",
};

const client = {
	context: contextPath,
	entry: clientFolder.entries(),
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ["ts-loader", "eslint-loader"],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new RemovePlugin({
			before: {include: [path.resolve(buildPath, "client")],},
			watch: {include: [path.resolve(buildPath, "client")],},
		}),
	],
	optimization: {minimize: true,},
	resolve: {extensions: [".tsx", ".ts", ".js"],},
	output: {
		filename: "[contenthash].client.js",
		path: path.resolve(buildPath, "client"),
	},
};

module.exports = [server, client];
