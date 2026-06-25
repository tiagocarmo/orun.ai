# Summary

Foram adicionadas regras objetivas para chamadas de agentes e tools com schema estrito, deixando explicito que:

- `operation` deve respeitar o tipo exigido;
- chaves extras como `timeout_ms` e `context` nao podem ser enviadas sem suporte no contrato;
- falhas desse tipo devem ser tratadas como erro de invocacao, com releitura do schema antes de reenviar.
