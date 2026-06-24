TODO

Erro ao carregar leads.

---

 ✓ Compiled /leads in 551ms (1778 modules)
 GET /leads 200 in 756ms
 ⨯ Error [PrismaClientKnownRequestError]: 
Invalid `prisma.lead.count()` invocation:


The column `main.Lead.deletedAt` does not exist in the current database.
    at async getLeads (src/app/actions/leads.ts:100:26)
   98 |   };
   99 |
> 100 |   const [total, leads] = await Promise.all([
      |                          ^
  101 |     db.lead.count({ where }),
  102 |     db.lead.findMany({
  103 |       where, {
  code: 'P2022',
  meta: [Object],
  clientVersion: '6.19.3',
  digest: '978299050'
}
 POST /leads 500 in 680ms
 ⨯ Error [PrismaClientKnownRequestError]: 
Invalid `prisma.lead.count()` invocation:


The column `main.Lead.deletedAt` does not exist in the current database.
    at async getLeads (src/app/actions/leads.ts:100:26)
   98 |   };
   99 |
> 100 |   const [total, leads] = await Promise.all([
      |                          ^
  101 |     db.lead.count({ where }),
  102 |     db.lead.findMany({
  103 |       where, {
  code: 'P2022',
  meta: [Object],
  clientVersion: '6.19.3',
  digest: '978299050'
}
 POST /leads 500 in 496ms


---

Alem disso teve essa informação no GPT

---

Riscos restantes
- prisma migrate dev e prisma migrate deploy falharam neste ambiente com Schema engine error: sem detalhe adicional. A migration formal foi validada por SQL direto e seed em base temporária, então o ponto foi fechado, mas esse problema do engine continua aberto.
- Os blobs JSON polimórficos continuam como String no SQLite; a mitigação aqui foi tirar os campos críticos de consulta desse blob, especialmente externalId.
- O typecheck continua mais confiável quando executado em sequência após o build, por causa do comportamento já conhecido de .next/types.

---

E tambem ocorreu erro na tela de runs, onde eu fui buscar o lead no input.

---

 ✓ Compiled /runs in 2.2s (1806 modules)
 GET /runs 200 in 2433ms
 POST /runs 200 in 96ms
 POST /runs 200 in 24ms
 ⨯ Error [PrismaClientKnownRequestError]: 
Invalid `prisma.lead.findMany()` invocation:


The column `main.Lead.deletedAt` does not exist in the current database.
    at async searchLeads (src/app/actions/leads.ts:244:17)
  242 |   }
  243 |
> 244 |   const leads = await db.lead.findMany({
      |                 ^
  245 |     where: {
  246 |       deletedAt: null,
  247 |       OR: [ {
  code: 'P2022',
  meta: [Object],
  clientVersion: '6.19.3',
  digest: '2433096435'
}
 POST /runs 500 in 544ms

---

A mesma coisa ao usar a busca no topo do site:

---

 ✓ Compiled /settings/integrations in 650ms (1339 modules)
 GET /settings/integrations 200 in 815ms
 ⨯ Error [PrismaClientKnownRequestError]: 
Invalid `prisma.lead.findMany()` invocation:


The column `main.Lead.deletedAt` does not exist in the current database.
    at async searchLeads (src/app/actions/leads.ts:244:17)
  242 |   }
  243 |
> 244 |   const leads = await db.lead.findMany({
      |                 ^
  245 |     where: {
  246 |       deletedAt: null,
  247 |       OR: [ {
  code: 'P2022',
  meta: [Object],
  clientVersion: '6.19.3',
  digest: '4031945047'
}
 POST /settings/integrations 500 in 494ms
 POST /settings/integrations 200 in 49ms

 ---

Documentar todo aprendizado no padrão abaixo:

---

EXEMPLO:

### 4. Faltou criar a root page.tsx (WS-C deletou)
**O que aconteceu:** O WS-C deletou `src/app/page.tsx` original e o substituiu pelo `src/app/(dashboard)/page.tsx`. Isso causou conflito porque o layout raiz ainda esperava uma page na raiz.

**Por que deu errado:** Falta de coordenação entre workstreams sobre qual arquivo seria a "home page". O WS-A criou `src/app/page.tsx` como scaffold, e o WS-C a substituiu.

**O que foi feito para corrigir:** A integração (general-4) verificou e ajustou as rotas. O build passou porque o `(dashboard)/page.tsx` é servido como `/`.

**Lição:** Definir claramente no planejamento quem "possui" cada arquivo. Usar route groups `(dashboard)` já isola bem, mas a page raiz precisa de atenção.

---

