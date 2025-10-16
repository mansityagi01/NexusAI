import { useEffect, useRef } from 'react';
import { Settings, Brain, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface LogEntry {
  message: string;
  agentName: string;
  timestamp: number;
}

interface TicketWorkflowProps {
  ticketId: string;
  subject: string;
  status: string;
  logs: LogEntry[];
}

export default function TicketWorkflow({ ticketId, subject, status, logs }: TicketWorkflowProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getAgentIcon = (agentName: string) => {
    if (agentName === 'System') return <Settings className="w-4 h-4" />;
    if (agentName === 'Master Agent') return <Brain className="w-4 h-4" />;
    if (agentName === 'PhishGuard Agent') return <Shield className="w-4 h-4" />;
    return <Settings className="w-4 h-4" />;
  };

  const getAgentColor = (agentName: string) => {
    if (agentName === 'System') return 'text-gray-400';
    if (agentName === 'Master Agent') return 'text-cyan-400';
    if (agentName === 'PhishGuard Agent') return 'text-emerald-400';
    return 'text-gray-400';
  };

  const getStatusBadge = () => {
    if (status === 'Resolved') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Resolved
        </span>
      );
    } else if (status === 'Escalated') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Escalated
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 animate-pulse">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
          Processing
        </span>
      );
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{ticketId}</h3>
          <p className="text-white/60 text-sm mt-1">{subject}</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="mt-6 space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 animate-slideUp"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`${getAgentColor(log.agentName)} mt-0.5`}>
              {getAgentIcon(log.agentName)}
            </div>
            <div className="flex-1">
              <div className="text-xs text-white/50 mb-1">{log.agentName}</div>
              <div className="text-white/90 text-sm">{log.message}</div>
            </div>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
