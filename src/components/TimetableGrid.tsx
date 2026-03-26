import { useTimetableStore } from '@/store/timetableStore';
import { DAYS, DEFAULT_TIME_SLOTS } from '@/types/timetable';
import { cn } from '@/lib/utils';

export function TimetableGrid() {
  const { timetableEntries, subjects, faculty, rooms, selectedClass, isGenerated } = useTimetableStore();

  const classEntries = timetableEntries.filter(e => e.classId === selectedClass);

  if (!isGenerated) {
    return (
      <div className="glass-card rounded-xl p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
          <span className="text-2xl">📅</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">No Timetable Generated</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Go to the Dashboard and click "Generate Timetable" to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="gradient-primary">
              <th className="px-3 py-3 text-left text-xs font-semibold text-primary-foreground border-r border-primary-foreground/10 w-24">
                Day / Time
              </th>
              {DEFAULT_TIME_SLOTS.map((slot, index) => (
                <th key={`header-${index}`} className="px-3 py-3 text-center text-xs font-semibold text-primary-foreground border-r border-primary-foreground/10 last:border-r-0 whitespace-nowrap">
                  {slot.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Added dayIndex so we know which row is the very first one */}
            {DAYS.map((day, dayIndex) => (
              <tr key={day} className="border-b border-border last:border-b-0">
                <td className="px-3 py-4 text-xs font-bold text-muted-foreground border-r border-border bg-muted/10 whitespace-nowrap">
                  {day}
                </td>
                
                {DEFAULT_TIME_SLOTS.map((slot, index) => {
                  
                  // --- NEW VERTICAL BREAK/LUNCH LOGIC ---
                  if (slot.isBreak) {
                    // If it is Monday (row 0), draw a massive cell that stretches down 6 rows
                    if (dayIndex === 0) {
                      return (
                        <td 
                          key={`break-${day}-${index}`} 
                          rowSpan={DAYS.length} 
                          className="px-2 py-2 text-center align-middle bg-muted/5 border-r border-border last:border-r-0"
                        >
                          <div className="flex items-center justify-center h-full">
                            <span 
                              className="text-muted-foreground/40 font-bold uppercase tracking-[0.5em] text-sm"
                              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                            >
                              {slot.label}
                            </span>
                          </div>
                        </td>
                      );
                    }
                    // For Tuesday through Saturday, don't draw anything here because Monday's cell is covering it!
                    return null;
                  }
                  // ---------------------------------------

                  const entry = classEntries.find(e => e.day === day && e.slotIndex === slot.index);
                  
                  if (!entry) {
                    return <td key={`empty-${day}-${index}`} className="px-2 py-2 border-r border-border last:border-r-0 min-w-[140px]" />;
                  }

                  const sub = subjects.find(s => s.id === entry.subjectId);
                  const fac = faculty.find(f => f.id === entry.facultyId);
                  const room = rooms.find(r => r.id === entry.roomId);

                  return (
                    <td key={`entry-${day}-${index}`} className="px-1.5 py-1.5 border-r border-border last:border-r-0 min-w-[140px]">
                      <div
                        className={cn(
                          'rounded-lg px-2 py-2 text-xs border transition-all hover:scale-[1.02] h-full min-h-[70px] flex flex-col justify-center',
                          entry.isLab ? 'slot-lab' : 'slot-theory'
                        )}
                        style={sub?.color ? {
                          backgroundColor: `${sub.color}15`,
                          borderColor: `${sub.color}40`,
                          color: sub.color,
                        } : undefined}
                      >
                        <p className="font-semibold truncate mb-1">{sub?.name || 'N/A'}</p>
                        <p className="truncate opacity-80">{fac?.shortCode}</p>
                        <p className="truncate opacity-60">{room?.roomNumber}</p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}