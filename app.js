import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

let firebaseConfig = {
    databaseURL: "https://datos-de-pasteleria-default-rtdb.firebaseio.com"
};

let app = initializeApp(firebaseConfig);
let baseDeDatos = getDatabase(app);

let recetasRef = ref(baseDeDatos, 'recetas');

let miFormulario = document.getElementById('formReceta');
let tablaRecetas = document.getElementById('tablaRecetas');
let btnGuardar = document.getElementById('btnGuardar');

onValue(recetasRef, (datos) => {
    let recetas = datos.val();
    tablaRecetas.innerHTML = "";

    if (recetas) {
        for (let id in recetas) {
            let r = recetas[id];
            tablaRecetas.innerHTML += `
                <tr>
                    <td><img src="${r.imagenUrl}" width="50"></td>
                    <td><strong>${r.nombreReceta}</strong></td>
                    <td>${r.pastelero}</td>
                    <td>${r.categoria}</td>
                    <td>${r.tiempoPreparacion} min</td>
                    <td>${r.dificultad}</td>
                </tr>
            `;
        }
    }
});

let inputNombreReceta = document.getElementById('nombreReceta');
let inputPastelero = document.getElementById('pastelero');
let inputCategoria = document.getElementById('categoria');
let inputTiempoPreparacion = document.getElementById('tiempoPreparacion');
let inputDificultad = document.getElementById('dificultad');
let inputImagenUrl = document.getElementById('imagenUrl');

btnGuardar.onclick = function () {
    let idGenerado = inputNombreReceta.value;
    let nuevaRef = ref(baseDeDatos, 'recetas/' + idGenerado);

    set(nuevaRef, {
        nombreReceta: inputNombreReceta.value,
        pastelero: inputPastelero.value,
        categoria: inputCategoria.value,
        tiempoPreparacion: inputTiempoPreparacion.value,
        dificultad: inputDificultad.value,
        imagenUrl: inputImagenUrl.value
    })
    .then(() => {
        alert("Receta agregada correctamente");
        miFormulario.reset();
    })
    .catch((error) => {
        alert("Error al agregar receta: " + error.message);
    });
};