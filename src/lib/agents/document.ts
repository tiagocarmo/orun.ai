import { db } from "@/lib/db";
import { AbstractAgent } from "./base";
import { AgentDefinition, AgentContext, AgentExecuteResult } from "./types";
import { z } from "zod";

const documentInputSchema = z.object({
  leadId: z.string().min(1, "leadId is required"),
  templateType: z.enum(["proposal", "contract", "summary", "briefing"]),
  variables: z.record(z.unknown()).optional(),
  format: z.enum(["markdown", "html"]).default("markdown"),
});

export class DocumentAgent extends AbstractAgent {
  definition(): AgentDefinition {
    return {
      slug: "document",
      name: "Agente Documental",
      description: "Gera propostas, minutas e documentos comerciais",
    };
  }

  validate(input: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const result = documentInputSchema.safeParse(input);
    if (result.success) {
      return { valid: true };
    }
    const errors = Object.entries(result.error.flatten().fieldErrors).map(
      ([field, msgs]) => `${field}: ${msgs.join(", ")}`
    );
    return { valid: false, errors };
  }

  async execute(
    input: Record<string, unknown>,
    context: AgentContext
  ): Promise<AgentExecuteResult> {
    const validation = this.validate(input);
    if (!validation.valid) {
      return {
        status: "failed",
        error: `Validation failed: ${validation.errors?.join("; ")}`,
      };
    }

    const { leadId, templateType, variables, format } = documentInputSchema.parse(input);

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return {
        status: "failed",
        error: `Lead not found: ${leadId}`,
      };
    }

    const documentContent = generateDocument(templateType, lead, variables ?? {});
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    await db.document.create({
      data: {
        name: `${templateType}-${lead.name ?? "unknown"}`,
        type: templateType,
        content: documentContent,
        leadId,
      },
    });

    await db.leadEvent.create({
      data: {
        leadId,
        type: "document_generated",
        data: JSON.stringify({
          documentId,
          templateType,
          format,
          runId: context.runId,
          model: context.model,
        }),
      },
    });

    return {
      status: "completed",
      output: {
        leadId,
        documentId,
        documentUrl: `/documents/${documentId}`,
        templateType,
        format,
        content: documentContent,
        message: `Document generated: ${templateType}`,
      },
    };
  }
}

function generateDocument(
  templateType: string,
  lead: { name: string | null; email: string | null; company: string | null; phone: string | null },
  variables: Record<string, unknown>
): string {
  const templates: Record<string, (data: Record<string, unknown>) => string> = {
    proposal: (vars) => `# Proposta Comercial

## Cliente
${lead.company ?? "N/A"}

## Contato
${lead.name ?? "N/A"} - ${lead.email ?? "N/A"}

## Escopo
${vars.scope ?? "A definir"}

## Valor
R$ ${vars.value ?? "0,00"}

## Prazo
${vars.deadline ?? "A definir"}

---
Documento gerado automaticamente pelo Orun.AI`,

    contract: (vars) => `# Contrato

## Partes
CONTRATANTE: ${vars.clientName ?? lead.company ?? "N/A"}
CONTRATADO: ${vars.providerName ?? "Orun.AI"}

## Objeto
${vars.object ?? "A definir"}

## Valor
R$ ${vars.value ?? "0,00"}

## Vigência
${vars.startDate ?? "N/A"} a ${vars.endDate ?? "N/A"}

---
Documento gerado automaticamente pelo Orun.AI`,

    summary: () => `# Resumo do Lead

## Informações
- Nome: ${lead.name ?? "N/A"}
- Email: ${lead.email ?? "N/A"}
- Empresa: ${lead.company ?? "N/A"}

## Status
Lead qualificado e pronto para próxima ação.

---
Documento gerado automaticamente pelo Orun.AI`,

    briefing: (vars) => `# Briefing de Reunião

## Participantes
- Lead: ${lead.name ?? "N/A"} (${lead.company ?? "N/A"})
- Equipe: ${vars.team ?? "A definir"}

## Pauta
${vars.agenda ?? "A definir"}

## Objetivos
${vars.objectives ?? "A definir"}

---
Documento gerado automaticamente pelo Orun.AI`,
  };

  const generator = templates[templateType] ?? templates.summary;
  return generator(variables);
}
