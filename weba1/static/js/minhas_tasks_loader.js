// Função para carregar e exibir tasks na tabela
(function() {
    'use strict';
    
    // Variável para armazenar a task selecionada e deixa ela marcadda até que suma pela exesso de dados 
    let selectedTaskId = null;
    let selectedTaskData = null;
    
    // Função principal para carregar tasks
    function loadMinhasTasks() {
        console.log('[MinhasTasks] Iniciando carregamento...');
        
        fetch('/app/eletrica/a1pro/task-loader/')
            .then(response => {
                console.log('[MinhasTasks] Status da resposta:', response.status);
                if (!response.ok) {
                    throw new Error('Erro HTTP: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('[MinhasTasks] Dados recebidos:', data);
                const tbody1 = document.querySelector('#outras-tasks-table tbody');
                const tbody = document.querySelector('#minhas-tasks-table tbody');
                
                if (!tbody || !tbody1) {
                    console.error('[MinhasTasks] Tabela não encontrada!');
                    return;
                }
                
                // Limpa tabela principal
                tbody.innerHTML = '';
                
                // Limpa tabela de detalhes e mostra mensagem inicial
                tbody1.innerHTML = '<tr><td colspan="4" class="text-center">Clique em uma linha para ver detalhes</td></tr>';
                
                // Verifica se há tasks
                if (!data.tasks || data.tasks.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhuma task encontrada</td></tr>';
                    console.log('[MinhasTasks] Nenhuma task encontrada');
                    return;
                }
                
                // Função auxiliar para popular uma tabela
                function populateTable(tableBody, task) {
                    const row = tableBody.insertRow();
                    row.style.cursor = 'pointer';
                    
                    // Verifica se esta é a task selecionada e aplica destaque
                    if (selectedTaskId && task.task_id === selectedTaskId) {
                        row.style.backgroundColor = '#00000057';
                    }
                    
                    // Adiciona evento onclick na linha
                    row.addEventListener('click', function(e) {
                        // Verifica se o clique não foi no botão de download
                        if (!e.target.closest('.btn-success')) {
                            // Salva a task selecionada
                            selectedTaskId = task.task_id;
                            selectedTaskData = task;
                            
                            // Remove destaque de todas as linhas
                            const allRows = tableBody.querySelectorAll('tr');
                            allRows.forEach(r => {
                                r.style.backgroundColor = '';
                            });
                            
                            // Destaca a linha clicada
                            row.style.backgroundColor = '#00000057';
                            
                            showTaskDetails(task);
                        }
                    });
                    
                    // Coluna Status com badge colorido
                    const cellStatus = row.insertCell(0);
                    cellStatus.style.textAlign = 'center';
                    const statusBadge = getStatusBadge(task.status_raw, task.status);
                    const celltype1 = (task.type1);
                    cellStatus.innerHTML = `${statusBadge}<br><small>${celltype1}</small>`;
                    
                    // Coluna Tarefa
                    const cellName = row.insertCell(1);
                    cellName.textContent = task.name || '-';
                    cellName.style.textAlign = 'center';
                    
                    // Coluna Usuário
                    const cellUser = row.insertCell(2);
                    cellUser.textContent = task.user || '-';
                    cellUser.style.textAlign = 'center';

                    // Coluna Download
                    const cellDownload = row.insertCell(3);
                    cellDownload.style.textAlign = 'center';
                    
                    if (task.download_url && task.status_raw === 'SUCCESS') {
                        const btnDownload = document.createElement('a');
                        btnDownload.href = task.download_url;
                        btnDownload.className = 'btn btn-sm btn-success rounded-circle';
                        btnDownload.style.cssText = 'width:36px; height:36px; padding:0; display:inline-flex; align-items:center; justify-content:center;';
                        btnDownload.title = 'Download';
                        btnDownload.innerHTML = '<i class="fas fa-download"></i>';
                        btnDownload.download = '';
                        btnDownload.target = '_blank';
                        cellDownload.appendChild(btnDownload);
                    } else {
                        cellDownload.textContent = '-';
                    }
                }
                
                // Preenche apenas a tabela principal com dados
                data.tasks.forEach(task => {
                    populateTable(tbody, task);
                });
                
                // Se havia uma task selecionada, restaura os detalhes
                if (selectedTaskId && selectedTaskData) {
                    // Verifica se a task ainda existe nos dados atuais
                    const stillExists = data.tasks.some(task => task.task_id === selectedTaskId);
                    if (stillExists) {
                        // Encontra a task atualizada nos novos dados
                        const updatedTask = data.tasks.find(task => task.task_id === selectedTaskId);
                        if (updatedTask) {
                            // Atualiza os dados armazenados
                            selectedTaskData = updatedTask;
                            // Mostra os detalhes atualizados
                            showTaskDetails(updatedTask);
                        }
                    } else {
                        // Task não existe mais, limpa a seleção
                        selectedTaskId = null;
                        selectedTaskData = null;
                        tbody1.innerHTML = '<tr><td colspan="4" class="text-center">Clique em uma linha para ver detalhes</td></tr>';
                    }
                }
                
                console.log('[MinhasTasks] Tabelas atualizadas com', data.tasks.length, 'tasks');
            })
            .catch(error => {
                console.error('[MinhasTasks] Erro ao carregar tasks:', error);
                const tbody = document.querySelector('#minhas-tasks-table tbody');
                if (tbody) {
                    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Erro ao carregar tasks</td></tr>';
                }
            });
    }
    
    // Função auxiliar para gerar o badg eu peguei essa do stackoverflow de status
    function getStatusBadge(statusRaw, statusDisplay) {
        let badgeClass = 'badge badge-secondary';
        
        switch(statusRaw) {
            case 'SUCCESS':
                badgeClass = 'badge badge-success';
                break;
            case 'FAILURE':
                badgeClass = 'badge badge-danger';
                break;
            case 'STARTED':
                badgeClass = 'badge badge-primary';
                break;
            case 'PENDING':
                badgeClass = 'badge badge-warning';
                break;
            case 'REVOKED':
                badgeClass = 'badge badge-dark';
                break;
        }
        
        return `<span class="${badgeClass}">${statusDisplay || statusRaw}</span>`;
    }
    
    // Função para mostrar detalhe da task na segunda tabela
    function showTaskDetails(task) {
        console.log('[MinhasTasks] Mostrando detalhes da task:', task);
        
        const tbody1 = document.querySelector('#outras-tasks-table tbody');
        if (!tbody1) return;
        
        // Limpa a tabela de detalhes
        tbody1.innerHTML = '';
        
        // Adiciona linha com Task ID acredito
        const rowTaskId = tbody1.insertRow();
        const cellLabelTaskId = rowTaskId.insertCell(0);
        cellLabelTaskId.innerHTML = '<strong>Task ID:</strong>';
        cellLabelTaskId.colSpan = 1;
        cellLabelTaskId.style.textAlign = 'left';
        cellLabelTaskId.style.padding = '8px';
        
        const cellValueTaskId = rowTaskId.insertCell(1);
        cellValueTaskId.textContent = task.task_id || '-';
        cellValueTaskId.colSpan = 3;
        cellValueTaskId.style.textAlign = 'left';
        cellValueTaskId.style.padding = '8px';
        cellValueTaskId.style.fontFamily = 'monospace';
        cellValueTaskId.style.fontSize = '0.9em';
        
        // Adiciona linha com Created At
        const rowCreatedAt = tbody1.insertRow();
        const cellLabelCreated = rowCreatedAt.insertCell(0);
        cellLabelCreated.innerHTML = '<strong>Criado em:</strong>';
        cellLabelCreated.colSpan = 1;
        cellLabelCreated.style.textAlign = 'left';
        cellLabelCreated.style.padding = '8px';
        
        const cellValueCreated = rowCreatedAt.insertCell(1);
        cellValueCreated.textContent = task.created_at || '-';
        cellValueCreated.colSpan = 3;
        cellValueCreated.style.textAlign = 'left';
        cellValueCreated.style.padding = '8px';



        const rowduration = tbody1.insertRow();
        const cellLabelduration = rowduration.insertCell(0);
        cellLabelduration.innerHTML = '<strong>Duração:</strong>';
        cellLabelduration.colSpan = 1;
        cellLabelduration.style.textAlign = 'left';
        cellLabelduration.style.padding = '8px';
        
        const cellValueduration = rowduration.insertCell(1);
        cellValueduration.textContent = task.duration || '-';
        cellValueduration.colSpan = 3;
        cellValueduration.style.textAlign = 'left';
        cellValueduration.style.padding = '8px';


        const rowfinished_at = tbody1.insertRow();
        const cellLabelrowfinished_at = rowfinished_at.insertCell(0);
        cellLabelrowfinished_at.innerHTML = '<strong>Finalizado em:</strong>';
        cellLabelrowfinished_at.colSpan = 1;
        cellLabelrowfinished_at.style.textAlign = 'left';
        cellLabelrowfinished_at.style.padding = '8px';
        
        const cellValuerowfinished_at = rowfinished_at.insertCell(1);
        cellValuerowfinished_at.textContent = task.finished_at || '-';
        cellValuerowfinished_at.colSpan = 3;
        cellValuerowfinished_at.style.textAlign = 'left';
        cellValuerowfinished_at.style.padding = '8px';
        
        
        // Também envia a requisição ajax para o backend
        handleRowClick(task);
    }
    
    // Função para tratar clique na linha
    function handleRowClick(task) {
        console.log('[MinhasTasks] Linha clicada:', task);
        
        // Envia requisição AJAX
        fetch('/app/eletrica/a1pro/task-click/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                task_id: task.task_id,
                task_name: task.name,
                status: task.status_raw
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('[MinhasTasks] Resposta do clique:', data);
            // Aqui você pode adicionar lógica para exibir um modal, atualizar algo, etc
        })
        .catch(error => {
            console.error('[MinhasTasks] Erro ao processar clique:', error);
        });
    }
    
    // Função auxiliar para pegar o token base
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    // Inicializa quando documento estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            loadMinhasTasks();
            // Atualiza a cada 25 segundos
            setInterval(loadMinhasTasks, 2500);
        });
    } else {
        loadMinhasTasks();
        // Atualiza a cada 25 segundos
        setInterval(loadMinhasTasks, 2500);
    }
    
    // Expõe função global para reload
    window.reloadMinhasTasks = loadMinhasTasks;
    
})();
