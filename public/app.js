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

   // Obtener el ID del usuario desde el HTML oculto
   const userIdElement = document.getElementById("user-id");
   const userId = userIdElement ? userIdElement.textContent.trim() : null;

   if (!userId) {
      console.error("No se encontró el ID del usuario en la sesión.");
      return;
   }

   // Cargar todos los países al iniciar
   const countries = Array.from(svgPaths).map(path => ({
      id: path.id,
      name: path.getAttribute("title"),
   }));

   // Poblar la lista de países
   countries.forEach(country => {
      const li = document.createElement("li");
      li.classList.add("country-item");

      // Crear el texto del país
      const text = document.createElement("span");
      text.textContent = country.name;
      text.classList.add("country-name");

      li.appendChild(text);
      li.dataset.id = country.id;

      countryList.appendChild(li);
   });

   // **NUEVO: Cargar países seleccionados desde el backend**
   fetch(`/selectedCountries/${userId}`)
      .then(response => response.json())
      .then(data => {
         if (data.success) {
            const selectedCountries = data.selectedCountries;

            // Resaltar países seleccionados en el mapa y la lista
            selectedCountries.forEach(countryId => {
               const path = document.getElementById(countryId);
               if (path) {
                  path.classList.add("selected");
               }

               const listItem = document.querySelector(`#country-list li[data-id="${countryId}"]`);
               if (listItem) {
                  listItem.classList.add("selected-country");
               }

               // Obtener el nombre del país del atributo 'title' del mapa
               const countryName = path ? path.getAttribute("title") : "Unknown";

               // Llenar la tabla con el país seleccionado
               const tableBody = document.querySelector("#selected-countries-table tbody");
               const row = document.createElement("tr");

               // Columna de nombre del país
               const countryCell = document.createElement("td");
               countryCell.textContent = countryName;

               // Columna de acción con botón "See my memories"
               const actionCell = document.createElement("td");
               const button = document.createElement("button");
               button.textContent = "See my memories";
               button.classList.add("memory-button");
               button.addEventListener("click", () => {
                  window.location.href = "/memories"; // Redirige a la página memories.ejs
               });

               actionCell.appendChild(button);
               row.appendChild(countryCell);
               row.appendChild(actionCell);
               tableBody.appendChild(row);
            });
         } else {
            console.error("Error al cargar países seleccionados.");
         }
      })
      .catch(error => console.error("Error al recuperar países seleccionados:", error));


   // Mostrar la lista al hacer clic en la barra de búsqueda
   searchInput.addEventListener("focus", function () {
      Array.from(countryList.children).forEach(li => li.style.display = "block");
      countryList.style.display = "block";
   });

   // Filtrar la lista al escribir
   searchInput.addEventListener("input", function () {
      const searchValue = searchInput.value.toLowerCase();
      Array.from(countryList.children).forEach(li => {
         const matches = li.textContent.toLowerCase().includes(searchValue);
         li.style.display = matches ? "block" : "none";
      });
   });

   // Seleccionar un país y enviar la solicitud
countryList.addEventListener("click", function (e) {
   if (e.target.tagName === "LI" || e.target.tagName === "SPAN") {
      const li = e.target.closest("li");
      const selectedCountryId = li.dataset.id;

      // Validar si el país ya está seleccionado
      if (li.classList.contains("selected-country")) {
         // Obtener el ID del país
         const countryId = li.dataset.id;
     
         // Enviar una solicitud al backend para eliminar el país
         fetch(`/deleteCountry/${userId}`, {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
             },
             body: JSON.stringify({ countryId })
         })
         .then(response => response.json())
         .then(data => {
             if (data.success) {
                 // Desmarcar el país de la lista y del mapa
                 li.classList.remove("selected-country");
                 const path = document.getElementById(countryId);
                 if (path) {
                     path.classList.remove("selected");
                 }
     
                 // Eliminar la fila de la tabla
                 const tableBody = document.querySelector("#selected-countries-table tbody");
                 const rowToDelete = tableBody.querySelector(`tr[data-id="${countryId}"]`);
                 if (rowToDelete) {
                     tableBody.removeChild(rowToDelete); // Eliminar la fila
                 }
     
                 // Actualizar progreso
                 const progressText = document.querySelector(".progress-text");
                 const percentageText = document.querySelector(".percentage");
                 const circularProgress = document.querySelector(".circular-progress");
     
                 // Llamada al endpoint del backend para progreso actualizado
                 fetch(`/progreso/${userId}`)
                     .then(response => response.json())
                     .then(data => {
                         const totalPaises = data.totalPaises;
                         const porcentaje = data.porcentaje;
     
                         // Actualizar el gráfico circular
                         circularProgress.style.setProperty("--percentage", `${porcentaje}%`);
                         progressText.textContent = `${totalPaises} / 256 Countries`;
                         percentageText.textContent = `${porcentaje}%`;
                     })
                     .catch(error => console.error("Error al cargar el progreso actualizado:", error));
     
                 console.log("País eliminado correctamente.");
             } else {
                 console.error("Error al eliminar el país.");
             }
         })
         .catch(error => console.error("Error al enviar la solicitud:", error));
     
         return;
     }  

         // Enviar la solicitud POST al backend
         fetch("/insertCountries", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               userId: userId,
               countryId: selectedCountryId
            }),
         })
            .then(response => response.json())
            .then(data => {
               if (data.success) {
                  alert("País agregado correctamente.");
               
                  // **Agregar una nueva fila a la tabla**
                  const tableBody = document.querySelector("#selected-countries-table tbody");
                  const row = document.createElement("tr");
                  row.dataset.id = selectedCountryId; // Para identificar la fila
               
                  // Columna de nombre del país
                  const countryCell = document.createElement("td");
                  countryCell.textContent = li.textContent; // Usa el nombre del país de la lista
                  row.appendChild(countryCell);
               
                  // Columna de acción con botón "See my memories"
                  const actionCell = document.createElement("td");
                  const button = document.createElement("button");
                  button.textContent = "See my memories";
                  button.classList.add("memory-button");
                  button.addEventListener("click", () => {
                     window.location.href = "/memories"; // Redirige a la página memories.ejs
                  });
                  actionCell.appendChild(button);
                  row.appendChild(actionCell);
               
                  // Añadir la fila a la tabla
                  tableBody.appendChild(row);
               
                  // Actualizar progreso
                  const progressText = document.querySelector(".progress-text");
                  const percentageText = document.querySelector(".percentage");
                  const circularProgress = document.querySelector(".circular-progress");
               
                  // Llamada al endpoint del backend
                  fetch(`/progreso/${userId}`)
                     .then(response => response.json())
                     .then(data => {
                        const totalPaises = data.totalPaises;
                        const porcentaje = data.porcentaje;
               
                        // Actualizar el gráfico circular
                        circularProgress.style.setProperty("--percentage", `${porcentaje}%`);
                        circularProgress.style.setProperty("--progress-color", "orange");
                        progressText.textContent = `${totalPaises} / 256 Countries`;
                        percentageText.textContent = `${porcentaje}%`;
                     })
                     .catch(error => console.error("Error al cargar el progreso actualizado:", error));
               } else {
                  alert("Error al agregar el país.");
               }
            })
            .catch(error => console.error("Error:", error));

         // Actualizar la UI
         svgPaths.forEach(path => {
            if (path.id === selectedCountryId) {
               path.classList.add("selected"); // Mantener el estado seleccionado
            }
         });

         // Resaltar el país en la lista
         li.classList.add("selected-country");
         searchInput.value = li.textContent;
         countryList.style.display = "none";
      }
   });

   // Ocultar la lista al hacer clic fuera
   document.addEventListener("click", function (e) {
      if (!e.target.closest("#search-input") && !e.target.closest("#country-list")) {
         countryList.style.display = "none";
      }
   });
});
// FIN DE MÉTODOS PARA LA BARRA DE BÚSQUEDA

// PROGRESO DEL USUARIO
document.addEventListener("DOMContentLoaded", () => {
   // Obtener el ID del usuario desde el HTML oculto
   const userIdElement = document.getElementById("user-id");
   const userId = userIdElement ? userIdElement.textContent.trim() : null;
   const progressText = document.querySelector(".progress-text");
   const percentageText = document.querySelector(".percentage");
   const circularProgress = document.querySelector(".circular-progress");

   // Llamada al endpoint del backend
   fetch(`/progreso/${userId}`)
     .then(response => response.json())
     .then(data => {
       const totalPaises = data.totalPaises;
       const porcentaje = data.porcentaje;

       // Actualizar el gráfico circular
       circularProgress.style.setProperty("--percentage", `${porcentaje}%`);
       circularProgress.style.setProperty("--progress-color", "orange"); // Cambia el color según el progreso
       progressText.textContent = `${totalPaises} / 256 Countries`;
       percentageText.textContent = `${porcentaje}%`;
     })
     .catch(error => console.error("Error al cargar el progreso:", error));
 });



