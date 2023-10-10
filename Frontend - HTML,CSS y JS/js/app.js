// ! FUNCION CARGAS PELICULAS
async function cargarPeliculas() {
  const listaPeliculas = document.getElementById("lista-peliculas");

  try {
    const response = await fetch("cadena/api/peliculas");
    if (!response.ok) {
      throw new Error("Error al obtener las películas");
    }

    const data = await response.json();

    data.forEach((pelicula) => {
      const peliculaCard = document.createElement("div");
      peliculaCard.classList.add("col-md-4", "mb-4");

      peliculaCard.innerHTML = `
                <div class="card h-100 shadow-lg">
                    <img src="${pelicula.imagen}" class="card-img-top" alt="${
                      pelicula.titulo
                    }">
                    <div class="card-body">
                        <h5 class="card-title">${pelicula.titulo}</h5>
                        <p class="card-text"><strong>Director:</strong> ${pelicula.director}</p>
                        <p class="card-text"><strong>Género:</strong> ${pelicula.genero}</p>
                        <p class="card-text"><strong>Duración: </strong>${
                          pelicula.duracion
                        } minutos</p>
                        <p class="card-text"><strong>Sinopsis:</strong> ${
                          pelicula.sinopsis
                        }</p>
                        <p class="card-text"><strong>Actores:</strong> ${pelicula.actores}</p>
                        <p class="card-text"><strong>Idioma:</strong> ${
                          pelicula.idioma
                        }</p>
                        <p class="card-text"><strong>Clasificación:</strong> ${
                          pelicula.clasificacion
                        }</p>
                        <p class="card-text"><strong>Calificación:</strong> ${
                          pelicula.calificacion
                        }</p>
                        <p class="card-text"><strong>Fecha de Lanzamiento:</strong> ${
                          new Date(pelicula.fechaLanzamiento)
                            .toISOString()
                            .split("T")[0]
                        }</p>
                        <div class="mt-3">
          <button class="btn btn-primary btn-sm" onclick="editarPelicula('${
            pelicula._id
          }')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarPelicula('${
            pelicula._id
          }')">Eliminar</button>
        </div>
                    </div>
                </div>
            `;

      listaPeliculas.appendChild(peliculaCard);
    });
  } catch (error) {
    console.error("Error al obtener las películas:", error);
  }
}

// ! FUNCION CREAR PELICULA
async function crearPelicula(formData) {
  try {
    const response = await fetch("cadena/api/CrearPelicula", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Película creada exitosamente");
      $("#crearPeliculaModal").modal("hide");
      window.location.reload();
    } else {
      console.error("Error al crear la película");
    }
  } catch (error) {
    console.error("Error al crear la película:", error);
  }
}

// ! FUNCION ELIMINAR PELICULA
async function eliminarPelicula(id) {
  try {
    const confirmacion = confirm(
      "¿Está seguro de que desea eliminar esta película?"
    );

    if (!confirmacion) {
      return;
    }
    const response = await fetch(
      `cadena/api/EliminarPelicula/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      console.log("Película eliminada exitosamente");
      window.location.reload();
    } else {
      console.error("Error al eliminar la película");
    }
  } catch (error) {
    console.error("Error al eliminar la película:", error);
  }
}

// ! FUNCION EDITAR PELICULA
async function editarPelicula(id) {
  try {
    // Obtener los datos de la película por su _id utilizando el endpoint /BuscarPeliculaPorId/:id
    const response = await fetch(
      `cadena/api/BuscarPeliculaPorId/${id}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los datos de la película");
    }

    const peliculaData = await response.json();
    console.log(peliculaData);
    const formularioModal = document.getElementById("crearPeliculaForm");
    formularioModal.elements.titulo.value = peliculaData.titulo;
    formularioModal.elements.director.value = peliculaData.director;
    formularioModal.elements.genero.value = peliculaData.genero;
    formularioModal.elements.duracion.value = peliculaData.duracion;
    formularioModal.elements.sinopsis.value = peliculaData.sinopsis;
    formularioModal.elements.imagen.value = peliculaData.imagen;
    formularioModal.elements.actores.value = peliculaData.actores;
    formularioModal.elements.idioma.value = peliculaData.idioma;
    formularioModal.elements.clasificacion.value = peliculaData.clasificacion;
    formularioModal.elements.calificacion.value = peliculaData.calificacion;
    const fechaLanzamientoISO = new Date(peliculaData.fechaLanzamiento)
      .toISOString()
      .split("T")[0];
    formularioModal.elements.fechaLanzamiento.value = fechaLanzamientoISO;
    $("#crearPeliculaModal").modal("show");
    $("#guardarNuevo").addClass("d-none");
    $("#guardarEdicion").removeClass("d-none");
    $("#crearPeliculaModal").on("hidden.bs.modal", function () {
      limpiarModalEdicion();
    });
    $("#guardarEdicion").on("click", async function () {
      const peliculaEditada = {
        titulo: formularioModal.elements.titulo.value,
        director: formularioModal.elements.director.value,
        genero: formularioModal.elements.genero.value,
        duracion: formularioModal.elements.duracion.value,
        sinopsis: formularioModal.elements.sinopsis.value,
        imagen: formularioModal.elements.imagen.value,
        actores: formularioModal.elements.actores.value,
        idioma: formularioModal.elements.idioma.value,
        clasificacion: formularioModal.elements.clasificacion.value,
        calificacion: formularioModal.elements.calificacion.value,
        fechaLanzamiento: formularioModal.elements.fechaLanzamiento.value,
      };

      console.log(peliculaEditada);
      try {
        const response = await fetch(
          `cadena/api/ActualizarPelicula/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(peliculaEditada),
          }
        );

        if (!response.ok) {
          throw new Error("Error al editar la película");
        }
        // La película se ha editado con éxito, puedes cerrar el modal o realizar otras acciones necesarias
        $("#crearPeliculaModal").modal("hide");
        window.location.reload();
      } catch (error) {
        console.error("Error al editar la película:", error);
      }
    });
  } catch (error) {
    console.error("Error al obtener los datos de la película:", error);
  }
}

function limpiarModalEdicion() {
  const formularioModal = document.getElementById("crearPeliculaForm");
  formularioModal.reset(); // Esto restablecerá todos los campos del formulario
  $("#guardarEdicion").addClass("d-none");
  $("#guardarNuevo").removeClass("d-none");
}


// Llama a la función cargarPeliculas en cualquier momento que desees cargar las películas
document.addEventListener("DOMContentLoaded", () => {
  cargarPeliculas();

  const formularioModal = document.getElementById("crearPeliculaForm");
  formularioModal.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(formularioModal);
    await crearPelicula(formData);
  });
});
