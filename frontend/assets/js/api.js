window.OrganizaAPI = (function () {
    let csrfToken = null;

    async function obterCsrf() {
        if (csrfToken) {
            return csrfToken;
        }
        const resposta = await fetch('/api/auth/csrf', { credentials: 'include' });
        const dados = await resposta.json();
        csrfToken = dados.csrf_token;
        return csrfToken;
    }

    async function requisitar(metodo, caminho, corpo) {
        const opcoes = {
            method: metodo,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        };
        if (metodo !== 'GET') {
            opcoes.headers['X-CSRF-Token'] = await obterCsrf();
        }
        if (corpo !== undefined) {
            opcoes.body = JSON.stringify(corpo);
        }
        const resposta = await fetch('/api' + caminho, opcoes);
        const dados = await resposta.json().catch(function () { return {}; });
        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao comunicar com o servidor.');
        }
        return dados;
    }

    return {
        get: function (caminho) { return requisitar('GET', caminho); },
        post: function (caminho, corpo) { return requisitar('POST', caminho, corpo); },
        put: function (caminho, corpo) { return requisitar('PUT', caminho, corpo); },
        del: function (caminho) { return requisitar('DELETE', caminho); },
    };
})();
