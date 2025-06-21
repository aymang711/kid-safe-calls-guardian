
import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  phone: string;
  isEmergency?: boolean;
}

interface AdminPanelProps {
  contacts: Contact[];
  onAddContact: (name: string, phone: string) => void;
  onRemoveContact: (id: string) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  contacts, 
  onAddContact, 
  onRemoveContact, 
  onClose 
}) => {
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim() || !newPhone.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Name and phone number are required",
        variant: "destructive"
      });
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(newPhone.replace(/[\s\-\(\)]/g, ''))) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    onAddContact(newName.trim(), newPhone.trim());
    setNewName('');
    setNewPhone('');
  };

  const safeContacts = contacts.filter(c => !c.isEmergency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-400" size={32} />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Parent Control Panel
            </h1>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Kid Mode
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add New Contact */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="text-green-400" size={24} />
              <h2 className="text-xl font-bold text-white">Add Safe Contact</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">
                  Contact Name
                </Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter name (e.g., Grandpa)"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-white mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3"
              >
                <Plus size={20} className="mr-2" />
                Add Contact
              </Button>
            </form>
          </Card>

          {/* Current Contacts */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="text-blue-400" size={24} />
                <h2 className="text-xl font-bold text-white">Safe Contacts</h2>
              </div>
              <Badge className="bg-blue-500 text-white">
                {safeContacts.length} contacts
              </Badge>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {safeContacts.length === 0 ? (
                <p className="text-white/60 text-center py-8">
                  No contacts added yet. Add some safe contacts for your child.
                </p>
              ) : (
                safeContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div>
                      <h3 className="text-white font-semibold">{contact.name}</h3>
                      <p className="text-white/70 text-sm font-mono">{contact.phone}</p>
                    </div>
                    
                    <Button
                      onClick={() => onRemoveContact(contact.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-amber-500/10 border-amber-500/20 p-6">
          <div className="flex items-start gap-3">
            <Shield className="text-amber-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Security Notice</h3>
              <p className="text-white/80 text-sm">
                Your child can only call the contacts listed above plus emergency services (911). 
                All other numbers are automatically blocked. The admin password is: <code className="bg-white/10 px-2 py-1 rounded">parent123</code>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
