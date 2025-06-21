
import React from 'react';
import { Phone, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Contact {
  id: string;
  name: string;
  phone: string;
  isEmergency?: boolean;
}

interface ContactCardProps {
  contact: Contact;
  onCall: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onCall }) => {
  const getContactColor = (name: string) => {
    const colors = ['kid-blue', 'kid-green', 'kid-orange', 'kid-purple', 'kid-pink'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const colorClass = getContactColor(contact.name);

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className={`w-16 h-16 bg-${colorClass} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
            <User className="text-white" size={28} />
          </div>
          
          {/* Contact Info */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.name}</h3>
          <p className="text-gray-600 text-sm mb-4 font-mono">{contact.phone}</p>
          
          {/* Call Button */}
          <Button
            onClick={onCall}
            className={`w-full bg-${colorClass} hover:opacity-90 text-white rounded-xl py-3 px-6 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2`}
          >
            <Phone size={20} />
            Call {contact.name}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;
