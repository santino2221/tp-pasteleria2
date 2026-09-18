import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let firebaseConfig = {
    databaseURL: "https://datos-de-pasteleria-default-rtdb.firebaseio.com/"
};

let app = initializeApp(firebaseConfig);
let database = getDatabase(app);
let recetasRef = ref(database, 'recetas');

let formReceta = document.getElementById('formReceta');
let tablaRecetas = document.getElementById('tablaRecetas');

let cargarRecetas = () => {
    get(recetasRef).then((snapshot) => {
        tablaRecetas.innerHTML = '';
        if (snapshot.exists()) {
            let datos = snapshot.toJSON();
            for (let id in datos) {
                let r = datos[id];
                let fila = document.createElement('tr');
                fila.innerHTML = `
                    <td><img src="${r.imagenUrl}" width="50"></td>
                    <td><strong>${r.nombreReceta}</strong></td>
                    <td>${r.pastelero}</td>
                    <td>${r.categoria}</td>
                    <td>${r.tiempoPreparacion} min</td>
                    <td>${r.dificultad}</td>
                `;
                tablaRecetas.appendChild(fila);
            }
        }
    }).catch(() => {
        alert("No se pudo cargar la lista de recetas");
    });
};

cargarRecetas();

formReceta.addEventListener('submit', (e) => {
    e.preventDefault();

    let nombreReceta = document.getElementById('nombreReceta').value.trim();
    let pastelero = document.getElementById('pastelero').value.trim();
    let categoria = document.getElementById('categoria').value.trim();
    let tiempoPreparacion = document.getElementById('tiempoPreparacion').value.trim();
    let dificultad = document.getElementById('dificultad').value.trim();
    let imagenUrl = document.getElementById('imagenUrl').value.trim();

    if (!nombreReceta || !pastelero || !categoria || !tiempoPreparacion || !dificultad || !imagenUrl) {
        alert("No se pudo cargar: tenés que completar todos los campos del formulario.");
        return;
    }

    let idGenerado = nombreReceta.toLowerCase().replace(/\s+/g, '-');

    set(ref(database, 'recetas/' + idGenerado), {
        nombreReceta,
        pastelero,
        categoria,
        tiempoPreparacion,
        dificultad,
        imagenUrl
    })
    .then(() => {
        alert("Se pudo cargar la receta correctamente.");
        formReceta.reset();
        cargarRecetas();
    })
    .catch(() => {
        alert("No se pudo cargar la receta en Firebase.");
    });
});