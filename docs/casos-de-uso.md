# Casos de Uso — Organiza+

Este documento cobre as funcionalidades obrigatórias do projeto, descritas a partir do comportamento real implementado no backend (`backend/controllers/*.php`). Cada caso de uso traz o ator, a pré-condição, o fluxo principal, os fluxos alternativos (erros tratados pelo sistema) e o resultado esperado.

## Perfis de usuário

- **Visitante**: não autenticado. Acessa páginas públicas, login, cadastro e recuperação de senha.
- **Usuário Autenticado**: logado com sessão válida. Gerencia suas próprias tarefas e sua conta.
- **Administrador**: usuário autenticado com `tipo_usuario = admin`. Além de tudo que o Usuário Autenticado faz, acessa o painel administrativo.

Diagrama geral dos atores e suas ações: `casos-de-uso.png`.

---

## UC01 — Cadastrar-se

**Ator:** Visitante
**Pré-condição:** não possuir conta com o email informado.

**Fluxo principal:**
1. O visitante acessa a tela de Cadastro e informa nome, email e senha.
2. O sistema valida os dados e verifica se o email já está em uso.
3. O sistema cria a conta com a senha criptografada (`password_hash`).
4. O sistema autentica o visitante automaticamente (login implícito) e devolve os dados do usuário.

**Fluxos alternativos:**
- Nome, email vazios ou senha com menos de 6 caracteres → erro 422 ("Preencha nome, email e uma senha com pelo menos 6 caracteres.").
- Email em formato inválido → erro 422 ("Email inválido.").
- Email já cadastrado → erro 409 ("Este email já está cadastrado.").

**Resultado:** conta criada e sessão autenticada iniciada, sem precisar de um segundo login.

---

## UC02 — Entrar (login)

**Ator:** Visitante
**Pré-condição:** possuir conta cadastrada e ativa.

**Fluxo principal:**
1. O visitante informa email e senha.
2. O sistema localiza o usuário pelo email e confere a senha com `password_verify`.
3. O sistema cria a sessão (com regeneração de ID de sessão) e gera um token CSRF.

**Fluxos alternativos:**
- Email não cadastrado, senha incorreta ou conta desativada (`ativo = 0`) → erro 401 com a mesma mensagem genérica ("Email ou senha inválidos."), para não revelar se o email existe.

**Resultado:** sessão autenticada criada; o usuário passa a acessar as telas restritas.

---

## UC03 — Recuperar senha

**Ator:** Visitante
**Pré-condição:** nenhuma (o sistema não exige que o email exista para responder).

**Fluxo principal:**
1. O visitante informa o email da conta.
2. O sistema sempre responde com a mesma mensagem ("Se este email estiver cadastrado, enviamos um link de redefinição."), exista ou não a conta, para não vazar quais emails estão cadastrados.
3. Caso o email exista, um token de redefinição é gerado e salvo em `recuperacoes_senha`, com validade determinada.

**Resultado:** token de redefinição disponível para uso no próximo passo (como o projeto não envia email de verdade, o token é devolvido na própria resposta para fins de demonstração).

---

## UC04 — Redefinir senha

**Ator:** Visitante, de posse do token gerado no UC03.
**Pré-condição:** token válido, não expirado e ainda não utilizado.

**Fluxo principal:**
1. O visitante informa o token e a nova senha.
2. O sistema valida o token (existe, não expirou, não foi usado) e o consome.
3. O sistema atualiza a senha do usuário correspondente.

**Fluxos alternativos:**
- Nova senha com menos de 6 caracteres → erro 422.
- Token inválido, expirado ou já usado → erro 400.

**Resultado:** senha atualizada; o token não pode mais ser reutilizado.

---

## UC05 — Criar tarefa

**Ator:** Usuário Autenticado
**Pré-condição:** sessão ativa.

**Fluxo principal:**
1. O usuário preenche título (obrigatório), descrição, prazo, prioridade e, opcionalmente, uma lista.
2. O sistema valida os dados e grava a tarefa vinculada ao usuário logado.

**Fluxos alternativos:**
- Título vazio → erro 422.
- Status enviado fora de `pendente`, `em_progresso` ou `concluida` → erro 422.

**Resultado:** nova tarefa criada e associada ao usuário (e à lista, se informada).

---

## UC06 — Visualizar tarefa

**Ator:** Usuário Autenticado
**Pré-condição:** a tarefa existir e pertencer ao próprio usuário.

**Fluxo principal:**
1. O usuário abre uma tarefa pelo identificador.
2. O sistema busca a tarefa filtrando sempre por `usuario_id`, isolando os dados entre contas.

**Fluxos alternativos:**
- Tarefa inexistente ou pertencente a outro usuário → erro 404 ("Tarefa não encontrada."), sem distinguir os dois casos por segurança.

**Resultado:** dados completos da tarefa exibidos.

---

## UC07 — Editar tarefa

**Ator:** Usuário Autenticado
**Pré-condição:** a tarefa existir e pertencer ao usuário.

**Fluxo principal:**
1. O usuário altera título, descrição, prazo, prioridade, status e/ou lista.
2. O sistema valida e atualiza os dados.
3. Se o novo status for "concluída" e a tarefa não estava concluída antes, uma notificação de conclusão é criada automaticamente.

**Fluxos alternativos:**
- Dados inválidos → erro 422, nas mesmas regras do UC05.
- Tarefa de outro usuário ou inexistente → erro 404.

**Resultado:** tarefa atualizada. Salvar os mesmos dados sem alterar nada também é considerado sucesso (correção aplicada para que o sistema não confunda "nenhuma mudança" com "não encontrada").

---

## UC08 — Excluir tarefa

**Ator:** Usuário Autenticado
**Pré-condição:** a tarefa existir e pertencer ao usuário.

**Fluxo principal:**
1. O usuário confirma a exclusão.
2. O sistema remove a tarefa do banco.

**Fluxos alternativos:**
- Tarefa de outro usuário ou inexistente → erro 404.

**Resultado:** tarefa removida permanentemente.

---

## UC09 — Concluir ou reabrir tarefa

**Ator:** Usuário Autenticado
**Pré-condição:** a tarefa existir e pertencer ao usuário.

**Fluxo principal:**
1. O usuário alterna o status entre "concluída" e um status em aberto.
2. O sistema registra a data de conclusão (`concluida_em`) quando aplicável.
3. Ao concluir uma tarefa que não estava concluída, uma notificação é criada.

**Resultado:** status atualizado e, quando for o caso, notificação registrada.

---

## UC10 — Editar perfil

**Ator:** Usuário Autenticado

**Fluxo principal:**
1. O usuário altera nome e/ou email.
2. O sistema valida o formato do email e verifica se já está em uso por outra conta.

**Fluxos alternativos:**
- Nome vazio ou email inválido → erro 422.
- Email já usado por outra conta → erro 409.

**Resultado:** dados do perfil atualizados.

---

## UC11 — Alterar senha

**Ator:** Usuário Autenticado

**Fluxo principal:**
1. O usuário informa a senha atual e a nova senha.
2. O sistema confere a senha atual e, se correta, grava a nova senha criptografada.

**Fluxos alternativos:**
- Senha atual incorreta → erro 401.
- Nova senha com menos de 6 caracteres → erro 422.

**Resultado:** senha alterada; é necessário usar a nova senha nos próximos logins.

---

## UC12 — Excluir conta

**Ator:** Usuário Autenticado

**Fluxo principal:**
1. O usuário confirma a exclusão da própria conta.
2. O sistema apaga o usuário, o que remove em cascata (via chave estrangeira) suas listas, tarefas, notificações e tokens de recuperação.
3. A sessão é encerrada.

**Resultado:** conta e todos os dados associados removidos definitivamente.

---

## UC13 — Sair (logout)

**Ator:** Usuário Autenticado

**Fluxo principal:**
1. O usuário solicita sair.
2. O sistema destrói a sessão no servidor.

**Resultado:** sessão encerrada; é preciso logar novamente para acessar áreas restritas.

---

## UC14 — Listar e buscar usuários

**Ator:** Administrador
**Pré-condição:** `tipo_usuario = admin`.

**Fluxo principal:**
1. O administrador abre o painel administrativo.
2. O sistema lista todos os usuários (nome, email, status) e permite filtrar por nome ou email.

**Fluxos alternativos:**
- Usuário autenticado sem privilégio de administrador tentando acessar → erro 403 ("Acesso restrito ao administrador.").

**Resultado:** lista de usuários exibida para o administrador.

---

## UC15 — Remover usuário

**Ator:** Administrador

**Fluxo principal:**
1. O administrador seleciona um usuário na lista e confirma a remoção.
2. O sistema exclui a conta (e seus dados em cascata, como no UC12).

**Fluxos alternativos:**
- Administrador tentando remover a própria conta por essa tela → erro 400 ("Você não pode remover sua própria conta de administrador por aqui.").
- Usuário sem privilégio de administrador → erro 403.

**Resultado:** conta do usuário selecionado removida.

---

## Regras transversais (valem para todos os casos de uso acima)

- Toda operação que grava ou apaga dado (POST, PUT, DELETE) exige um token CSRF válido, obtido em `GET /api/auth/csrf`.
- Toda consulta de tarefa, lista ou notificação é sempre filtrada pelo `usuario_id` da sessão: um usuário nunca enxerga ou altera dado de outro, exceto o administrador através do painel de usuários.
- A sessão é baseada em cookie `httponly`, o que impede acesso ao identificador de sessão via JavaScript no navegador.
