import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MoreVertical, 
  Mail, 
  GraduationCap, 
  BookOpen,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  grade: string;
  avatar: string;
  status: 'Active' | 'Inactive' | 'On Leave';
}

interface StudentListProps {
  initialStudents?: Student[];
}

export const StudentListUI: React.FC<StudentListProps> = ({ initialStudents = [] }) => {
  const [students] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'major'>('name');

  const filteredStudents = useMemo(() => {
    return students
      .filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }, [students, searchQuery, sortBy]);

  const stats = useMemo(() => ({
    total: students.length,
    active: students.filter(s => s.status === 'Active').length,
    onLeave: students.filter(s => s.status === 'On Leave').length,
  }), [students]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard 
          icon={<Users className="text-indigo-600" />} 
          label="Total Students" 
          value={stats.total} 
          trend="+12% from last term"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          label="Active Now" 
          value={stats.active} 
          trend="94% attendance rate"
        />
        <StatCard 
          icon={<Clock className="text-amber-600" />} 
          label="On Leave" 
          value={stats.onLeave} 
          trend="3 returning next week"
        />
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block mx-1" />

          <button 
            onClick={() => setSortBy(sortBy === 'name' ? 'major' : 'name')}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-600"
          >
            <ArrowUpDown size={16} />
            <span>Sort by {sortBy === 'name' ? 'Major' : 'Name'}</span>
          </button>

          <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium text-sm">
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Student List Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Major</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{student.name}</div>
                            <div className="text-xs text-slate-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 font-medium">{student.major}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">{student.grade}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-500">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Users size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No students enrolled</h3>
          <p className="text-slate-500 max-w-xs text-center">Get started by adding your first student to the directory.</p>
        </div>
      )}
    </div>
  );
};

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: number, trend: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-slate-50 rounded-lg">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold text-slate-900">{value}</span>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">{trend}</span>
      </div>
    </div>
  );
}

const StudentCard: React.FC<{ student: Student }> = ({ student }) => {
  return (
   <motion.div 
      whileHover={{ 
        y: -4, 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' 
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <img 
          src={student.avatar} 
          alt={student.name} 
          className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-50"
          referrerPolicy="no-referrer"
        />
        <StatusBadge status={student.status} />
      </div>

      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{student.name}</h3>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Mail size={12} />
          <span className="truncate">{student.email}</span>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <BookOpen size={14} className="text-slate-300" />
            <span>Major</span>
          </div>
          <span className="font-bold text-slate-700">{student.major}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <GraduationCap size={14} className="text-slate-300" />
            <span>Grade</span>
          </div>
          <span className="font-bold text-slate-700">{student.grade}</span>
        </div>
      </div>
      
      <button className="w-full mt-5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
        View Profile
      </button>
    </motion.div>
  );
};

function StatusBadge({ status }: { status: Student['status'] }) {
  const styles = {
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Inactive': 'bg-slate-100 text-slate-600 border-slate-200',
    'On Leave': 'bg-amber-50 text-amber-700 border-amber-100'
  };

  return (
    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-tight ${styles[status]}`}>
      {status}
    </span>
  );
}

