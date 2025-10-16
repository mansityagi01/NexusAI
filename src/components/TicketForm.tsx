import { useState } from 'react';
import { Plus } from 'lucide-react';

interface TicketFormProps {
  onCreateTicket: (subject: string) => void;
}

export default function TicketForm({ onCreateTicket }: TicketFormProps) {
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim()) {
      onCreateTicket(subject);
      setSubject('');
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-6">Create New Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter ticket subject (e.g., 'Suspicious email received')"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={!subject.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Ticket
        </button>
      </form>
    </div>
  );
}
