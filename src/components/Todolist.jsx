import { useState } from "react";

const ToDoList = () => {
  const [toDo, setToDo] = useState([
    { id: 1, text: "Aprender React", completed: false },
    { id: 2, text: "Crear una to-do-list", completed: false },
    { id: 3, text: "agregar bootstrap", completed: false },
  ]);
  const [newToDo, setNewToDo] = useState("");
  const [editText, setEditText] = useState("");
  const [editingId, setEditingId] = useState("");

  const handleInputChange = (e) => {
    setNewToDo(e.target.value);
  };

  const handleAddToDo = (e) => {
    e.preventDefault();
    if (newToDo.trim() !== "") {
      const newTask = {
        id: Date.now(), // Mejor usar timestamp para IDs únicos
        text: newToDo,
        completed: false,
      };
      setToDo([...toDo, newTask]);
      setNewToDo("");
    }
  };

  const handleToggleToDo = (id) => {
    setToDo(
      toDo.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleDeleteToDo = (id, e) => {
    e.stopPropagation();
    setToDo(toDo.filter((todo) => todo.id !== id));
  };

  const handleStartEdit = (id, text, e) => {
    e.stopPropagation();
    setEditingId(id);
    setEditText(text);
  };

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  const handleFinishEdit = (id) => {
    if (editText.trim() !== "") {
      setToDo(
        toDo.map((todo) =>
          todo.id === id ? { ...todo, text: editText } : todo,
        ),
      );
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

  const completedCount = toDo.filter((todo) => todo.completed).length;
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
                    todo.completed ? "completed" : ""
                  }`}
                >
                  {/* Checkbox para completar */}
                  <div className='form-check me-3'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      checked={todo.completed}
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
                      className={`todo-text ${todo.completed ? "completed" : ""}`}
                      onClick={() => handleToggleToDo(todo.id)}
                    >
                      {todo.text}
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className='btn-group ms-auto' role='group'>
                    {editingId !== todo.id && (
                      <button
                        className='btn btn-outline-primary btn-sm'
                        onClick={(e) => handleStartEdit(todo.id, todo.text, e)}
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
