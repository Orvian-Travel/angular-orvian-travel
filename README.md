# Orvian Travel – Plataforma de Gestão de Viagens

Bem-vindo ao repositório do frontend da **Orvian Travel**, uma plataforma completa para gestão de pacotes de viagens, reservas, pagamentos e avaliações, desenvolvida em Angular. Este projeto foi criado durante o treinamento da Impacta, com foco em entregar uma solução real para a Avanade.

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Padrões e Boas Práticas](#padrões-e-boas-práticas)
- [Acessibilidade](#acessibilidade)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Visão Geral

O Orvian Travel é um sistema web para:

- Gerenciar pacotes de viagens (CRUD)
- Realizar reservas e pagamentos (cartão, PIX, boleto)
- Avaliar experiências de viagem
- Gerenciar usuários e permissões (admin, atendente, cliente)
- Chatbot com IA para dúvidas e sugestões

---

## Funcionalidades

- **Administração de Pacotes:** Cadastro, edição, exclusão e galeria de imagens.
- **Reservas:** Processo de reserva com múltiplos viajantes.
- **Pagamentos:** Integração com métodos de pagamento (cartão, PIX, boleto) e cálculo automático de taxas/descontos.
- **Avaliações:** Sistema de avaliações e carrossel de feedbacks.
- **Chatbot IA:** Assistente virtual integrado via Azure OpenAI.
- **Acessibilidade:** Suporte a VLibras e navegação acessível.
- **Dashboard:** Painel administrativo com gráficos e exportação de relatórios.

---

## Tecnologias Utilizadas

- [Angular v20](https://angular.io/)
- [Bootstrap 5](https://getbootstrap.com/)
- [RxJS](https://rxjs.dev/)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) (chatbot)
- [Chart.js](https://www.chartjs.org/) (gráficos)
- [VLibras](https://www.gov.br/governodigital/pt-br/vlibras) (acessibilidade)
- [SweetAlert2](https://sweetalert2.github.io/) (alertas)
- [Angular Material](https://material.angular.io/) (alguns componentes)

---

## Como Rodar o Projeto

1. **Pré-requisitos**
   - Node.js 18+
   - Angular CLI (`npm install -g @angular/cli`)

2. **Clone o repositório**
   ```bash
   git clone https://github.com/Orvian-Travel/angular-orvian-travel
   cd orvian-travel
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Configuração de ambiente**
   - Ajuste as variáveis de ambiente no `.env`  conforme necessário.
   - Para integração com Azure OpenAI, configure as chaves no backend.

5. **Rode o projeto**
   ```bash
   ng serve
   ```
   Acesse em [http://localhost:4200](http://localhost:4200)

---

## Estrutura de Pastas

```
src/
  app/
    pages/           # Páginas principais (admin, reservas, pagamento, etc)
    shared/          # Componentes reutilizáveis (header, footer, etc)
    chatbot/         # Componentes e serviços do chatbot IA
    services/        # Serviços de API e modelos
    guards/          # Guards de rota
    interceptors/    # Interceptadores HTTP
    styleTokens/     # Tokens de design (cores, fontes)
  assets/            # Imagens, ícones, scripts de ambiente
  styles.css         # Estilos globais
```

---

## Padrões e Boas Práticas

- **Angular Standalone Components**: Uso de componentes standalone para modularidade.
- **Services e Models**: Separação clara entre lógica de negócio e apresentação.
- **Responsividade**: Layout adaptado para desktop e mobile.
- **Acessibilidade**: Labels, navegação por teclado e VLibras.
- **Validação de Formulários**: Uso de Angular Forms e feedback visual.
- **Internacionalização**: Suporte a formatos brasileiros (datas, moeda).

---

## Acessibilidade

- Integração com [VLibras](https://www.gov.br/governodigital/pt-br/vlibras)
- Labels e placeholders descritivos

---

## Licença

Este projeto é privado e de uso interno para fins de treinamento e demonstração.  
Para uso comercial, consulte os responsáveis pelo projeto.

---

Desenvolvido com ❤️ pelos estagiários da Avanade, futuros Analistas Júniors.