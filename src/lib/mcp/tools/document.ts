import { BaseMCPTool } from "./base";
import { MCPToolDefinition, MCPToolResult, MCPToolOptions } from "../types";

export class GenerateDocumentTool extends BaseMCPTool {
  definition(): MCPToolDefinition {
    return {
      name: "document-generate",
      description: "Generate a document in Markdown/HTML format",
      inputSchema: {
        type: "object",
        properties: {
          template: { type: "string", description: "Document template type" },
          data: { type: "object", description: "Data to fill in the template" },
          format: { type: "string", enum: ["markdown", "html"], description: "Output format" },
        },
        required: ["template", "data"],
      },
    };
  }

  getOptions(): MCPToolOptions {
    return {
      maxRetries: 0,
      timeoutMs: 10000,
      requiredPermissions: [
        { action: "write", resource: "documents" },
      ],
    };
  }

  async execute(input: Record<string, unknown>): Promise<MCPToolResult> {
    const { template, data, format = "markdown" } = input as {
      template: string;
      data: Record<string, unknown>;
      format?: "markdown" | "html";
    };

    if (!template || !data) {
      return this.createErrorResult("Missing required fields: template, data");
    }

    const content = generateFromTemplate(template, data);

    if (format === "html") {
      const html = markdownToHtml(content);
      return this.createSuccessResult(
        JSON.stringify({
          documentId: `doc-${Date.now()}`,
          template,
          format: "html",
          content: html,
          isStub: true,
          message: "Document generated (stub implementation)",
        })
      );
    }

    return this.createSuccessResult(
      JSON.stringify({
        documentId: `doc-${Date.now()}`,
        template,
        format: "markdown",
        content,
        isStub: true,
        message: "Document generated (stub implementation)",
      })
    );
  }
}

function generateFromTemplate(
  template: string,
  data: Record<string, unknown>
): string {
  const templates: Record<string, (d: Record<string, unknown>) => string> = {
    proposal: (d) => `# Proposta Comercial

## Cliente
${d.companyName ?? "N/A"}

## Contato
${d.contactName ?? "N/A"} - ${d.contactEmail ?? "N/A"}

## Escopo
${d.scope ?? "A definir"}

## Valor
R$ ${d.value ?? "0,00"}

## Prazo
${d.deadline ?? "A definir"}

---
Documento gerado automaticamente pelo Orun.AI`,

    contract: (d) => `# Contrato

## Partes
 CONTRATANTE: ${d.clientName ?? "N/A"}
 CONTRATADO: ${d.providerName ?? "N/A"}

## Objeto
${d.object ?? "A definir"}

## Valor
R$ ${d.value ?? "0,00"}

## Vigência
${d.startDate ?? "N/A"} a ${d.endDate ?? "N/A"}

---
Documento gerado automaticamente pelo Orun.AI`,

    summary: (d) => `# Resumo

## Lead
${d.leadName ?? "N/A"}

## Empresa
${d.company ?? "N/A"}

## Status
${d.status ?? "N/A"}

## Próximos Passos
${d.nextSteps ?? "A definir"}

---
Documento gerado automaticamente pelo Orun.AI`,
  };

  const generator = templates[template] ?? templates.summary;
  return generator(data);
}

function markdownToHtml(markdown: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Documento Orun.AI</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #1a1a2e; }
    h2 { color: #16213e; border-bottom: 1px solid #eee; padding-bottom: 5px; }
    hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
  </style>
</head>
<body>
${markdown
  .split("\n")
  .map((line) => {
    if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
    if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
    if (line.startsWith("---")) return "<hr>";
    if (line.trim() === "") return "<br>";
    return `<p>${line}</p>`;
  })
  .join("\n")}
</body>
</html>`;
}

export class ReadDocumentTool extends BaseMCPTool {
  definition(): MCPToolDefinition {
    return {
      name: "document-read",
      description: "Read a document by ID (stub implementation)",
      inputSchema: {
        type: "object",
        properties: {
          documentId: { type: "string", description: "Document ID to read" },
        },
        required: ["documentId"],
      },
    };
  }

  async execute(input: Record<string, unknown>): Promise<MCPToolResult> {
    const { documentId } = input as { documentId: string };

    if (!documentId) {
      return this.createErrorResult("Missing required field: documentId");
    }

    return this.createSuccessResult(
      JSON.stringify({
        documentId,
        content: `Document ${documentId} content (stub)`,
        isStub: true,
        message: "Document read (stub implementation)",
      })
    );
  }
}
