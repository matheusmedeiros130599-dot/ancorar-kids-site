# Ancorar Kids — Site (deploy-ready)

Este diretório contém os arquivos estáticos do site (página única com `index.html`). Instruções rápidas para publicar no Vercel:

1. Criar repositório Git local e commitar:

```bash
cd site
git init
git add .
git commit -m "Initial site files"
```

2. Criar um repositório no GitHub (manual) e conectar remoto:

```bash
git remote add origin git@github.com:SEU_USUARIO/NOME_DO_REPO.git
git push -u origin main
```

3. No Vercel: conectar o repositório GitHub e fazer deploy automático. Ou, usando a CLI:

```bash
npm i -g vercel
cd site
vercel login
vercel --prod
```

4. Variáveis para a gateway Black Cat: no painel do Vercel, vá em Settings → Environment Variables e adicione as chaves providas pela Black Cat (não comite-as no repositório).

5. Integração Black Cat: se a gateway exigir endpoints/webhooks, crie um pequeno backend ou use funções serverless no Vercel. Envie a documentação da Black Cat que eu adapto o endpoint.

Se quiser, eu crio o repositório local e faço o commit agora. Para push automático eu preciso que você me forneça um repositório remoto ou autorize criar um no seu GitHub.
