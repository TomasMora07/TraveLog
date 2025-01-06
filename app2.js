const paths = document.querySelectorAll('path');

for (const path of paths) {
  path.addEventListener('mouseover', (event) => {
    const title = event.target.getAttribute('title');
    const namep = document.getElementById('namep');
    namep.textContent = title;
  });
}

// INICIO DE MOVER EL MAPA CON EL MOUSE
document.addEventListener('DOMContentLoaded', () => {
    const svgElement = document.querySelector('svg');
    let isPanning = false;
    let startX, startY, scrollLeft, scrollTop;

    // Al iniciar el clic y arrastre
    svgElement.addEventListener('mousedown', (e) => {
        isPanning = true;
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = window.scrollX;
        scrollTop = window.scrollY;
        svgElement.style.cursor = 'grabbing';
    });

    // Al mover el mouse
    svgElement.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        const xDiff = e.clientX - startX;
        const yDiff = e.clientY - startY;

        // Desplaza la ventana del navegador
        window.scrollTo(scrollLeft - xDiff, scrollTop - yDiff);
    });

    // Al soltar el mouse
    svgElement.addEventListener('mouseup', () => {
        isPanning = false;
        svgElement.style.cursor = 'default';
    });

    // Al salir del área SVG sin soltar el mouse
    svgElement.addEventListener('mouseleave', () => {
        isPanning = false;
        svgElement.style.cursor = 'default';
    });
});

// FIN DE MOVER EL MAPA CON EL MOUSE
