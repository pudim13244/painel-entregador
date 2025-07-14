# 🚀 Guia de Deploy - QuickEntregadores

## 📋 Configuração de Ambiente

### Para Desenvolvimento
```bash
# Copie o arquivo de desenvolvimento
cp env.development .env.development

# Ou crie manualmente o arquivo .env.development
echo "VITE_API_URL=http://localhost:4000" > .env.development
```

### Para Produção
```bash
# Copie o arquivo de produção
cp env.production .env.production

# Ou crie manualmente o arquivo .env.production
echo "VITE_API_URL=https://api.vmagenciadigital.com/entregadoresquick/
```

## 🔧 Build para Produção

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Os arquivos de produção estarão na pasta dist/
```

## 🌐 Deploy

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente:
   - `VITE_API_URL`: `https://api.vmagenciadigital.com/entregadoresquick`
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `VITE_API_URL`: `https://api.vmagenciadigital.com/entregadoresquick`
3. Build command: `npm run build`
4. Output directory: `dist`

### GitHub Pages
1. Configure o workflow do GitHub Actions
2. Adicione as variáveis de ambiente no repositório
3. Deploy automático na branch main

## 🔗 URLs de Produção

- **Backend**: https://api.vmagenciadigital.com/entregadoresquick
- **Frontend**: (sua URL de deploy)

## 📱 PWA

O aplicativo está configurado como PWA (Progressive Web App) e inclui:
- ✅ Service Worker para cache offline
- ✅ Manifest para instalação
- ✅ Ícones em múltiplos tamanhos
- ✅ Atualização automática

## 🔒 Segurança

- ✅ HTTPS obrigatório em produção
- ✅ Tokens JWT para autenticação
- ✅ Interceptors para tratamento de erros
- ✅ Cache de API configurado

## 🐛 Debug

Para verificar se a API está funcionando:
```bash
curl https://api.vmagenciadigital.com/entregadoresquick
# Deve retornar: "Backend entregadoresquick rodando!"
``` 