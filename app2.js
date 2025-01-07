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

// INICIO DE MÉTODOS PARA LA BARRA DE BÚSQUEDA
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const countryList = document.getElementById("country-list");
    const svgPaths = document.querySelectorAll("svg path");
 
    // Cargar todos los países al iniciar
    const countries = Array.from(svgPaths).map(path => ({
       id: path.id,
       name: path.getAttribute("title"),
    }));
 
    // Poblar la lista de países
    countries.forEach(country => {
       const li = document.createElement("li");
       li.textContent = country.name;
       li.dataset.id = country.id; // Relacionar con el path del mapa
       countryList.appendChild(li);
    });
 
    // Mostrar la lista completa al hacer clic en la barra de búsqueda
    searchInput.addEventListener("focus", function () {
       // Mostrar todos los países
       Array.from(countryList.children).forEach(li => {
          li.style.display = "block";
       });
       countryList.style.display = "block";
    });
 
    // Filtrar la lista al escribir
    searchInput.addEventListener("input", function () {
       const searchValue = searchInput.value.toLowerCase();
 
       // Filtrar los países que coincidan con la búsqueda
       Array.from(countryList.children).forEach(li => {
          const matches = li.textContent.toLowerCase().includes(searchValue);
          li.style.display = matches ? "block" : "none";
       });
 
       // Mostrar la lista si hay texto o si se ha hecho clic
       countryList.style.display = searchValue || searchInput === document.activeElement ? "block" : "none";
    });
 
    // Seleccionar un país desde la lista
    countryList.addEventListener("click", function (e) {
       if (e.target.tagName === "LI") {
          const selectedCountryId = e.target.dataset.id;
 
          // Resaltar el país en el mapa
          svgPaths.forEach(path => {
             path.classList.remove("selected"); // Quitar cualquier selección previa
             if (path.id === selectedCountryId) {
                path.classList.add("selected");
             }
          });
 
          // Mostrar el nombre del país en el input
          searchInput.value = e.target.textContent;
 
          // Ocultar la lista después de seleccionar
          countryList.style.display = "none";
       }
    });
 
    // Ocultar la lista al hacer clic fuera del contenedor
    document.addEventListener("click", function (e) {
       if (!e.target.closest(".search-container")) {
          countryList.style.display = "none";
       }
    });
 });
 
 
 // FIN DE MÉTODOS PARA LA BARRA DE BÚSQUEDA