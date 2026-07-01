// Banco de dados em memória inicializado com dados de exemplo
let professores = [
    { id: 1, nome: "Joice Seleme Mota", email: "joice.mota@ifc.edu.br", sala: "Bloco B - Sala 201" },
    { id: 2, nome: "Aujor Tadeu Andrade", email: "aujor.andrade@ifc.edu.br", sala: "Bloco A - Gabinete 05" }
];

// Variável de controle para identificar se é uma Edição ou Novo Cadastro
let idProfessorEmEdicao = null;

// Elementos do DOM
const modal = document.getElementById('modalProfessor');
const form = document.getElementById('professorForm');
const tbody = document.getElementById('tbodyProfessores');
const modalTitle = document.getElementById('modalTitle');

// Abre o modal configurado para NOVO CADASTRO
function abrirModalCadastro() {
    idProfessorEmEdicao = null;
    form.reset();
    modalTitle.textContent = "Adicionar Professor";
    modal.style.display = "flex"; // "flex" faz o alinhamento central funcionar
    document.getElementById('nome').focus();
}

// Fecha o modal limpando os estados
function fecharModal() {
    modal.style.display = "none";
    idProfessorEmEdicao = null;
    form.reset();
}

// Abre o modal configurado para EDIÇÃO, carregando os dados existentes
function prepararEdicao(id) {
    const professor = professores.find(p => p.id === id);
    if (professor) {
        idProfessorEmEdicao = id;
        modalTitle.textContent = "Editar Professor";
        
        // Preenche os campos do formulário
        document.getElementById('nome').value = professor.nome;
        document.getElementById('email').value = professor.email;
        document.getElementById('sala').value = professor.sala;
        
        // Abre o modal
        modal.style.display = "flex";
        document.getElementById('nome').focus();
    }
}

// Controla o envio do formulário (Tanto para Criar quanto para Editar)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const sala = document.getElementById('sala').value.trim();

    if (idProfessorEmEdicao !== null) {
        // Modo Edição: Altera o registro correspondente
        professores = professores.map(p => {
            if (p.id === idProfessorEmEdicao) {
                return { id: p.id, nome, email, sala };
            }
            return p;
        });
    } else {
        // Modo Cadastro: Insere um novo objeto
        const novoProf = {
            id: Date.now(),
            nome,
            email,
            sala
        };
        professores.push(novoProf);
    }

    atualizarTabela();
    fecharModal();
});

// Atualiza a listagem na tela
function atualizarTabela() {
    tbody.innerHTML = '';

    professores.forEach(prof => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prof.nome}</td>
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

// Exclui um professor
function excluirProfessor(id) {
    if (confirm("Deseja realmente excluir este professor?")) {
        professores = professores.filter(p => p.id !== id);
        atualizarTabela();
    }
}

// Fecha o modal se o usuário clicar no fundo escurecido (fora da caixa branca)
window.onclick = function(event) {
    if (event.target === modal) {
        fecharModal();
    }
}

// Inicializa a tabela na abertura da página
atualizarTabela();