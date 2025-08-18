// Aguarda o conteúdo da página carregar completamente
window.addEventListener('DOMContentLoaded', () => {

    // Seleciona todas as seções que têm um ID e todos os links de navegação
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    // Função que será executada ao rolar a página
    const onScroll = () => {
        // Pega a posição atual da rolagem vertical
        const scrollY = window.scrollY;

        // Itera sobre cada seção para verificar qual está visível
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 80; // Subtrai a altura do menu e um pouco mais
            const sectionId = current.getAttribute('id');

            // Verifica se a posição da rolagem está dentro dos limites da seção atual
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Se estiver, adiciona a classe 'active-link' ao link correspondente
                document.querySelector(`nav a[href*=${sectionId}]`).classList.add('active-link');
            } else {
                // Se não, remove a classe 'active-link'
                document.querySelector(`nav a[href*=${sectionId}]`).classList.remove('active-link');
            }
        });
    };

    // Adiciona o "escutador" de eventos de rolagem na janela
    window.addEventListener('scroll', onScroll);
});
