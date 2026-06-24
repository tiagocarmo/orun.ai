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
    groupBy: createMockFn(),
  },
  leadEvent: {
    create: createMockFn(),
    findMany: createMockFn(),
  },
  agent: {
    findUnique: createMockFn(),
    findMany: createMockFn(),
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
    groupBy: createMockFn(),
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
    count: createMockFn(),
  },
  workflowRun: {
    findUnique: createMockFn(),
    findMany: createMockFn(),
    create: createMockFn(),
    update: createMockFn(),
    count: createMockFn(),
  },
  document: {
    create: createMockFn(),
    findUnique: createMockFn(),
    findMany: createMockFn(),
    update: createMockFn(),
    delete: createMockFn(),
  },
  conversation: {
    count: createMockFn(),
    findMany: createMockFn(),
    findUnique: createMockFn(),
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
