// Array que gerenciará o estado dos professores na aplicação
let professores = [];
let idProfessorEmEdicao = null;

// Elementos do DOM
const modal = document.getElementById('modalProfessor');
const form = document.getElementById('professorForm');
const tbody = document.getElementById('tbodyProfessores');
const modalTitle = document.getElementById('modalTitle');

// Carrega os dados assincronamente do arquivo .json
async function carregarProfessoresIniciais() {
    try {
        const resposta = await fetch('public/professores.json');
        if (!resposta.ok) {
            throw new Error('Erro ao carregar o arquivo JSON de professores.');
        }
        professores = await resposta.json();
        atualizarTabela();
    } catch (erro) {
        console.error('Falha na requisição:', erro);
        alert('Não foi possível carregar os professores iniciais automaticamente. Rode a aplicação em um servidor local (Live Server).');
    }
}

// Abre modal para cadastro
function abrirModalCadastro() {
    idProfessorEmEdicao = null;
    form.reset();
    modalTitle.textContent = "Adicionar Professor";
    modal.style.display = "flex";
    document.getElementById('nomeProfessor').focus();
}

// Fecha o modal
function fecharModal() {
    modal.style.display = "none";
    idProfessorEmEdicao = null;
    form.reset();
}

// Prepara e abre o modal em modo Edição
function prepararEdicao(id) {
    const professor = professores.find(p => p.id === id);
    if (professor) {
        idProfessorEmEdicao = id;
        modalTitle.textContent = "Editar Professor";
        
        document.getElementById('nome').value = professor.nomeProfessor;
        document.getElementById('email').value = professor.email;
        document.getElementById('sala').value = professor.sala;
        
        modal.style.display = "flex";
        document.getElementById('nome').focus();
    }
}

// Lida com a submissão do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const sala = document.getElementById('sala').value.trim();

    if (idProfessorEmEdicao !== null) {
        // Atualiza professor existente
        professores = professores.map(p => {
            if (p.id === idProfessorEmEdicao) {
                return { id: p.id, nome, email, sala };
            }
            return p;
        });
    } else {
        // Cria um novo professor
        const novoProf = {
            id: Date.now(),
            nomeProfessor,
            email,
            sala
        };
        professores.push(novoProf);
    }

    atualizarTabela();
    fecharModal();
});

// Renderiza as linhas na tabela
function atualizarTabela() {
    tbody.innerHTML = '';

    professores.forEach(prof => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prof.nomeProfessor}</td>
            <td>${prof.email}</td>
            <td>${prof.sala}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="prepararEdicao(${prof.id})">Editar</button>
                    <button class="btn-action btn-delete" onclick="excluirProfessor(${prof.id})">Excluir</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Exclui o professor selecionado
function excluirProfessor(id) {
    if (confirm("Deseja realmente excluir este professor?")) {
        professores = professores.filter(p => p.id !== id);
        atualizarTabela();
    }
}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target === modal) {
        fecharModal();
    }
}

// Dispara o carregamento dinâmico ao iniciar o sistema
carregarProfessoresIniciais();