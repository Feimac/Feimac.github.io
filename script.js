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

    // Remove SVG antigo antes de redesenhar
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

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(contatos.links)
        .join("line")
        .attr("stroke-width", 2);

    // --- MELHORIA: Grupo <g> para nó + texto ---
    const nodeGroup = svg.append("g")
        .selectAll("g")
        .data(contatos.nodes)
        .join("g")
        .style("cursor", "pointer")
        .attr("tabindex", 0)
        .on("click", (event, d) => {
            if (d.url) window.open(d.url, "_blank");
        })
        .on("keypress", (event, d) => {
            if ((event.key === "Enter" || event.key === " ") && d.url) {
                window.open(d.url, "_blank");
            }
        })
        .call(d3.drag()
            .on("start", (event, d) => dragstarted(event, d, simulation))
            .on("drag", dragged)
            .on("end", (event, d) => dragended(event, d, simulation))
        );

    nodeGroup.append("circle")
        .attr("r", 25)
        .attr("fill", d => d.group === 1 ? "#1a73e8" : "#ff9800");

    nodeGroup.append("text")
        .text(d => d.id)
        .attr("font-size", 18)
        .attr("dy", -35)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--text)");

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // Posiciona o grupo inteiro
        nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });
}

// --- CORREÇÃO: Funções de arrastar que acordam a simulação ---
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