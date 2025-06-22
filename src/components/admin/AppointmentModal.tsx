
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppointmentForm from './AppointmentForm';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  onCreateAppointment: (appointmentData: any) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onCreateAppointment,
}) => {
  const handleSubmit = (appointmentData: any) => {
    onCreateAppointment(appointmentData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-red-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <Calendar className="h-7 w-7" />
            Novo Agendamento
            {selectedDate && (
              <div className="flex items-center gap-2 text-red-100 text-lg ml-auto">
                <Clock className="h-5 w-5" />
                {format(selectedDate, 'dd/MM/yyyy')}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-2">
          <AppointmentForm
            initialDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
