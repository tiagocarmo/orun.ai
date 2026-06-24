import { CheckAvailabilityTool, CreateEventTool } from "./calendar";
import { GenerateDocumentTool, ReadDocumentTool } from "./document";
import { MCPTool } from "../types";

export const calendarTools: MCPTool[] = [
  new CheckAvailabilityTool(),
  new CreateEventTool(),
];

export const documentTools: MCPTool[] = [
  new GenerateDocumentTool(),
  new ReadDocumentTool(),
];

export const allTools: MCPTool[] = [
  ...calendarTools,
  ...documentTools,
];

export { CheckAvailabilityTool, CreateEventTool } from "./calendar";
export { GenerateDocumentTool, ReadDocumentTool } from "./document";
