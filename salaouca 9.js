// Página de cadastramento de empresas de gás, onde donos podem postar fotos e valores de seus produtos

let empresasDeGas = [];

function criarElemento(tag, atributos = {}, ...filhos) {
    const el = document.createElement(tag);
    for (let chave in atributos) {
        if (chave === "class") {
            el.className = atributos[chave];
        } else if (chave === "src" || chave === "type" || chave === "value" || chave === "placeholder" || chave === "accept") {
            el.setAttribute(chave, atributos[chave]);
        } else {
            el[chave] = atributos[chave];
        }
    }
    filhos.forEach(filho => {
        if (typeof filho === "string") {
            el.appendChild(document.createTextNode(filho));
        } else if (filho) {
            el.appendChild(filho);
        }
    });
    return el;
}

function renderizarPaginaCadastro() {
    document.body.innerHTML = ""; // Limpa a página

    const container = criarElemento("div", { class: "container" });

    const titulo = criarElemento("h2", {}, "Cadastro de Empresa de Gás");
    container.appendChild(titulo);

    const formEmpresa = criarElemento("form", { id: "formEmpresa" });

    const inputNomeEmpresa = criarElemento("input", {
        type: "text",
        placeholder: "Nome da empresa",
        required: true,
        id: "nomeEmpresa"
    });

    formEmpresa.appendChild(inputNomeEmpresa);

    const produtosDiv = criarElemento("div", { id: "produtosDiv" });

    function adicionarProdutoForm() {
        const produtoDiv = criarElemento("div", { class: "produtoForm" });

        const inputNomeProduto = criarElemento("input", {
            type: "text",
            placeholder: "Nome do produto",
            required: true,
            class: "nomeProduto"
        });

        const inputPrecoProduto = criarElemento("input", {
            type: "number",
            placeholder: "Preço",
            required: true,
            min: 0,
            step: "0.01",
            class: "precoProduto"
        });

        const inputFotoProduto = criarElemento("input", {
            type: "file",
            accept: "image/*",
            required: true,
            class: "fotoProduto"
        });

        const btnRemover = criarElemento("button", { type: "button" }, "Remover");
        btnRemover.onclick = function () {
            produtoDiv.remove();
        };

        produtoDiv.appendChild(inputNomeProduto);
        produtoDiv.appendChild(inputPrecoProduto);
        produtoDiv.appendChild(inputFotoProduto);
        produtoDiv.appendChild(btnRemover);

        produtosDiv.appendChild(produtoDiv);
    }

    const btnAdicionarProduto = criarElemento("button", { type: "button" }, "Adicionar Produto");
    btnAdicionarProduto.onclick = function (e) {
        e.preventDefault();
        adicionarProdutoForm();
    };

    // Adiciona pelo menos um produto por padrão
    adicionarProdutoForm();

    formEmpresa.appendChild(produtosDiv);
    formEmpresa.appendChild(btnAdicionarProduto);

    const btnCadastrar = criarElemento("button", { type: "submit" }, "Cadastrar Empresa");
    formEmpresa.appendChild(btnCadastrar);

    formEmpresa.onsubmit = function (e) {
        e.preventDefault();
        const nomeEmpresa = inputNomeEmpresa.value.trim();
        if (!nomeEmpresa) {
            alert("Digite o nome da empresa.");
            return;
        }
        const produtos = [];
        const produtosForms = produtosDiv.querySelectorAll(".produtoForm");
        for (let produtoForm of produtosForms) {
            const nomeProduto = produtoForm.querySelector(".nomeProduto").value.trim();
            const precoProduto = produtoForm.querySelector(".precoProduto").value;
            const fotoInput = produtoForm.querySelector(".fotoProduto");
            if (!nomeProduto || !precoProduto || !fotoInput.files[0]) {
                alert("Preencha todos os campos do produto e selecione uma foto.");
                return;
            }
            const reader = new FileReader();
            reader.onload = function (event) {
                produtos.push({
                    nome: nomeProduto,
                    preco: parseFloat(precoProduto),
                    foto: event.target.result
                });
                if (produtos.length === produtosForms.length) {
                    empresasDeGas.push({
                        nome: nomeEmpresa,
                        produtos: produtos
                    });
                    alert("Empresa cadastrada com sucesso!");
                    renderizarEmpresas();
                }
            };
            reader.readAsDataURL(fotoInput.files[0]);
        }
    };

    container.appendChild(formEmpresa);

    document.body.appendChild(container);
}

function renderizarEmpresas() {
    document.body.innerHTML = ""; // Limpa a página

    const container = criarElemento("div", { class: "container" });
    const titulo = criarElemento("h2", {}, "Empresas de Gás Cadastradas");
    container.appendChild(titulo);

    if (empresasDeGas.length === 0) {
        container.appendChild(criarElemento("p", {}, "Nenhuma empresa cadastrada ainda."));
    } else {
        empresasDeGas.forEach(empresa => {
            const empresaDiv = criarElemento("div", { class: "empresa" });
            empresaDiv.appendChild(criarElemento("h3", {}, empresa.nome));
            empresa.produtos.forEach(produto => {
                const produtoDiv = criarElemento("div", { class: "produto" });
                produtoDiv.appendChild(criarElemento("strong", {}, produto.nome + " - R$ " + produto.preco.toFixed(2)));
                if (produto.foto) {
                    const img = criarElemento("img", { src: produto.foto, style: "max-width:100px;max-height:100px;" });
                    produtoDiv.appendChild(img);
                }
                empresaDiv.appendChild(produtoDiv);
            });
            container.appendChild(empresaDiv);
        });
    }

    const btnVoltar = criarElemento("button", {}, "Cadastrar nova empresa");
    btnVoltar.onclick = function () {
        renderizarPaginaCadastro();
    };
    container.appendChild(btnVoltar);

    document.body.appendChild(container);
}

// Inicializa a página de cadastro ao carregar
window.onload = function () {
    renderizarPaginaCadastro();
};

