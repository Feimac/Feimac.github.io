// Aguarda o conteúdo da página carregar completamente
window.addEventListener('DOMContentLoaded', () => {

    // Seleciona todas as seções que têm um ID e todos os links de navegação
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    // Função que será executada ao rolar a página
    const onScroll = () => {
        const scrollY = window.scrollY;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 80;
            const sectionId = current.getAttribute('id');

            // Verifica se o link de navegação correspondente existe antes de tentar acessá-lo
            const navLink = document.querySelector(`nav a[href*=${sectionId}]`);
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active-link');
                } else {
                    navLink.classList.remove('active-link');
                }
            }
        });
    };

    window.addEventListener('scroll', onScroll);

    // MENU RESPONSIVO (hambúrguer)
    const toggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");
    if (toggle && navMenu) {
        toggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
        });
    }

    // Criar grafo responsivo
    createGraph();
    window.addEventListener("resize", createGraph);
});

// ----------------- GRAFO DE CONTATOS (D3) -----------------
const contatos = {
    nodes: [
        { id: "Felipe", group: 1 },
        { id: "GitHub", group: 2, url: "https://github.com/Feimac" },
        { id: "LinkedIn", group: 2, url: "https://www.linkedin.com/in/felipe-snitynski-camillo-07b09a1b1/" },
        { id: "Email", group: 2, url: "mailto:felipescamillo2018@gmail.com" }
    ],
    links: [
        { source: "Felipe", target: "GitHub" },
        { source: "Felipe", target: "LinkedIn" },
        { source: "Felipe", target: "Email" }
    ]
};

function createGraph() {
    const container = document.getElementById("grafico-contatos");
    if (!container) return;

    // Limpa SVG anterior (para evitar duplicação ao redimensionar)
    d3.select("#grafico-contatos").select("svg").remove();

    const width = container.offsetWidth;
    const height = 400;

    const svg = d3.select("#grafico-contatos").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

    const simulation = d3.forceSimulation(contatos.nodes)
        .force("link", d3.forceLink(contatos.links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2));

    // Cria as linhas (links)
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(contatos.links)
        .join("line")
        .attr("stroke-width", 2);

    // Cria os nós
    const nodeGroup = svg.append("g")
        .selectAll("g")
        .data(contatos.nodes)
        .join("g")
        .style("cursor", "pointer")
        .on("click", (event, d) => { if (d.url) window.open(d.url, "_blank"); })
        .on("mouseover", function() {
            d3.select(this).select("circle").transition().duration(200).attr("r", 35);
            d3.select(this).select("foreignObject").transition().duration(200)
                .attr("width", 40).attr("height", 40).attr("x", -20).attr("y", -20);
        })
        .on("mouseout", function() {
            d3.select(this).select("circle").transition().duration(200).attr("r", 30);
            d3.select(this).select("foreignObject").transition().duration(200)
                .attr("width", 30).attr("height", 30).attr("x", -15).attr("y", -15);
        })
        .call(d3.drag()
            .on("start", (event, d) => dragstarted(event, d, simulation))
            .on("drag", dragged)
            .on("end", (event, d) => dragended(event, d, simulation))
        );

    // Círculos de fundo dos nós
    nodeGroup.append("circle")
        .attr("r", 30)
        .attr("fill", d => d.group === 1 ? "#1a73e8" : "#ff9800");

    // Ícones Font Awesome usando foreignObject
    nodeGroup.append("foreignObject")
        .attr("x", -15)
        .attr("y", -15)
        .attr("width", 30)
        .attr("height", 30)
        .html(d => `
            <i class="${
                d.id === 'GitHub' ? 'fa-brands fa-github' :
                d.id === 'LinkedIn' ? 'fa-brands fa-linkedin' :
                d.id === 'Email' ? 'fa-solid fa-envelope' :
                'fa-solid fa-user'
            }" 
            style="font-size:24px;color:white;display:flex;justify-content:center;align-items:center;width:100%;height:100%;"></i>
        `);

    // Texto abaixo do nó
    nodeGroup.append("text")
        .text(d => d.id)
        .attr("font-size", 16)
        .attr("dy", 50)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--text)");

    // Atualiza posições dinamicamente
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });
}

// Funções de arrasto
function dragstarted(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Agora sim vem a função de animação
function animacaoDeDigitacao() {
    const elementoTitulo = document.getElementById("titulo-animado");
    if (!elementoTitulo) return;

    const textoCorreto = "Olá, meu nome é Felipe";
    const textoErrado = "Olá, meu nome é Felpw";
    const velocidadeDigitacao = 150;
    const velocidadeApagar = 100;
    const tempoPausa = 1000;

    elementoTitulo.classList.add("cursor-piscando");

    function digitar(texto, callback) {
        let i = 0;
        const intervalo = setInterval(() => {
            elementoTitulo.innerHTML += texto.charAt(i);
            i++;
            if (i > texto.length - 1) {
                clearInterval(intervalo);
                if (callback) setTimeout(callback, tempoPausa);
            }
        }, velocidadeDigitacao);
    }

    function apagar(caracteres, callback) {
        let i = 0;
        const intervalo = setInterval(() => {
            elementoTitulo.innerHTML = elementoTitulo.innerHTML.slice(0, -1);
            i++;
            if (i >= caracteres) {
                clearInterval(intervalo);
                if (callback) setTimeout(callback, tempoPausa / 2);
            }
        }, velocidadeApagar);
    }

    digitar(textoErrado, () => {
        apagar(2, () => {
            digitar("ipe", () => {
                setTimeout(() => {
                    elementoTitulo.classList.remove("cursor-piscando");
                }, tempoPausa * 2);
            });
        });
    });
}

window.addEventListener('DOMContentLoaded', animacaoDeDigitacao);

 