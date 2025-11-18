document.addEventListener('DOMContentLoaded', () => {

    // 1. SELETORES GERAIS
    const form = document.getElementById('cadastro-form');
    const cadastroLog = document.getElementById('cadastro-log');
    
    // Se a página for 'cadastro.html', carrega o log.
    if (cadastroLog) {
        carregarLogExistente();
        
        // Adiciona evento de submissão do formulário
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // 2. FUNÇÕES DE MÁSCARA (Requisito de Consistência de Dados)
    
    const inputCPF = document.getElementById('cpf');
    const inputCEP = document.getElementById('cep');
    const inputTelefone = document.getElementById('telefone');

    // Função genérica para aplicar máscara
    function aplicarMascara(input, mascara) {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            e.target.value = mascara(value);
        });
    }

    // Definição das máscaras
    const mascaraCPF = (value) => {
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const mascaraCEP = (value) => {
        return value.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const mascaraTelefone = (value) => {
        if (value.length > 10) {
            return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    };

    // Aplica as máscaras nos campos
    if (inputCPF) aplicarMascara(inputCPF, mascaraCPF);
    if (inputCEP) aplicarMascara(inputCEP, mascaraCEP);
    if (inputTelefone) aplicarMascara(inputTelefone, mascaraTelefone);

    
    // 3. FUNÇÃO DE SUBMISSÃO DO FORMULÁRIO (Eventos, DOM, LocalStorage, Templates JS)

    function handleFormSubmit(e) {
        e.preventDefault();

        // 3.1. Validação de Consistência e Alerta
        if (!form.checkValidity()) {
            alert("⚠️ Por favor, preencha todos os campos obrigatórios e verifique a consistência dos dados.");
            return;
        }

        // 3.2. Coleta de Dados
        const formData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            dataCadastro: new Date().toLocaleString()
        };

        // 3.3. Armazenamento Local (Simulação de Persistência)
        localStorage.setItem('cadastroData', JSON.stringify(formData));

        // 3.4. Geração do Log (Templates JS com document.createElement)
        
        // Limpa o conteúdo de "Nenhum log..."
        if (cadastroLog.querySelector('.log-message')) {
            cadastroLog.innerHTML = '';
        }

        const logItem = document.createElement('div');
        logItem.className = 'log-item success'; // Adiciona classe para estilização

        logItem.innerHTML = `
            <h3>✅ Cadastro Realizado com Sucesso!</h3>
            <p><strong>Nome:</strong> ${formData.nome}</p>
            <p><strong>E-mail:</strong> ${formData.email}</p>
            <p><strong>Data/Hora:</strong> ${formData.dataCadastro}</p>
            <p class="log-message">Os dados foram armazenados temporariamente no navegador.</p>
            <button class="btn-clear-log">Limpar Log</button>
        `;

        // Insere o novo template no topo do log (Manipulação do DOM)
        cadastroLog.prepend(logItem);
        
        // 3.5. Funcionalidade do Botão Limpar
        const clearButton = logItem.querySelector('.btn-clear-log');
        clearButton.addEventListener('click', () => {
            localStorage.removeItem('cadastroData');
            cadastroLog.innerHTML = '<p class="log-message">Nenhum log de cadastro.</p>';
        });

        // 3.6. Feedback e Limpeza
        alert("🎉 Cadastro efetuado com sucesso! Verifique o log.");
        form.reset();
    }


    // 4. FUNÇÃO PARA CARREGAR O LOG AO ABRIR A PÁGINA
    function carregarLogExistente() {
        const data = localStorage.getItem('cadastroData');
        
        if (data) {
            const formData = JSON.parse(data);
            
            // Reutiliza o mesmo template JS para carregar o item do localStorage
            const logItem = document.createElement('div');
            logItem.className = 'log-item success';

            logItem.innerHTML = `
                <h3>📝 Último Cadastro Encontrado</h3>
                <p><strong>Nome:</strong> ${formData.nome}</p>
                <p><strong>E-mail:</strong> ${formData.email}</p>
                <p><strong>Data/Hora:</strong> ${formData.dataCadastro}</p>
                <p class="log-message">Dados recuperados do LocalStorage.</p>
                <button class="btn-clear-log">Limpar Log</button>
            `;
            
            cadastroLog.innerHTML = ''; // Limpa a mensagem inicial
            cadastroLog.appendChild(logItem);

            const clearButton = logItem.querySelector('.btn-clear-log');
            clearButton.addEventListener('click', () => {
                localStorage.removeItem('cadastroData');
                cadastroLog.innerHTML = '<p class="log-message">Nenhum log de cadastro.</p>';
            });
            
        } else {
            cadastroLog.innerHTML = '<p class="log-message">Nenhum log de cadastro.</p>';
        }
    }
});