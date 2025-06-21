
import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Contact {
  id: string;
  name: string;
  phone: string;
  isEmergency?: boolean;
}

interface EmergencyButtonProps {
  onCall: (contact: Contact) => void;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onCall }) => {
  const emergencyContact: Contact = {
    id: '911',
    name: 'Emergency',
    phone: '911',
    isEmergency: true
  };

  return (
    <Card className="bg-gradient-to-r from-red-500 to-red-600 border-0 shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-white animate-pulse" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Emergency</h3>
              <p className="text-white/80">Call 911 for help</p>
            </div>
          </div>
          
          <Button
            onClick={() => onCall(emergencyContact)}
            className="bg-white hover:bg-gray-100 text-red-600 rounded-xl px-8 py-4 font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Phone size={24} />
            CALL 911
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EmergencyButton;
