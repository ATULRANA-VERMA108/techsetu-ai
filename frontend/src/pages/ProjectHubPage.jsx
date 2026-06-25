import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header.jsx';
import { ProjectAPI } from '../services/api';
import { 
  Layers, 
  PlusCircle, 
  UserPlus, 
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProjectHubPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Forms states
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');

  const [inviteUsername, setInviteUsername] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = async () => {
    try {
      const data = await ProjectAPI.getAll();
      setProjects(data || []);
      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      } else if (data && selectedProject) {
        const updated = data.find(p => p.id === selectedProject.id);
        if (updated) setSelectedProject(updated);
      }
    } catch (e) {
      setError("Failed to load workspace projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    try {
      const newProj = await ProjectAPI.create(newProjName, newProjDesc);
      setNewProjName('');
      setNewProjDesc('');
      setSelectedProject(newProj);
      loadProjects();
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProject) return;

    const taskObj = {
      title: newTaskTitle,
      description: newTaskDesc,
      status: "TODO",
      priority: newTaskPriority,
      assignee: "admin"
    };

    try {
      await ProjectAPI.addTask(selectedProject.id, taskObj);
      setNewTaskTitle('');
      setNewTaskDesc('');
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    if (!selectedProject) return;
    try {
      await ProjectAPI.updateTask(selectedProject.id, taskId, newStatus, null);
      loadProjects();
      if (newStatus === 'DONE') {
        confetti({
          particleCount: 30,
          spread: 30,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteUsername.trim() || !selectedProject) return;

    try {
      await ProjectAPI.invite(selectedProject.id, inviteUsername);
      setInviteUsername('');
      loadProjects();
    } catch (err) {
      setError("Teammate invite failed. Ensure user exists.");
    }
  };

  const getTasksByStatus = (status) => {
    return selectedProject?.tasks?.filter(t => t.status === status) || [];
  };

  const columns = [
    { title: 'To Do', status: 'TODO', color: 'border-slate-500/20 text-slate-400' },
    { title: 'In Progress', status: 'IN_PROGRESS', color: 'border-cyber-blue/30 text-cyber-blue' },
    { title: 'Under Review', status: 'REVIEW', color: 'border-cyber-purple/30 text-cyber-purple' },
    { title: 'Completed', status: 'DONE', color: 'border-emerald-500/30 text-emerald-400' }
  ];

  return (
    <div className="min-h-screen">
      <Header title="Project Hub Workspace" />

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Projects lists & Create Board */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Create Project card */}
          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="font-display font-bold text-white text-xs mb-4">Create New Workspace</h4>
            <form onSubmit={handleCreateProject} className="flex flex-col gap-3">
              <input
                type="text"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                placeholder="Workspace name..."
                className="glass-input p-2.5 text-xs"
                required
              />
              <textarea
                value={newProjDesc}
                onChange={(e) => setNewProjDesc(e.target.value)}
                placeholder="Brief description..."
                className="glass-input p-2.5 text-xs resize-none"
                rows={2}
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Space</span>
              </button>
            </form>
          </div>

          {/* Project lists selection */}
          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="font-display font-bold text-white text-xs mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyber-cyan" />
              <span>Your Workspaces</span>
            </h4>
            
            {loading ? (
              <p className="text-[10px] text-slate-500">Loading workspaces...</p>
            ) : projects.length === 0 ? (
              <p className="text-[10px] text-slate-500">No projects found.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`
                      w-full p-3 rounded-xl border text-left hover:bg-white/5 transition-all text-xs
                      ${selectedProject?.id === p.id 
                        ? 'bg-cyber-purple/10 border-cyber-purple text-white font-semibold' 
                        : 'bg-white/3 border-white/5 text-slate-400'
                      }
                    `}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Columns (3 cols): Kanban Board */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {selectedProject && (
            <>
              {/* Board Header details & Invite team */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="font-display font-bold text-base text-white">{selectedProject.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-lg">{selectedProject.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    <span className="text-[9px] text-slate-500 uppercase font-bold mr-1 self-center">Members:</span>
                    {selectedProject.members.map((member) => (
                      <span key={member} className="text-[9px] text-slate-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                        @{member}
                      </span>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleInviteMember} className="flex gap-2">
                  <input
                    type="text"
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                    placeholder="Invite teammate..."
                    className="glass-input px-3 py-2 text-xs w-36"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white flex items-center justify-center"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Add Task bar */}
              <div className="glass-panel p-6 rounded-2xl">
                <h4 className="font-display font-bold text-xs text-white mb-4">Add Task Card</h4>
                <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-[10px] text-slate-400 font-semibold">Task Title</label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Configure WebSocket connection..."
                      className="glass-input p-2.5 text-xs w-full"
                      required
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-[10px] text-slate-400 font-semibold">Description</label>
                    <input
                      type="text"
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      placeholder="Setup communication route handlers..."
                      className="glass-input p-2.5 text-xs w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 w-full sm:w-32">
                    <label className="text-[10px] text-slate-400 font-semibold">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="glass-input p-2.5 text-xs bg-cyber-deep"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 w-full sm:w-auto"
                  >
                    <span>Add Card</span>
                  </button>
                </form>
              </div>

              {/* Kanban Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {columns.map((col) => {
                  const tasks = getTasksByStatus(col.status);
                  return (
                    <div key={col.status} className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-white">{col.title}</span>
                        <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md font-semibold">
                          {tasks.length}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 min-h-[40vh] bg-white/1 rounded-xl p-2 border border-dashed border-white/5">
                        {tasks.map((task) => (
                          <div 
                            key={task.id} 
                            className="glass-panel p-4 rounded-xl flex flex-col gap-3 text-left hover:border-white/10 transition-all cursor-grab relative group"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`
                                  text-[8px] uppercase font-bold px-1.5 py-0.5 rounded
                                  ${task.priority === 'HIGH' ? 'bg-red-500/10 text-red-400' : ''}
                                  ${task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' : ''}
                                  ${task.priority === 'LOW' ? 'bg-blue-500/10 text-blue-400' : ''}
                                `}>
                                  {task.priority}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-white leading-tight">{task.title}</h5>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{task.description}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                              <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                <User className="w-3 h-3 text-cyber-cyan" />
                                <span>@{task.assignee}</span>
                              </span>
                              
                              <select
                                value={task.status}
                                onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                                className="text-[9px] bg-[#0c002c] border border-white/10 rounded px-1.5 py-0.5 text-slate-400 focus:outline-none"
                              >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">Progress</option>
                                <option value="REVIEW">Review</option>
                                <option value="DONE">Done</option>
                              </select>
                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
