import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, FileType } from 'lucide-react';
import { toast } from 'sonner';

interface ExportData {
  transactions: any[];
  invoices: any[];
  customers: any[];
  suppliers: any[];
}

interface ExportFunctionsProps {
  data: ExportData;
}

const ExportFunctions: React.FC<ExportFunctionsProps> = ({ data }) => {
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('Ingen data att exportera');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          const escaped = String(value).replace(/"/g, '""');
          return escaped.includes(',') ? `"${escaped}"` : escaped;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${filename}.csv exporterad`);
  };

  const exportToSIE = (transactions: any[]) => {
    if (transactions.length === 0) {
      toast.error('Ingen transaktionsdata att exportera');
      return;
    }

    const sieContent = [
      '#FLAGGA 0',
      '#PROGRAM "BizPal" 1.0',
      '#FORMAT PC8',
      '#GEN "2024-01-01" "BizPal Export"',
      '#SIETYP 4',
      '#FNAMN "BizPal Företag AB"',
      '#ORGNR "123456-7890"',
      '#KPTYP "EUBAS97"',
      '#VALUTA SEK',
      '#KONTO 1910 "Kassa"',
      '#KONTO 1920 "Bankkonto"',
      '#KONTO 3010 "Leverantörsskulder"',
      '#KONTO 3740 "Utgående moms"',
      '#KONTO 3740 "Ingående moms"',
      '#KONTO 3011 "Försäljning"',
      '#KONTO 4010 "Inköp av varor"',
      ...transactions.map(t => {
        const date = t.transaction_date || t.date;
        const amount = Math.abs(t.amount);
        const account = t.type === 'income' ? '3011' : '4010';
        const description = t.description || 'Transaktion';
        
        return `#VER "${date}" "${description}"`;
      }),
      ...transactions.map(t => {
        const amount = Math.abs(t.amount);
        const account = t.type === 'income' ? '3011' : '4010';
        const contraAccount = t.type === 'income' ? '1920' : '1920';
        
        return [
          `{ "${account}" ${t.type === 'income' ? amount : -amount}`,
          `  "${contraAccount}" ${t.type === 'income' ? -amount : amount}`,
          '}'
        ].join('\n');
      })
    ].join('\n');

    const blob = new Blob([sieContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bizpal_export.sie');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('SIE-fil exporterad');
  };

  const exportToPDF = (data: any[], filename: string, type: string) => {
    // Simulerad PDF-export (i verkligheten skulle du använda jsPDF eller liknande)
    toast.info(`PDF-export för ${type} kommer snart`);
    
    // Här skulle du implementera faktisk PDF-generering
    // Till exempel med jsPDF:
    /*
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';
    
    const doc = new jsPDF();
    doc.text(`${type} - ${new Date().toLocaleDateString('sv-SE')}`, 20, 20);
    
    const tableData = data.map(item => Object.values(item));
    const headers = Object.keys(data[0]);
    
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
    });
    
    doc.save(`${filename}.pdf`);
    */
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Export-funktioner</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Transaktioner */}
        <div className="space-y-2">
          <h4 className="font-medium">Transaktioner</h4>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(data.transactions, 'transaktioner')}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToSIE(data.transactions)}
              className="flex-1"
            >
              <FileType className="h-4 w-4 mr-1" />
              SIE
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToPDF(data.transactions, 'transaktioner', 'Transaktioner')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        {/* Fakturor */}
        <div className="space-y-2">
          <h4 className="font-medium">Fakturor</h4>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(data.invoices, 'fakturor')}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToPDF(data.invoices, 'fakturor', 'Fakturor')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        {/* Kunder */}
        <div className="space-y-2">
          <h4 className="font-medium">Kunder</h4>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(data.customers, 'kunder')}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToPDF(data.customers, 'kunder', 'Kunder')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        {/* Leverantörer */}
        <div className="space-y-2">
          <h4 className="font-medium">Leverantörer</h4>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(data.suppliers, 'leverantorer')}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToPDF(data.suppliers, 'leverantorer', 'Leverantörer')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p><strong>CSV:</strong> Komma-separerade värden för import i Excel</p>
        <p><strong>SIE:</strong> Standard för import i svenska bokföringsprogram</p>
        <p><strong>PDF:</strong> Skrivbara rapporter (kommer snart)</p>
      </div>
    </div>
  );
};

export default ExportFunctions; 