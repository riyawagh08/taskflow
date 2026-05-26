"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardComponent() {
  const router = useRouter();

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const addTask = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!task.trim()) return alert("Enter a task");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: task }),
      });

      const data = await res.json();

      if (res.ok) {
        setTasks([...tasks, data]);
        setTask("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = await res.json();

      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">TaskFlow 🚀</h1>
          <p className="text-gray-300 mt-2">
            Manage your tasks beautifully
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-2xl"
        >
          Logout
        </button>
      </div>

      {/* ADD TASK */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 max-w-3xl">

        <input
          type="text"
          placeholder="What do you want to do today?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 p-4 rounded-2xl outline-none text-white placeholder-gray-300"
        />

        <button
          onClick={addTask}
          className="bg-pink-500 hover:bg-pink-600 transition px-6 py-4 rounded-2xl font-semibold"
        >
          Add Task
        </button>
      </div>

      {/* EMPTY STATE */}
      {tasks.length === 0 ? (
        <div className="text-center text-gray-300 mt-20">
          <h2 className="text-2xl mb-3">No tasks yet ✨</h2>
          <p>Add your first task and start being productive 🚀</p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-3xl">

          {tasks.map((t) => (
            <div
              key={t.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex justify-between items-center hover:bg-white/20 transition-all duration-300"
            >

              <div className="flex items-center gap-4">
                <input type="checkbox" 
                  checked={t.completed} 
                  onChange={() => toggleTask(t.id)} 
                  className="w-5 h-5"
                />

                <p className={t.completed ? "line-through text-gray-400 text-lg" : "text-lg"}>
                  {t.title}
                </p>
              </div>

              <button
                onClick={() => deleteTask(t.id)}
                className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-xl"
              >
                Delete
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
