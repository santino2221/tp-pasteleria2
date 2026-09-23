import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let firebaseConfig = {
    databaseURL: "https://datos-de-pasteleria-default-rtdb.firebaseio.com"
};

let app = initializeApp(firebaseConfig);
let database = getDatabase(app);
let recetasRef = ref(database, 'recetas');

let formReceta = document.getElementById('formReceta');
let tablaRecetas = document.getElementById('tablaRecetas');

let cargarRecetas = () => {
    get(recetasRef).then((datosFirebase) => {
        tablaRecetas.innerHTML = '';
        if (datosFirebase.exists()) {
            let datos = datosFirebase.toJSON();
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

formReceta.addEventListener('submit', (evento) => {
    evento.preventDefault();

    let nombreReceta = document.getElementById('nombreReceta').value;
    let pastelero = document.getElementById('pastelero').value;
    let categoria = document.getElementById('categoria').value;
    let tiempoPreparacion = document.getElementById('tiempoPreparacion').value;
    let dificultad = document.getElementById('dificultad').value;
    let imagenUrl = document.getElementById('imagenUrl').value;

    if (!nombreReceta || !pastelero || !categoria || !tiempoPreparacion || !dificultad || !imagenUrl) {
        alert("No se pudo cargar: tenés que completar todos los campos del formulario.");
        return;
    }

    let idGenerado = nombreReceta.toLowerCase().split(' ').join('-');

    let nuevaRef = ref(database, 'recetas/' + idGenerado);

    set(nuevaRef, {
        nombreReceta: nombreReceta,
        pastelero: pastelero,
        categoria: categoria,
        tiempoPreparacion: tiempoPreparacion,
        dificultad: dificultad,
        imagenUrl: imagenUrl
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