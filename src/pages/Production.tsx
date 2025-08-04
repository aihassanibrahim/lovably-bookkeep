import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Scissors, Package, Trash2, Edit } from 'lucide-react';
import { useBizPal } from "@/context/BizPalContext";

const Production = () => {
  // Use global state instead of local state
  const { productionTasks, addProductionTask, updateProductionTask, deleteProductionTask, stats } = useBizPal();
  
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    orderId: "",
    customerName: "",
    productName: "",
    priority: "Medium",
    estimatedHours: "",
    dueDate: "",
    notes: ""
  });

  const priorityColors = {
    "Låg": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    "Medium": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    "Hög": "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
  };

  const statusColors = {
    "Planerad": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    "Pågående": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    "Klar": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
  };

  const toggleTaskCompletion = (taskId, subtaskId) => {
    const task = productionTasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        tasks: task.tasks.map(subtask =>
          subtask.id === subtaskId 
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        )
      };
      updateProductionTask(updatedTask);
    }
  };

  const handleAddOrEditTask = () => {
    if (editingTask) {
      updateProductionTask({
        ...newTask,
        id: editingTask.id,
        tasks: editingTask.tasks,
        spentHours: editingTask.spentHours,
        phase: editingTask.phase,
        status: editingTask.status
      });
      setEditingTask(null);
    } else {
      const nextId = Math.max(0, ...productionTasks.map(t => t.id)) + 1;
      
      const task = {
        id: nextId,
        orderId: newTask.orderId,
        customerName: newTask.customerName,
        productName: newTask.productName,
        priority: newTask.priority,
        estimatedHours: parseFloat(newTask.estimatedHours) || 0,
        spentHours: 0,
        dueDate: newTask.dueDate,
        status: "Planerad",
        phase: "Förberedelse",
        tasks: [
          { id: 1, name: "Förberedelse och planering", completed: false },
          { id: 2, name: "Materialberedning", completed: false },
          { id: 3, name: "Tillverkning/skapande", completed: false },
          { id: 4, name: "Finishing och detaljer", completed: false },
          { id: 5, name: "Kvalitetskontroll", completed: false }
        ],
        notes: newTask.notes
      };

      addProductionTask(task);
    }
    
    setShowNewTaskDialog(false);
    resetForm();
  };

  const handleEditTask = (task) => {
    setNewTask({
      orderId: task.orderId,
      customerName: task.customerName,
      productName: task.productName,
      priority: task.priority,
      estimatedHours: task.estimatedHours.toString(),
      dueDate: task.dueDate,
      notes: task.notes
    });
    setEditingTask(task);
    setShowNewTaskDialog(true);
  };

  const handleDeleteTask = (taskId) => {
    deleteProductionTask(taskId);
  };

  const resetForm = () => {
    setNewTask({
      orderId: "",
      customerName: "",
      productName: "",
      priority: "Medium",
      estimatedHours: "",
      dueDate: "",
      notes: ""
    });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const task = productionTasks.find(t => t.id === taskId);
    if (task) {
      updateProductionTask({ ...task, status: newStatus });
    }
  };

  const urgentTasks = productionTasks.filter(task => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 3 && task.status !== "Klar";
  }).length;

  // Filter options
  const [statusFilter, setStatusFilter] = useState("active");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTasks = productionTasks.filter(task => {
    const statusMatch = statusFilter === "all" || 
                       (statusFilter === "active" && task.status !== "Klar") ||
                       (statusFilter === "completed" && task.status === "Klar") ||
                       task.status === statusFilter;
    
    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter;
    
    return statusMatch && priorityMatch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Produktion</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Håll koll på vad som behöver göras</p>
        </div>
        
        <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              {editingTask ? "Redigera Uppgift" : "Ny Produktionsuppgift"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Redigera produktionsuppgift" : "Lägg till produktionsuppgift"}</DialogTitle>
              <DialogDescription>
                {editingTask ? "Uppdatera uppgiftsinformation" : "Skapa en ny uppgift för produktion"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order ID</Label>
                  <Input 
                    value={newTask.orderId}
                    onChange={(e) => setNewTask({...newTask, orderId: e.target.value})}
                    placeholder="ORD-001"
                  />
                </div>
                <div>
                  <Label>Kund</Label>
                  <Input 
                    value={newTask.customerName}
                    onChange={(e) => setNewTask({...newTask, customerName: e.target.value})}
                    placeholder="Anna Andersson"
                  />
                </div>
                <div>
                  <Label>Produkt</Label>
                  <Input 
                    value={newTask.productName}
                    onChange={(e) => setNewTask({...newTask, productName: e.target.value})}
                    placeholder="Keramikskål, Halsband, T-shirt..."
                  />
                </div>
                <div>
                  <Label>Prioritet</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Låg">Låg</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hög">Hög</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Uppskattat timmar</Label>
                  <Input 
                    type="number"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({...newTask, estimatedHours: e.target.value})}
                    placeholder="8"
                  />
                </div>
                <div>
                  <Label>Slutdatum</Label>
                  <Input 
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Anteckningar</Label>
                <Textarea 
                  value={newTask.notes}
                  onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                  placeholder="Speciella instruktioner..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowNewTaskDialog(false);
                  setEditingTask(null);
                  resetForm();
                }}>
                  Avbryt
                </Button>
                <Button onClick={handleAddOrEditTask} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                  {editingTask ? "Uppdatera" : "Lägg till"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards - Now using real data from context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Aktiva uppgifter</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.production.active}</div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Totalt timmar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {productionTasks.reduce((sum, task) => sum + task.estimatedHours, 0)}h
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Brådskande</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{urgentTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Status:</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktiva</SelectItem>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="Planerad">Planerad</SelectItem>
              <SelectItem value="Pågående">Pågående</SelectItem>
              <SelectItem value="completed">Slutförda</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Prioritet:</Label>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="Hög">Hög</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Låg">Låg</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Visar {filteredTasks.length} av {productionTasks.length} uppgifter
        </span>
      </div>

      {/* Production Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Produktionsuppgifter</h2>
        {filteredTasks.length === 0 ? (
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Scissors className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {statusFilter === "active" ? "Inga aktiva uppgifter" : "Inga uppgifter matchar filtret"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                {statusFilter === "active" 
                  ? "Lägg till din första produktionsuppgift för att komma igång"
                  : "Prova att ändra filtreringsinställningarna"
                }
              </p>
              {statusFilter === "active" && (
                <Button onClick={() => setShowNewTaskDialog(true)} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Lägg till uppgift
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{task.orderId} - {task.productName}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Kund: {task.customerName} • {task.estimatedHours}h • {task.dueDate}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={priorityColors[task.priority]}>
                      {task.priority}
                    </Badge>
                    <Select value={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planerad">Planerad</SelectItem>
                        <SelectItem value="Pågående">Pågående</SelectItem>
                        <SelectItem value="Klar">Klar</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={statusColors[task.status]}>
                      {task.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTask(task)}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ta bort produktionsuppgift</AlertDialogTitle>
                          <AlertDialogDescription>
                            Är du säker på att du vill ta bort uppgiften <strong>{task.productName}</strong> för {task.customerName}? 
                            Denna åtgärd kan inte ångras.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTask(task.id)}
                            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                          >
                            Ta bort
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Uppgifter</h4>
                  {task.tasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={subtask.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id, subtask.id)}
                      />
                      <span className={`${subtask.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                        {subtask.name}
                      </span>
                      {subtask.completed && <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />}
                    </div>
                  ))}
                </div>
                
                {task.notes && (
                  <div>
                    <h4 className="font-medium mb-1 text-gray-900 dark:text-gray-100">Anteckningar</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Production; 