// Array que gerenciará o estado dos cursos na aplicação
let cursos = [];
let idCursoEmEdicao = null;

// Elementos do DOM
const modal = document.getElementById('modalCurso');
const form = document.getElementById('cursoForm');
const tbody = document.getElementById('tbodyCursos');
const modalTitle = document.getElementById('modalTitle');

// FUNÇÃO CRUCIAL DA UNIDADE 3: Carrega os dados assincronamente do arquivo .json
async function carregarCursosIniciais() {
    try {
        const resposta = await fetch('public/cursos.json');
        if (!resposta.ok) {
            throw new Error('Erro ao carregar o arquivo JSON de cursos.');
        }
        cursos = await resposta.json();
        atualizarTabela();
    } catch (erro) {
        console.error('Falha na requisição:', erro);
        alert('Não foi possível carregar os cursos iniciais automaticamente. Rode a aplicação em um servidor local local (Live Server).');
    }
}

// Abre modal para cadastro
function abrirModalCadastro() {
    idCursoEmEdicao = null;
    form.reset();
    modalTitle.textContent = "Adicionar Curso";
    modal.style.display = "flex";
    document.getElementById('nome').focus();
}

// Fecha o modal
function fecharModal() {
    modal.style.display = "none";
    idProfessorEmEdicao = null;
    form.reset();
}

// Prepara e abre o modal em modo Edição
function prepararEdicao(id) {
    const curso = cursos.find(c => c.id === id);
    if (curso) {
        idCursoEmEdicao = id;
        modalTitle.textContent = "Editar Curso";
        
        document.getElementById('nome').value = curso.nome;
        document.getElementById('sigla').value = curso.sigla;
        document.getElementById('coordenador').value = curso.coordenador;
        document.getElementById('descricao').value = curso.descricao;
        
        modal.style.display = "flex";
        document.getElementById('nome').focus();
    }
}

// Lida com a submissão do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const sigla = document.getElementById('sigla').value.trim();
    const coordenador = document.getElementById('coordenador').value.trim();
    const descricao = document.getElementById('descricao').value.trim();

    if (idCursoEmEdicao !== null) {
        // Atualiza curso existente
        cursos = cursos.map(c => {
            if (c.id === idCursoEmEdicao) {
                return { id: c.id, nome, sigla, coordenador, descricao };
            }
            return c;
        });
    } else {
        // Cria um novo curso
        const novoCurso = {
            id: Date.now(),
            nome,
            sigla,
            coordenador,
            descricao
        };
        cursos.push(novoCurso);
    }

    atualizarTabela();
    fecharModal();
});

// Renderiza as linhas na tabela
function atualizarTabela() {
    tbody.innerHTML = '';

    cursos.forEach(curso => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${curso.nome}</td>
            <td>${curso.sigla}</td>
            <td>${curso.coordenador}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="prepararEdicao(${curso.id})">Editar</button>
                    <button class="btn-action btn-delete" onclick="excluirCurso(${curso.id})">Excluir</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Exclui o curso selecionado
function excluirCurso(id) {
    if (confirm("Deseja realmente excluir este curso?")) {
        cursos = cursos.filter(c => c.id !== id);
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
carregarCursosIniciais();