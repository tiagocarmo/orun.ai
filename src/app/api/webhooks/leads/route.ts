import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { agentRegistry } from "@/lib/agents";
import "@/lib/agents";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? "";

function verifySignature(body: string, signature: string | null): boolean {
  if (!signature || !WEBHOOK_SECRET) return false;

  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json(
      { success: false, error: "Invalid webhook signature" },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 422 }
    );
  }

  const leadAgent = agentRegistry.get("lead-intake");
  if (!leadAgent) {
    return NextResponse.json(
      { success: false, error: "Lead intake agent not available" },
      { status: 500 }
    );
  }

  const validation = leadAgent.validate(body);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: validation.errors },
      { status: 422 }
    );
  }

  const result = await leadAgent.execute(body, {
    agentId: "lead-intake",
    runId: "webhook",
    model: "webhook",
    temperature: 0,
    maxTokens: 0,
  });

  if (result.status === "failed") {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 422 }
    );
  }

  return NextResponse.json(
    { success: true, data: result.output },
    { status: 201 }
  );
}
