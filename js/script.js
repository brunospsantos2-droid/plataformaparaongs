/**
 * ARQUIVO: script.js
 * FUNÇÃO: Aplica máscaras de formatação a campos de input.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Função principal que aplica a máscara ao elemento.
     * @param {HTMLInputElement} input - O campo de input a ser mascarado.
     * @param {string} mask - O tipo de máscara a ser aplicada ('cpf', 'cep', 'telefone').
     */
    function applyMask(input, mask) {
        input.addEventListener('input', (event) => {
            let value = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

            if (mask === 'cpf') {
                value = formatCPF(value);
            } else if (mask === 'cep') {
                value = formatCEP(value);
            } else if (mask === 'telefone') {
                value = formatTelefone(value);
            }

            event.target.value = value;
        });
    }

    /**
     * Formata o valor para o padrão de CPF (999.999.999-99).
     */
    function formatCPF(value) {
        // Limita a 11 dígitos
        value = value.substring(0, 11);
        
        // Aplica a máscara
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        
        return value;
    }

    /**
     * Formata o valor para o padrão de CEP (99999-999).
     */
    function formatCEP(value) {
        // Limita a 8 dígitos
        value = value.substring(0, 8);
        
        // Aplica a máscara
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        
        return value;
    }

    /**
     * Formata o valor para o padrão de Telefone (Fixo e Celular) ((99) 99999-9999 ou (99) 9999-9999).
     */
    function formatTelefone(value) {
        // Limita a 11 dígitos
        value = value.substring(0, 11);
        
        // Aplica a máscara
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // (99) 9
        
        // Formato para 9 dígitos (Celular): (99) 99999-9999
        if (value.length > 13) {
            value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        } else {
            // Formato para 8 dígitos (Fixo): (99) 9999-9999
            value = value.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
        }
        
        return value;
    }

    // ===================================
    // 3. ENCONTRAR E APLICAR AS MÁSCARAS
    // ===================================

    // Seleciona todos os inputs que possuem o atributo 'data-mask'
    const maskedInputs = document.querySelectorAll('[data-mask]');

    maskedInputs.forEach(input => {
        const maskType = input.getAttribute('data-mask');
        applyMask(input, maskType);
    });
});
// ===================================
// 4. FUNCIONALIDADE DE SUBMISSÃO E LOG
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ... (Mantenha todo o código das máscaras aqui) ...
    // Certifique-se de que todo o código das máscaras está DENTRO deste bloco DOMContentLoaded!

    // Referências ao Formulário e Log
    const form = document.querySelector('.formulario-padrao');
    const cadastroLog = document.getElementById('cadastro-log');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            // 1. Impedir o envio padrão do formulário (que enviaria para 'processa-cadastro.php')
            event.preventDefault();
            
            // 2. Coletar os dados do formulário
            const formData = new FormData(form);
            const dados = Object.fromEntries(formData.entries());
            
            // 3. Simulação de Validação e Armazenamento
            // Neste ponto, em um projeto real, os dados seriam enviados a um servidor via AJAX.
            
            // Verificação básica de sucesso (se todos os campos requeridos passarem na validação nativa)
            if (form.checkValidity()) {
                
                // 4. Simulação de Log de Sucesso (Armazenamento temporário no navegador)
                
                // Crie um ID simulado para o voluntário
                const voluntarioId = Math.floor(Math.random() * 10000) + 1000;
                
                // "Salvar" o log de cadastro no LocalStorage para que o log persista
                const logMessage = {
                    id: voluntarioId,
                    data: new Date().toLocaleDateString('pt-BR'),
                    hora: new Date().toLocaleTimeString('pt-BR'),
                    projeto: 'Voluntário Cadastrado'
                };
                
                let logs = JSON.parse(localStorage.getItem('cadastroLogs')) || [];
                logs.push(logMessage);
                localStorage.setItem('cadastroLogs', JSON.stringify(logs));
                
                // 5. Exibir a mensagem de sucesso
                
                cadastroLog.innerHTML = `
                    <h3>✅ Cadastro Realizado com Sucesso!</h3>
                    <p>Obrigado pelo seu interesse em ajudar. Seu registro foi concluído.</p>
                    <p><strong>Log do Sistema (Voluntário):</strong></p>
                    <ul>
                        <li>**ID de Registro:** ${voluntarioId}</li>
                        <li>**Data/Hora:** ${logMessage.data} às ${logMessage.hora}</li>
                    </ul>
                    <p>Entraremos em contato via e-mail (**${dados.email}**) com as próximas etapas.</p>
                `;
                
                cadastroLog.style.display = 'block';
                form.reset(); // Limpa o formulário após o "envio"
                
                // Opcional: Rolar para o log
                cadastroLog.scrollIntoView({ behavior: 'smooth' });
                
            } else {
                // Se a validação nativa do HTML falhar, o navegador exibirá a mensagem padrão.
                alert('Por favor, preencha todos os campos obrigatórios e corrija os erros de formato.');
            }
        });
    }

    // Função para carregar logs anteriores (opcional, mostra se houveram envios anteriores)
    function loadLogs() {
        const logs = JSON.parse(localStorage.getItem('cadastroLogs')) || [];
        if (logs.length > 0) {
            cadastroLog.style.display = 'block';
            cadastroLog.innerHTML += '<h3>Histórico de Cadastros (Sessão)</h3>';
            
            logs.slice(-5).reverse().forEach(log => { // Mostra os últimos 5
                cadastroLog.innerHTML += `
                    <p><strong>Registro #${log.id}</strong> - ${log.projeto} em ${log.data} (${log.hora})</p>
                `;
            });
        }
    }

    loadLogs();
});