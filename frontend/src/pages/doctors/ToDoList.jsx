import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AiOutlineDelete } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const ToDoList = () => {
  const [tasks, setTasks] = useState({ ongoing: [], upcoming: [], completed: [] });
  const [newTask, setNewTask] = useState({ title: "", description: "", deadline: "" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // for toggling the add task form
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get/task`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setTasks({
          ongoing: data.filter((task) => task.status === "ongoing"),
          upcoming: data.filter((task) => task.status === "upcoming"),
          completed: data.filter((task) => task.status === "completed"),
        });
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/add/task`,
        {
          title: newTask.title.trim(),
          description: newTask.description.trim(),
          status: "upcoming", // Default status is "upcoming"
          deadline: newTask.deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTasks((prev) => ({
        ...prev,
        upcoming: [...prev.upcoming, response.data.task],
      }));
      setNewTask({ title: "", description: "", deadline: "" });
      setIsFormOpen(false);
    } catch (error) {
      if (error.response) {
        console.error("Error from backend:", error.response.data);
        alert(`Error adding task: ${error.response.data.message}`);
      } else {
        console.error("Error:", error);
        alert("Error adding task");
      }
    }
  };

  const deleteTask = async (column, taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => ({
        ...prev,
        [column]: prev[column].filter((task) => task.id !== taskId),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // If dropped outside, do nothing

    const movedTask = tasks[source.droppableId][source.index]; // Task being moved
    const newStatus = destination.droppableId; // The new status (column)

    // Update the task's status in the backend
    updateTask(movedTask.id, { status: newStatus }).then(() => {
      // After updating the status, update the tasks state to reflect changes
      setTasks((prev) => ({
        ongoing: prev.ongoing.filter((task) => task.id !== movedTask.id),
        upcoming: prev.upcoming.filter((task) => task.id !== movedTask.id),
        completed: prev.completed.filter((task) => task.id !== movedTask.id),
      }));

      // Add the task to the correct column in the state
      if (newStatus === "ongoing") {
        setTasks((prev) => ({ ...prev, ongoing: [...prev.ongoing, movedTask] }));
      } else if (newStatus === "upcoming") {
        setTasks((prev) => ({ ...prev, upcoming: [...prev.upcoming, movedTask] }));
      } else if (newStatus === "completed") {
        setTasks((prev) => ({ ...prev, completed: [...prev.completed, movedTask] }));
      }
    });
  };

  const updateTask = async (taskId, updates) => {
    try {
      await axios.put(
        `${API_BASE_URL}/update/task/${taskId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // After updating, fetch tasks to reflect changes
      const response = await axios.get(`${API_BASE_URL}/get/task`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setTasks({
        ongoing: data.filter((task) => task.status === "ongoing"),
        upcoming: data.filter((task) => task.status === "upcoming"),
        completed: data.filter((task) => task.status === "completed"),
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <DoctorLayout>
      <div className="p-6 bg-white shadow rounded-md max-w-6xl mx-auto">
        {/* Add Task Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-md"
          >
            Add Task
          </button>
        </div>

        {/* Task Add Form (Modal) */}
        {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
              <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
              <label className="block mb-2">Title:</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Task title"
              />
              <label className="block mb-2">Description:</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Task description"
              />
              <label className="block mb-2">Deadline:</label>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-300 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drag and Drop Task Management */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 gap-6">
            {Object.keys(tasks).map((column) => (
              <Droppable key={column} droppableId={column}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 border rounded-lg ${column === "ongoing" ? "bg-red-50" : column === "upcoming" ? "bg-yellow-50" : "bg-green-50"}`}
                  >
                    <h3 className="text-xl font-semibold capitalize mb-3">{column}</h3>
                    {tasks[column].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex justify-between p-3 bg-white border rounded-md shadow-sm"
                          >
                            <span>{task.title}</span>
                            <div className="flex items-center space-x-2">
                              <button onClick={() => deleteTask(column, task.id)} className="text-red-500">
                                <AiOutlineDelete />
                              </button>
                              <button onClick={() => { setSelectedTask(task); setIsModalOpen(true); }} className="text-gray-500">
                                <FiMoreVertical />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* Task Edit Modal */}
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
              <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
              <label className="block mb-2">Description:</label>
              <textarea
                className="w-full p-2 border rounded-md"
                value={selectedTask.description}
                onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
              />
              <label className="block mt-4 mb-2">Deadline:</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={selectedTask.deadline}
                onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => { updateTask(selectedTask.id, selectedTask); setIsModalOpen(false); }}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default ToDoList;
