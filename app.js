const paths = document.querySelectorAll('path');

for (const path of paths) {
  path.addEventListener('mouseover', (event) => {
    const title = event.target.getAttribute('title');
    const namep = document.getElementById('namep');
    namep.textContent = title;
  });
}