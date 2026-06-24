import { vi } from "vitest";

export const executeAgentMock = vi.fn();
export const validateAgentInputMock = vi.fn();
export const getAgentMock = vi.fn();

export function resetAgentRuntimeMocks() {
  executeAgentMock.mockReset();
  validateAgentInputMock.mockReset();
  getAgentMock.mockReset();
}
