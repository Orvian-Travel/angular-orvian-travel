# Footer Component - Orvian Travel

## 📄 Descrição
Componente de rodapé criado para a página de pacotes e outras páginas do site, contendo:
- Logo da empresa (versão branca)
- Copyright dinâmico (ano atual)
- Informações de contato
- Links úteis
- Design responsivo

## 🎯 Onde está sendo usado
- ✅ Página Home (lista de pacotes): `src/app/pages/home/home/home.html`

## 🔧 Como usar em outras páginas

### 1. Importar o componente:
```typescript
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-sua-pagina',
  imports: [FooterComponent], // Adicione aqui
  templateUrl: './sua-pagina.html',
  styleUrl: './sua-pagina.css'
})
```

### 2. Adicionar no template:
```html
<div class="page-content">
  <!-- Seu conteúdo aqui -->
</div>
<app-footer></app-footer>
```

### 3. Ajustar CSS da página (opcional):
```css
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex-grow: 1;
}

app-footer {
  margin-top: auto;
}
```

## 🎨 Personalização

### Alterar cores:
Edite `footer.component.css`:
```css
.footer {
  background: linear-gradient(135deg, #sua-cor-1 0%, #sua-cor-2 100%);
}

.footer-info h3,
.footer-links h4,
.footer-contact h4 {
  color: #sua-cor-destaque;
}
```

### Alterar logo:
Substitua o arquivo em `public/assets/logo-branca.svg` ou altere o caminho em `footer.component.html`.

### Adicionar redes sociais:
```html
<div class="footer-social">
  <h4>Redes Sociais</h4>
  <a href="#" class="social-link">Facebook</a>
  <a href="#" class="social-link">Instagram</a>
</div>
```

## 📱 Responsividade
- ✅ Desktop: Layout em grid com 4 colunas
- ✅ Tablet: Layout adaptado automaticamente
- ✅ Mobile: Layout em coluna única, centralizado

## 🔄 Ano automático
O copyright é atualizado automaticamente com o ano atual através do TypeScript:
```typescript
currentYear = new Date().getFullYear();
```
