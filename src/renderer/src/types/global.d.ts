import { ProcessHandler } from "./EventHandler";

declare global {
	interface Window {
		ProcessHandler: ProcessHandler;
	}
}
