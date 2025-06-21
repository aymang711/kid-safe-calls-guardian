
import React, { useState, useEffect } from 'react';
import { Phone, Settings, Shield, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import AdminPanel from '@/components/AdminPanel';
import ContactCard from '@/components/ContactCard';
import EmergencyButton from '@/components/EmergencyButton';

interface Contact {
  id: string;
  name: string;
  phone: string;
  isEmergency?: boolean;
}

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Mom', phone: '+1234567890' },
    { id: '2', name: 'Dad', phone: '+1234567891' },
    { id: '3', name: 'Grandma', phone: '+1234567892' },
    { id: '911', name: 'Emergency', phone: '911', isEmergency: true },
  ]);
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCall, setCurrentCall] = useState<Contact | null>(null);

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

  const addContact = (name: string, phone: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phone
    };
    setContacts(prev => [...prev, newContact]);
    toast({
      title: "Contact added",
      description: `${name} has been added to safe contacts`,
    });
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id && !contact.isEmergency));
    toast({
      title: "Contact removed",
      description: "Contact has been removed from safe list",
    });
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
