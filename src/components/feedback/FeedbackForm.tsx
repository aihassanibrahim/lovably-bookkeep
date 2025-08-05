import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Bug, Lightbulb, HelpCircle, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/components/ui/sonner';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const feedbackTypes = [
  { value: 'bug', label: 'Bug/Rapportera problem', icon: Bug, color: 'destructive' },
  { value: 'suggestion', label: 'Förslag på förbättring', icon: Lightbulb, color: 'default' },
  { value: 'question', label: 'Fråga', icon: HelpCircle, color: 'secondary' },
  { value: 'general', label: 'Allmän feedback', icon: MessageSquare, color: 'outline' },
];

const priorities = [
  { value: 'low', label: 'Låg', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Hög', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Kritisk', color: 'bg-red-100 text-red-800' },
];

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback_type: '',
    subject: '',
    description: '',
    priority: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let screenshotUrl = null;
      
      // Upload screenshot if provided
      if (screenshot) {
        const fileName = `feedback-screenshots/${user.id}/${Date.now()}-${screenshot.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('feedback-assets')
          .upload(fileName, screenshot);

        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('feedback-assets')
          .getPublicUrl(fileName);
        
        screenshotUrl = urlData.publicUrl;
      }

      // Submit feedback
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          name: formData.name || null,
          email: formData.email || null,
          feedback_type: formData.feedback_type,
          subject: formData.subject,
          description: formData.description,
          priority: formData.priority,
          screenshot_url: screenshotUrl,
          user_agent: navigator.userAgent,
        });

      if (error) throw error;

      toast.success('Tack för din feedback!', {
        description: 'Vi återkommer så snart som möjligt.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        feedback_type: '',
        subject: '',
        description: '',
        priority: 'medium',
      });
      setScreenshot(null);
      setScreenshotPreview(null);
      setShowForm(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error('Kunde inte skicka feedback', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Välj en bildfil');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Bilden är för stor. Max 5MB.');
      return;
    }

    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  const getFeedbackTypeIcon = (type: string) => {
    const feedbackType = feedbackTypes.find(ft => ft.value === type);
    return feedbackType ? feedbackType.icon : MessageSquare;
  };

  return (
    <Dialog open={showForm} onOpenChange={setShowForm}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Skicka feedback</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type Selection */}
          <div>
            <Label className="text-base font-medium">Vad handlar det om?</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, feedback_type: type.value }))}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      formData.feedback_type === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-2" />
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Namn (valfritt)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ditt namn"
              />
            </div>
            <div>
              <Label htmlFor="email">E-post (valfritt)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="din@email.se"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Ämne *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Kort beskrivning av problemet/förslaget"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority">Prioritet</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={priority.color}>
                        {priority.label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Beskrivning *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Beskriv problemet eller förslaget i detalj..."
              rows={6}
              required
            />
          </div>

          {/* Screenshot Upload */}
          <div>
            <Label>Screenshots (valfritt)</Label>
            <div className="mt-2">
              {screenshotPreview ? (
                <div className="relative">
                  <img
                    src={screenshotPreview}
                    alt="Screenshot preview"
                    className="max-w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeScreenshot}
                    className="absolute top-2 right-2"
                  >
                    Ta bort
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Ladda upp en skärmdump för att hjälpa oss förstå problemet
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <Label htmlFor="screenshot-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm">
                      Välj bild
                    </Button>
                  </Label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={loading}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={loading || !formData.feedback_type || !formData.subject || !formData.description}>
              {loading ? 'Skickar...' : 'Skicka feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 