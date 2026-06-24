"use server";

import { db } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  startWorkflow,
  pauseWorkflow,
  resumeWorkflow,
  cancelWorkflow,
  getWorkflowRun,
} from "@/lib/workflows/engine";
import { WorkflowRunResult } from "@/lib/workflows/types";
import { revalidatePath } from "next/cache";

export async function startWorkflowAction(
  workflowId: string,
  input: Record<string, unknown>
): Promise<ApiResponse<WorkflowRunResult>> {
  try {
    const result = await startWorkflow(workflowId, input);
    revalidatePath("/");
    revalidatePath("/workflows");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function pauseWorkflowAction(
  runId: string
): Promise<ApiResponse<{ paused: boolean }>> {
  try {
    await pauseWorkflow(runId);
    revalidatePath("/");
    return { success: true, data: { paused: true } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function resumeWorkflowAction(
  runId: string
): Promise<ApiResponse<WorkflowRunResult>> {
  try {
    const result = await resumeWorkflow(runId);
    revalidatePath("/");
    revalidatePath("/workflows");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function cancelWorkflowAction(
  runId: string
): Promise<ApiResponse<{ cancelled: boolean }>> {
  try {
    await cancelWorkflow(runId);
    revalidatePath("/");
    return { success: true, data: { cancelled: true } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getWorkflowRunAction(
  runId: string
): Promise<ApiResponse<WorkflowRunResult>> {
  try {
    const result = await getWorkflowRun(runId);
    if (!result) {
      return { success: false, error: `WorkflowRun '${runId}' not found` };
    }
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function listWorkflows(): Promise<
  ApiResponse<{ id: string; name: string; slug: string; description: string | null; isActive: boolean }[]>
> {
  try {
    const workflows = await db.workflow.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, description: true, isActive: true },
      orderBy: { name: "asc" },
    });
    return { success: true, data: workflows };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
