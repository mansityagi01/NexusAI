import { useSocket } from './hooks/useSocket';
import TicketForm from './components/TicketForm';
import TicketWorkflow from './components/TicketWorkflow';
import { Wifi, WifiOff } from 'lucide-react';

function App() {
  const { connected, tickets, createTicket } = useSocket();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-5xl font-bold">
              Nexus<span className="text-cyan-400">AI</span>
            </h1>
            <div className="flex items-center gap-2 ml-4">
              {connected ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-semibold">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400 font-semibold">Disconnected</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-white/60 text-lg">Autonomous IT Operations Dashboard</p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <TicketForm onCreateTicket={createTicket} />

          {tickets.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white/90">Active Workflows</h2>
              {tickets.map(ticket => (
                <TicketWorkflow
                  key={ticket.ticketId}
                  ticketId={ticket.ticketId}
                  subject={ticket.subject}
                  status={ticket.status}
                  logs={ticket.logs}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
