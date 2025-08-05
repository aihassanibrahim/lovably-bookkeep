import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import BankImport from '@/components/BankImport';

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2024-01-15",
      description: "Försäljning Keramikskål",
      type: "income",
      amount: 299,
      account: "Försäljning",
      customer: "Anna Andersson",
      reference: "F-001",
      notes: "Försäljning via webbutik"
    },
    {
      id: 2,
      date: "2024-01-14",
      description: "Inköp Silver",
      type: "expense",
      amount: -150,
      account: "Inköp av varor",
      customer: "Silverleverantör AB",
      reference: "L-001",
      notes: "Inköp av silver för halsband"
    }
  ]);

  const [showNewTransactionDialog, setShowNewTransactionDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    type: "income",
    amount: "",
    account: "",
    customer: "",
    reference: "",
    notes: ""
  });

  const accounts = ["Försäljning", "Inköp av varor", "Kassa", "Bankkonto"];
  const customers = ["Anna Andersson", "Erik Eriksson", "Maria Svensson"];

  const addNewTransaction = () => {
    const transaction = {
      id: Math.max(0, ...transactions.map(t => t.id)) + 1,
      date: newTransaction.date,
      description: newTransaction.description,
      type: newTransaction.type,
      amount: newTransaction.type === "income" ? parseFloat(newTransaction.amount) : -parseFloat(newTransaction.amount),
      account: newTransaction.account,
      customer: newTransaction.customer,
      reference: newTransaction.reference,
      notes: newTransaction.notes
    };

    setTransactions([...transactions, transaction]);
    setShowNewTransactionDialog(false);
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      description: "",
      type: "income",
      amount: "",
      account: "",
      customer: "",
      reference: "",
      notes: ""
    });
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netIncome = totalIncome - totalExpenses;
  const totalTransactions = transactions.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaktioner</h1>
          <p className="text-gray-600 mt-1">Hantera bokföringstransaktioner</p>
        </div>
        
        <Dialog open={showNewTransactionDialog} onOpenChange={setShowNewTransactionDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Ny Transaktion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Lägg till ny transaktion</DialogTitle>
              <DialogDescription>
                Registrera en ny bokföringstransaktion
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Datum</Label>
                  <Input 
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Typ</Label>
                  <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Intäkt</SelectItem>
                      <SelectItem value="expense">Utgift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Belopp (SEK)</Label>
                  <Input 
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    placeholder="299"
                  />
                </div>
                <div>
                  <Label>Konto</Label>
                  <Select value={newTransaction.account} onValueChange={(value) => setNewTransaction({...newTransaction, account: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj konto" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(account => (
                        <SelectItem key={account} value={account}>{account}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Kund/Leverantör</Label>
                  <Select value={newTransaction.customer} onValueChange={(value) => setNewTransaction({...newTransaction, customer: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kund" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Referens</Label>
                  <Input 
                    value={newTransaction.reference}
                    onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                    placeholder="F-001"
                  />
                </div>
              </div>
              <div>
                <Label>Beskrivning</Label>
                <Input 
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="Beskrivning av transaktionen"
                />
              </div>
              <div>
                <Label>Anteckningar</Label>
                <Textarea 
                  value={newTransaction.notes}
                  onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                  placeholder="Valfria anteckningar..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewTransactionDialog(false)}>
                  Avbryt
                </Button>
                <Button onClick={addNewTransaction} className="bg-green-600 hover:bg-green-700">
                  Lägg till
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transaktioner</TabsTrigger>
          <TabsTrigger value="bankimport">Bankmatchning</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totalt Transaktioner</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totala Intäkter</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalIncome.toLocaleString()} kr</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totala Utgifter</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} kr</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nettoresultat</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netIncome.toLocaleString()} kr
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Sök transaktioner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Alla typer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla typer</SelectItem>
                  <SelectItem value="income">Intäkter</SelectItem>
                  <SelectItem value="expense">Utgifter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Transaktionslista</h2>
            {filteredTransactions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Inga transaktioner</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Lägg till din första transaktion för att komma igång
                  </p>
                  <Button onClick={() => setShowNewTransactionDialog(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till transaktion
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{transaction.description}</CardTitle>
                          <CardDescription>
                            {transaction.date} • {transaction.customer} • {transaction.reference}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {transaction.type === "income" ? "Intäkt" : "Utgift"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Belopp:</span>
                          <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount.toLocaleString()} kr
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Konto:</span>
                          <p className="font-semibold">{transaction.account}</p>
                        </div>
                      </div>
                      
                      {transaction.notes && (
                        <div>
                          <p className="text-sm text-gray-600">{transaction.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteTransaction(transaction.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bankimport">
          <BankImport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transactions; 