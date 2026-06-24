import { vi } from "vitest";

function createMockFn() {
  return vi.fn();
}

export const mockDb = {
  lead: {
    findFirst: createMockFn(),
    findMany: createMockFn(),
    findUnique: createMockFn(),
    create: createMockFn(),
    update: createMockFn(),
    delete: createMockFn(),
    count: createMockFn(),
  },
  leadEvent: {
    create: createMockFn(),
  },
  agent: {
    findUnique: createMockFn(),
  },
  agentVersion: {
    findFirst: createMockFn(),
  },
  agentRun: {
    create: createMockFn(),
    update: createMockFn(),
    count: createMockFn(),
    findMany: createMockFn(),
    findUnique: createMockFn(),
  },
  agentLog: {
    create: createMockFn(),
  },
  integration: {
    findMany: createMockFn(),
    create: createMockFn(),
    update: createMockFn(),
    delete: createMockFn(),
  },
  workflow: {
    findUnique: createMockFn(),
    findMany: createMockFn(),
    create: createMockFn(),
    update: createMockFn(),
  },
  workflowRun: {
    findUnique: createMockFn(),
    findMany: createMockFn(),
    create: createMockFn(),
    update: createMockFn(),
  },
};

export function resetDbMocks() {
  for (const model of Object.values(mockDb)) {
    for (const method of Object.values(model)) {
      method.mockReset();
    }
  }
}
