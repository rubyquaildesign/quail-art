/// <reference types="vite/client" />

declare module '*.wgsl?raw' {
	const code: string;
	export default code;
}
