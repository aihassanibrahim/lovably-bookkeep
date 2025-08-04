import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign,
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Accounts = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      accountNumber: "1910",
      name: "Kassa",
      type: "asset",
      balance: 15000,
      description: "Kontanter i kassa",
      isActive: true
    },
    {
      id: 2,
      accountNumber: "1920",
      name: "Bankkonto",
      type: "asset",
      balance: 45000,
      description: "Bankkonto hos Swedbank",
      isActive: true
    },
    {
      id: 3,
      accountNumber: "3010",
      name: "Försäljning",
      type: "income",
      balance: 125000,
      description: "Intäkter från försäljning",
      isActive: true
    },
    {
      id: 4,
      accountNumber: "4010",
      name: "Inköp av varor",
      type: "expense",
      balance: -85000,
      description: "Kostnader för inköpta varor",
      isActive: true
    },
    {
      id: 5,
      accountNumber: "2440",
      name: "Leverantörsskulder",
      type: "liability",
      balance: -12000,
      description: "Skulder till leverantörer",
      isActive: true
    }
  ]);

  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [newAccount, setNewAccount] = useState({
    accountNumber: "",
    name: "",
    type: "",
    description: ""
  });

  const accountTypes = [
    { value: "asset", label: "Tillgångar", color: "bg-blue-100 text-blue-800" },
    { value: "liability", label: "Skulder", color: "bg-red-100 text-red-800" },
    { value: "equity", label: "Eget kapital", color: "bg-green-100 text-green-800" },
    { value: "income", label: "Intäkter", color: "bg-purple-100 text-purple-800" },
    { value: "expense", label: "Kostnader", color: "bg-orange-100 text-orange-800" }
  ];

  const addNewAccount = () => {
    const account = {
      id: Math.max(0, ...accounts.map(a => a.id)) + 1,
      accountNumber: newAccount.accountNumber,
      name: newAccount.name,
      type: newAccount.type,
      balance: 0,
      description: newAccount.description,
      isActive: true
    };

    setAccounts([...accounts, account]);
    setShowNewAccountDialog(false);
    setNewAccount({
      accountNumber: "",
      name: "",
      type: "",
      description: ""
    });
  };

  const deleteAccount = (id: number) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.includes(searchTerm);
    const matchesType = selectedType === "all" || account.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(a => a.isActive).length;
  const totalAssets = accounts.filter(a => a.type === "asset").reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === "liability").reduce((sum, a) => sum + Math.abs(a.balance), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Konton</h1>
          <p className="text-gray-600 mt-1">Hantera din kontoplan</p>
        </div>
        
        <Dialog open={showNewAccountDialog} onOpenChange={setShowNewAccountDialog}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Nytt Konto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Lägg till nytt konto</DialogTitle>
              <DialogDescription>
                Skapa ett nytt konto i kontoplanen
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Kontonummer</Label>
                  <Input 
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                    placeholder="1910"
                  />
                </div>
                <div>
                  <Label>Kontotyp</Label>
                  <Select value={newAccount.type} onValueChange={(value) => setNewAccount({...newAccount, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj typ" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Kontonamn</Label>
                <Input 
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  placeholder="Kassa"
                />
              </div>
              <div>
                <Label>Beskrivning</Label>
                <Input 
                  value={newAccount.description}
                  onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                  placeholder="Beskrivning av kontot..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewAccountDialog(false)}>
                  Avbryt
                </Button>
                <Button onClick={addNewAccount} className="bg-indigo-600 hover:bg-indigo-700">
                  Lägg till
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt Konton</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Konton</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAccounts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Tillgångar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAssets.toLocaleString()} kr</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Skulder</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalLiabilities.toLocaleString()} kr</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Sök konton..."
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
              {accountTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Kontoplan</h2>
        {filteredAccounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Inga konton</h3>
              <p className="text-gray-500 text-center mb-4">
                Lägg till ditt första konto för att komma igång
              </p>
              <Button onClick={() => setShowNewAccountDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Lägg till konto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <CardDescription>
                        {account.accountNumber} • {accountTypes.find(t => t.value === account.type)?.label}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={accountTypes.find(t => t.value === account.type)?.color}>
                        {accountTypes.find(t => t.value === account.type)?.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {account.balance.toLocaleString()} kr
                    </div>
                    <p className="text-sm text-gray-500">Saldo</p>
                  </div>
                  
                  {account.description && (
                    <div>
                      <p className="text-sm text-gray-600">{account.description}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteAccount(account.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts; 