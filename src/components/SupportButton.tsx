import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  FileText, 
  X,
  ExternalLink
} from 'lucide-react';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';

const SupportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Skicka feedback',
      description: 'Rapportera problem eller förslag',
      action: () => {},
      component: <FeedbackForm />,
      color: 'text-blue-600'
    },
    {
      icon: FileText,
      title: 'FAQ',
      description: 'Vanliga frågor och svar',
      action: () => window.location.href = '/faq',
      color: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'E-post',
      description: 'support@bizpal.se',
      action: () => window.open('mailto:support@bizpal.se', '_blank'),
      color: 'text-purple-600'
    }
  ];

  return (
    <>
      {/* Floating Support Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Support Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80">
          <Card className="shadow-xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Behöver hjälp?</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {supportOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Icon className={`h-5 w-5 ${option.color}`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{option.title}</h4>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                      {option.component ? (
                        option.component
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={option.action}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    Support
                  </Badge>
                  <span>Vi svarar inom 24h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SupportButton; 