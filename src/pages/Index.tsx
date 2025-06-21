import React, { useState, useEffect } from 'react';
import { Phone, Settings, Shield, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import AdminPanel from '@/components/AdminPanel';
import ContactCard from '@/components/ContactCard';
import EmergencyButton from '@/components/EmergencyButton';
import { supabase } from '@/integrations/supabase/client';

interface Contact {
  id: string;
  name: string;
  phone: string;
  isEmergency?: boolean;
}

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCall, setCurrentCall] = useState<Contact | null>(null);

  // Load contacts from Supabase
  const loadContacts = async () => {
    try {
      console.log('Loading contacts from Supabase...');
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading contacts:', error);
        toast({
          title: "Error loading contacts",
          description: error.message,
          variant: "destructive"
        });
        // Fallback to default contacts if database fails
        setContacts([
          { id: '1', name: 'Mom', phone: '+1234567890' },
          { id: '2', name: 'Dad', phone: '+1234567891' },
          { id: '3', name: 'Grandma', phone: '+1234567892' },
          { id: '911', name: 'Emergency', phone: '911', isEmergency: true },
        ]);
      } else {
        console.log('Loaded contacts from database:', data);
        const formattedContacts = data.map(contact => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          isEmergency: contact.is_emergency || false
        }));
        setContacts(formattedContacts);
      }
    } catch (error) {
      console.error('Exception loading contacts:', error);
      // Fallback to default contacts
      setContacts([
        { id: '1', name: 'Mom', phone: '+1234567890' },
        { id: '2', name: 'Dad', phone: '+1234567891' },
        { id: '3', name: 'Grandma', phone: '+1234567892' },
        { id: '911', name: 'Emergency', phone: '911', isEmergency: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleCall = (contact: Contact) => {
    console.log(`Attempting to call ${contact.name} at ${contact.phone}`);
    setCurrentCall(contact);
    
    toast({
      title: `Calling ${contact.name}`,
      description: `Dialing ${contact.phone}...`,
    });

    // Simulate call duration
    setTimeout(() => {
      setCurrentCall(null);
    }, 5000);
  };

  const handleEndCall = () => {
    setCurrentCall(null);
    toast({
      title: "Call ended",
      description: "Have a great day!",
    });
  };

  const addContact = async (name: string, phone: string) => {
    try {
      console.log('Adding contact to database:', { name, phone });
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          { name, phone, is_emergency: false }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding contact:', error);
        toast({
          title: "Error adding contact",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Contact added successfully:', data);
      const newContact: Contact = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        isEmergency: data.is_emergency || false
      };
      
      setContacts(prev => [...prev, newContact]);
      toast({
        title: "Contact added",
        description: `${name} has been added to safe contacts`,
      });
    } catch (error) {
      console.error('Exception adding contact:', error);
      toast({
        title: "Error adding contact",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const removeContact = async (id: string) => {
    // Don't allow removing emergency contacts
    const contactToRemove = contacts.find(c => c.id === id);
    if (contactToRemove?.isEmergency) {
      toast({
        title: "Cannot remove emergency contact",
        description: "Emergency contacts cannot be deleted",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Removing contact from database:', id);
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing contact:', error);
        toast({
          title: "Error removing contact",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Contact removed successfully');
      setContacts(prev => prev.filter(contact => contact.id !== id));
      toast({
        title: "Contact removed",
        description: "Contact has been removed from safe list",
      });
    } catch (error) {
      console.error('Exception removing contact:', error);
      toast({
        title: "Error removing contact",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const authenticateAdmin = (password: string) => {
    // Simple password check - in real app, use proper authentication
    if (password === 'parent123') {
      setIsAuthenticated(true);
      setShowAdmin(true);
      toast({
        title: "Admin access granted",
        description: "You can now manage contacts",
      });
    } else {
      toast({
        title: "Wrong password",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kid-blue to-kid-purple flex items-center justify-center">
        <Card className="p-8 text-center bg-white/95 backdrop-blur-sm shadow-2xl">
          <Shield className="mx-auto mb-4 text-kid-green animate-spin" size={48} />
          <h2 className="text-xl font-bold text-gray-800">Loading Safe Caller...</h2>
        </Card>
      </div>
    );
  }

  if (currentCall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kid-blue to-kid-purple flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center bg-white/95 backdrop-blur-sm shadow-2xl">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-kid-green rounded-full mx-auto flex items-center justify-center animate-pulse-ring">
              <Phone size={48} className="text-white" />
            </div>
            <div className="absolute inset-0 w-32 h-32 bg-kid-green/30 rounded-full mx-auto animate-pulse-ring animation-delay-75"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Calling</h2>
          <p className="text-xl text-kid-blue mb-2">{currentCall.name}</p>
          <p className="text-gray-600 mb-8">{currentCall.phone}</p>
          
          <Button
            onClick={handleEndCall}
            className="w-20 h-20 rounded-full bg-kid-red hover:bg-red-600 text-white shadow-lg"
          >
            <PhoneOff size={32} />
          </Button>
        </Card>
      </div>
    );
  }

  if (showAdmin) {
    return (
      <AdminPanel
        contacts={contacts}
        onAddContact={addContact}
        onRemoveContact={removeContact}
        onClose={() => {
          setShowAdmin(false);
          setIsAuthenticated(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kid-blue via-kid-purple to-kid-pink p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Shield className="text-kid-green animate-bounce-gentle" size={32} />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Safe Caller
            </h1>
          </div>
          
          <Button
            onClick={() => {
              const password = prompt('Enter admin password:');
              if (password) {
                authenticateAdmin(password);
              }
            }}
            variant="ghost"
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <Settings size={24} />
          </Button>
        </div>

        {/* Emergency Button */}
        <div className="mb-8">
          <EmergencyButton onCall={handleCall} />
        </div>

        {/* Safe Contacts Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Phone className="text-kid-green" size={24} />
            Safe Contacts
          </h2>
          <Badge className="bg-kid-green text-white px-3 py-1 rounded-full">
            {contacts.filter(c => !c.isEmergency).length} contacts
          </Badge>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.filter(contact => !contact.isEmergency).map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onCall={() => handleCall(contact)}
            />
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="text-center text-white">
            <Shield className="mx-auto mb-4 text-kid-green" size={48} />
            <h3 className="text-xl font-bold mb-2">Protected Calling</h3>
            <p className="text-white/80">
              You can only call the safe contacts approved by your parents. 
              Emergency numbers are always available.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
