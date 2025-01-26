const paths = document.querySelectorAll('path');

for (const path of paths) {
  path.addEventListener('mouseover', (event) => {
    const title = event.target.getAttribute('title');
    const namep = document.getElementById('namep');
    namep.textContent = title;
  });
}

// SCRIPT HEADER
const toggleBtn = document.querySelector('.toggle_btn')
const toggleIcon = document.querySelector('.toggle_btn i')
const dropdownMenu = document.querySelector('.dropdown_menu')

toggleBtn.onclick = function () {
   dropdownMenu.classList.toggle('open')
   const isOpen = dropdownMenu.classList.contains('open')

   toggleIcon.classList = isOpen
   ? 'fa-solid fa-xmark'
   : 'fa-solid fa-bars'
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
      li.classList.add("country-item"); // Clase para estilizar el elemento

      // Crear el checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = country.id; // Relacionar con el path del mapa

      // Crear el texto del país
      const text = document.createElement("span");
      text.textContent = country.name;
      text.classList.add("country-name"); // Clase para estilizar el texto

      // Agregar checkbox y texto al li
      li.appendChild(checkbox);
      li.appendChild(text);
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
      if (e.target.tagName === "LI" || e.target.tagName === "SPAN") {
         const li = e.target.closest("li");
         const selectedCountryId = li.dataset.id;

         // Alternar selección del país en el mapa
         svgPaths.forEach(path => {
            if (path.id === selectedCountryId) {
               path.classList.toggle("selected"); // Alternar la clase "selected"
            } else {
               path.classList.remove("selected"); // Asegurarse de que otros países no queden seleccionados
            }
         });

         // Mostrar el nombre del país en el input
         const selectedPath = Array.from(svgPaths).find(path => path.id === selectedCountryId);
         if (selectedPath && selectedPath.classList.contains("selected")) {
            searchInput.value = li.textContent; // Mostrar nombre si está seleccionado
         } else {
            searchInput.value = ""; // Limpiar input si se deselecciona
         }

         // Ocultar la lista después de seleccionar
         countryList.style.display = "none";
      }
   });

   // Ocultar la lista al hacer clic fuera del contenedor, excepto en el input o la lista
   document.addEventListener("click", function (e) {
      if (!e.target.closest("#search-input") && !e.target.closest("#country-list")) {
         countryList.style.display = "none";
      }
   });
});
// FIN DE MÉTODOS PARA LA BARRA DE BÚSQUEDA











 
 /*
 function insertarPaises() {
   fetch('/insertar-paises', { method: 'POST' })
     .then(response => {
       if (response.ok) {
         return response.text();
       } else {
         throw new Error('Error al insertar países.');
       }
     })
     .then(data => {
       alert(data); // Mostrar mensaje del servidor
     })
     .catch(error => {
       console.error('Hubo un error:', error);
       alert('Error al insertar los países.');
     });
 }
     */