import { useState } from "react";
import { Tarea, GestorTareas } from "../TaskManager";

const ToDoList = () => {
  const [gestor] = useState(new GestorTareas());
  const [toDo, setToDo] = useState(gestor.listarTareas());
  const [newToDo, setNewToDo] = useState("");
  const [newToDoDate, setNewToDoDate] = useState("");
  const [editText, setEditText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [countdowns, setCountdowns] = useState({});

  const handleInputChange = (e) => setNewToDo(e.target.value);

  const handleDateChange = (e) => setNewToDoDate(e.target.value);

  const handleAddToDo = (e) => {
    e.preventDefault();
    if (newToDo.trim() === "") {
      alert(
        "El campo de la tarea no puede estar vacío. Por favor, escribe una descripción para la tarea.",
      );
      return;
    }
    if (newToDoDate && new Date(newToDoDate) < new Date()) {
      alert("No puedes agregar una fecha pasada como fecha límite.");
      return;
    }
    const newTask = new Tarea(
      Date.now(),
      newToDo,
      "pendiente",
      new Date(),
      newToDoDate ? new Date(newToDoDate) : null, // Asignar fecha límite si se proporciona
    );
    gestor.agregarTarea(newTask); // Agregar tarea sin retardo
    setToDo(gestor.listarTareas()); // Actualizar la lista inmediatamente
    gestor.mostrarNotificacion("Tarea agregada con éxito", 2000); // Mostrar notificación
    setNewToDo("");
    setNewToDoDate(""); // Reiniciar el campo de fecha límite
  };

  const handleToggleToDo = (id) => {
    const tarea = gestor.tareas.find(({ id: tareaId }) => tareaId === id); // Uso de destructuring
    if (tarea) {
      tarea.cambiarEstado(
        tarea.estado === "pendiente" ? "completada" : "pendiente",
      );
      setToDo([...gestor.listarTareas()]);
    }
  };

  const handleDeleteToDo = (id, e) => {
    e.stopPropagation();
    gestor.eliminarTarea(id);
    setToDo([...gestor.listarTareas()]);
  };

  const handleStartEdit = (id, text, e) => {
    e.stopPropagation();
    setEditingId(id);
    setEditText(text);
  };

  const handleEditChange = (e) => setEditText(e.target.value);

  const handleFinishEdit = (id) => {
    if (editText.trim() !== "") {
      const tarea = gestor.tareas.find((t) => t.id === id);
      if (tarea) {
        tarea.descripcion = editText;
        setToDo([...gestor.listarTareas()]);
      }
    }
    setEditingId(null);
  };

  const handleKeyPress = (e, id) => {
    if (e.key === "Enter") {
      handleFinishEdit(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return "Tiempo terminado";

    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days} día${days > 1 ? "s" : ""} restante${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hora${hours > 1 ? "s" : ""} restante${hours > 1 ? "s" : ""}`;
    } else {
      return `${minutes} minuto${minutes > 1 ? "s" : ""} restante${minutes > 1 ? "s" : ""}`;
    }
  };

  const handleStartCountdown = (id) => {
    gestor.iniciarContadorRegresivo(id, (taskId, tiempoRestante) => {
      setCountdowns((prevCountdowns) => ({
        ...prevCountdowns,
        [taskId]: tiempoRestante,
      }));
    });

    const tarea = gestor.tareas.find((t) => t.id === id);
    if (tarea) {
      const mensajeFecha = tarea.fechaLimite
        ? `con fecha límite: ${tarea.fechaLimite}`
        : "sin fecha límite definida";
      alert(
        `Cuenta regresiva iniciada para la tarea: "${tarea.descripcion}" ${mensajeFecha}.`,
      );
    }
  };

  const completedCount = toDo.filter(
    (todo) => todo.estado === "completada",
  ).length;
  const totalCount = toDo.length;

  return (
    <div className='todo-container'>
      <div className='card shadow-lg'>
        <div className='card-header text-center'>
          <h1>
            <i className='bi bi-check2-circle me-3'></i>
            Lista de Tareas
          </h1>
          <div className='mt-3'>
            <span className='stats-badge'>
              <i className='bi bi-list-check me-2'></i>
              {completedCount} de {totalCount} completadas
            </span>
          </div>
        </div>

        <div className='card-body p-4'>
          {/* Formulario para agregar tareas */}
          <form onSubmit={handleAddToDo} className='mb-4'>
            <div className='input-group input-group-lg'>
              <input
                type='text'
                className='form-control'
                value={newToDo}
                onChange={handleInputChange}
                placeholder='¿Qué necesitas hacer hoy?'
                aria-label='Nueva tarea'
              />
              <input
                type='date'
                className='form-control'
                value={newToDoDate}
                onChange={handleDateChange}
                placeholder='Fecha límite'
                aria-label='Fecha límite'
              />
              <button className='btn btn-primary btn-custom px-4' type='submit'>
                <i className='bi bi-plus-circle me-2'></i>
                Agregar
              </button>
            </div>
          </form>

          {/* Lista de tareas */}
          {toDo.length === 0 ? (
            <div className='empty-state'>
              <i className='bi bi-clipboard-check'></i>
              <h4>¡No hay tareas pendientes!</h4>
              <p className='text-muted'>Agrega una nueva tarea para comenzar</p>
            </div>
          ) : (
            <div className='todo-list'>
              {toDo.map((todo) => (
                <div
                  key={todo.id}
                  className={`todo-item d-flex align-items-center ${
                    todo.estado === "completada" ? "completed" : ""
                  }`}
                >
                  {/* Checkbox para completar */}
                  <div className='form-check me-3'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      checked={todo.estado === "completada"}
                      onChange={() => handleToggleToDo(todo.id)}
                      id={`todo-${todo.id}`}
                      style={{
                        cursor: "pointer",
                        width: "1.5rem",
                        height: "1.5rem",
                      }}
                    />
                  </div>

                  {/* Texto de la tarea o input de edición */}
                  {editingId === todo.id ? (
                    <input
                      type='text'
                      className='form-control form-control-lg me-3'
                      value={editText}
                      onChange={handleEditChange}
                      onBlur={() => handleFinishEdit(todo.id)}
                      onKeyDown={(e) => handleKeyPress(e, todo.id)}
                      autoFocus
                    />
                  ) : (
                    <div
                      className={`todo-text ${todo.estado === "completada" ? "completed" : ""}`}
                      onClick={() => handleToggleToDo(todo.id)}
                    >
                      {todo.descripcion}
                    </div>
                  )}

                  {/* Mostrar tiempo restante si hay un contador activo */}
                  {countdowns[todo.id] !== undefined && (
                    <span className='badge bg-warning text-dark ms-3'>
                      Tiempo restante:{" "}
                      {formatTimeRemaining(countdowns[todo.id])}
                    </span>
                  )}

                  {/* Botones de acción */}
                  <div className='btn-group ms-auto' role='group'>
                    {editingId !== todo.id && (
                      <button
                        className='btn btn-outline-primary btn-sm'
                        onClick={(e) =>
                          handleStartEdit(todo.id, todo.descripcion, e)
                        }
                        title='Editar tarea'
                      >
                        <i className='bi bi-pencil'></i>
                      </button>
                    )}
                    <button
                      className='btn btn-outline-danger btn-sm'
                      onClick={(e) => handleDeleteToDo(todo.id, e)}
                      title='Eliminar tarea'
                    >
                      <i className='bi bi-trash'></i>
                    </button>
                    {/* Botón para iniciar contador regresivo */}
                    <button
                      className='btn btn-outline-warning btn-sm'
                      onClick={() => handleStartCountdown(todo.id, 10)}
                      title='Iniciar contador regresivo'
                    >
                      <i className='bi bi-clock'></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
