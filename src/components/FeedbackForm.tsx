import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Form validation schema
const feedbackSchema = z.object({
  name: z.string().min(2, 'Namnet måste vara minst 2 tecken'),
  email: z.string().email('Ange en giltig e-postadress'),
  message: z.string().min(10, 'Meddelandet måste vara minst 10 tecken'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  className?: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ className }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    
    try {
      // Insert feedback into Supabase
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            name: data.name,
            email: data.email,
            message: data.message,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        throw error;
      }

      // Show success message
      toast({
        title: 'Tack för din feedback!',
        description: 'Vi tar gärna emot dina tankar för att göra BizPal ännu bättre.',
      });

      // Reset form and show success state
      form.reset();
      setIsSubmitted(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      toast({
        title: 'Något gick fel',
        description: 'Kunde inte skicka feedback. Försök igen senare.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Tack för din feedback!</h3>
          <p className="text-gray-600">
            Vi tar gärna emot dina tankar för att göra BizPal ännu bättre.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <MessageSquare className="w-12 h-12 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Hjälp oss bygga BizPal
        </CardTitle>
        <CardDescription className="text-lg">
          Vi vill gärna höra vad du tycker och hur vi kan förbättra systemet.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ditt namn" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="din@e-post.se" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meddelande</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Berätta vad du tycker om BizPal, vad som fungerar bra och vad vi kan förbättra..."
                      className="min-h-[120px] resize-none"
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Skickar...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Skicka feedback
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Din feedback hjälper oss att göra BizPal bättre för alla användare.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 