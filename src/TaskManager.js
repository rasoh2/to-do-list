// Clase Tarea representa una tarea individual con sus propiedades y métodos
class Tarea {
  constructor(
    id, // Identificador único de la tarea
    descripcion, // Descripción de la tarea
    estado = "pendiente", // Estado inicial de la tarea (por defecto "pendiente")
    fechaCreacion = new Date(), // Fecha de creación de la tarea (por defecto la fecha actual)
    fechaLimite = null, // Fecha límite opcional para completar la tarea
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaLimite = fechaLimite; // Nueva propiedad opcional para la fecha límite
  }

  // Método para cambiar el estado de la tarea (por ejemplo, de "pendiente" a "completada")
  cambiarEstado(nuevoEstado) {
    this.estado = nuevoEstado;
  }

  // Método para eliminar la tarea (devuelve un mensaje indicando que fue eliminada)
  eliminar() {
    return `Tarea con ID ${this.id} eliminada.`;
  }
}

// Clase GestorTareas administra una lista de tareas y proporciona métodos para gestionarlas
class GestorTareas {
  constructor() {
    this.tareas = []; // Lista de tareas
  }

  // Método para agregar una nueva tarea a la lista
  agregarTarea(tarea) {
    this.tareas.push(tarea);
  }

  // Método para eliminar una tarea de la lista por su ID
  eliminarTarea(id) {
    this.tareas = this.tareas.filter((tarea) => tarea.id !== id);
  }

  // Método para listar todas las tareas
  listarTareas() {
    return this.tareas;
  }

  // Método para agregar una tarea con un retardo especificado (en milisegundos)
  agregarTareaConRetardo(tarea, retardo = 2000) {
    setTimeout(() => {
      this.agregarTarea(tarea);
      console.log(`Tarea con ID ${tarea.id} agregada después de ${retardo}ms.`);
    }, retardo);
  }

  // Método para mostrar una notificación después de un retardo especificado (en milisegundos)
  mostrarNotificacion(mensaje, retardo = 2000) {
    setTimeout(() => {
      console.log(`Notificación: ${mensaje}`);
    }, retardo);
  }

  // Método para iniciar un contador regresivo para una tarea con fecha límite
  iniciarContadorRegresivo(id, actualizarEstado) {
    const tarea = this.tareas.find((t) => t.id === id); // Buscar la tarea por su ID
    if (!tarea) {
      console.log(`Tarea con ID ${id} no encontrada.`);
      return;
    }

    // Verificar si la tarea no tiene una fecha límite definida
    if (!tarea.fechaLimite) {
      console.log(
        `La tarea "${tarea.descripcion}" no tiene un tiempo definido.`,
      );
      return; // No iniciar el contador si no hay fecha límite
    }

    const fechaLimite = new Date(tarea.fechaLimite); // Convertir la fecha límite a un objeto Date
    const intervalo = setInterval(() => {
      const ahora = new Date(); // Obtener la fecha y hora actual
      const tiempoRestante = Math.floor((fechaLimite - ahora) / 1000); // Calcular la diferencia en segundos

      if (tiempoRestante > 0) {
        actualizarEstado(id, tiempoRestante); // Actualizar el estado en React con el tiempo restante
      } else {
        clearInterval(intervalo); // Detener el contador cuando el tiempo se agote
        console.log(
          `¡El tiempo para la tarea "${tarea.descripcion}" ha terminado!`,
        );
        actualizarEstado(id, 0); // Asegurarse de que el tiempo restante sea 0
      }
    }, 1000); // Actualizar cada segundo
  }
}

export { Tarea, GestorTareas };

// Ejemplo de uso de las clases
const gestor = new GestorTareas();
const tarea1 = new Tarea(1, "Aprender JavaScript"); // Crear una nueva tarea
const tarea2 = new Tarea(2, "Hacer la compra", "completada"); // Crear otra tarea con estado "completada"

gestor.agregarTarea(tarea1); // Agregar la primera tarea al gestor
gestor.agregarTarea(tarea2); // Agregar la segunda tarea al gestor

console.log(gestor.listarTareas()); // Listar todas las tareas

tarea1.cambiarEstado("en progreso"); // Cambiar el estado de la primera tarea
console.log(gestor.listarTareas()); // Listar las tareas nuevamente

gestor.eliminarTarea(1); // Eliminar la primera tarea por su ID
console.log(gestor.listarTareas()); // Listar las tareas después de eliminar una

gestor.iniciarContadorRegresivo(1); // Iniciar un contador regresivo para la tarea con ID 1
