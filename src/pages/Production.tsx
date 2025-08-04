import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useBizPal } from "@/context/BizPalContext";
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Scissors, Package } from 'lucide-react';

const Production = () => {
  const { productionTasks, addProductionTask, updateProductionTask, deleteProductionTask, stats } = useBizPal();
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
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
    "Låg": "bg-green-100 text-green-800",
    "Medium": "bg-yellow-100 text-yellow-800",
    "Hög": "bg-red-100 text-red-800"
  };

  const statusColors = {
    "Planerad": "bg-blue-100 text-blue-800",
    "Pågående": "bg-yellow-100 text-yellow-800",
    "Klar": "bg-green-100 text-green-800"
  };

    const toggleTaskCompletion = (taskId, subtaskId) => {
    const taskToUpdate = productionTasks.find(task => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        tasks: taskToUpdate.tasks.map(subtask =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        )
      };
      updateProductionTask(updatedTask);
    }
  };

  const addNewTask = () => {
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
    setShowNewTaskDialog(false);
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

  const totalHours = productionTasks.reduce((sum, task) => sum + task.estimatedHours, 0);

  return (
    <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produktion</h1>
            <p className="text-gray-600 mt-1">Håll koll på vad som behöver göras</p>
          </div>
          
          <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Ny Produktionsuppgift
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Lägg till produktionsuppgift</DialogTitle>
                <DialogDescription>
                  Skapa en ny uppgift för produktion
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
                  <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>
                    Avbryt
                  </Button>
                  <Button onClick={addNewTask} className="bg-purple-600 hover:bg-purple-700">
                    Lägg till
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva uppgifter</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.production.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt timmar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brådskande</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.production.urgent}</div>
          </CardContent>
        </Card>
        </div>

        {/* Production Tasks */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Produktionsuppgifter</h2>
          {productionTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Scissors className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Inga produktionsuppgifter</h3>
                <p className="text-gray-500 text-center mb-4">
                  Lägg till din första produktionsuppgift för att komma igång
                </p>
                <Button onClick={() => setShowNewTaskDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Lägg till uppgift
                </Button>
              </CardContent>
            </Card>
          ) : (
            productionTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{task.orderId} - {task.productName}</CardTitle>
                      <CardDescription>
                        Kund: {task.customerName} • {task.estimatedHours}h • {task.dueDate}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Uppgifter</h4>
                    {task.tasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center space-x-2">
                        <Checkbox 
                          checked={subtask.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id, subtask.id)}
                        />
                        <span className={subtask.completed ? "line-through text-gray-500" : ""}>
                          {subtask.name}
                        </span>
                        {subtask.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    ))}
                  </div>
                  
                  {task.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Anteckningar</h4>
                      <p className="text-sm text-gray-600">{task.notes}</p>
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