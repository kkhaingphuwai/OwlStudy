import { useState, useEffect } from "react";
import api from "../../service/api";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface Student {
  id?: number;
  fullName?: string;
  email?: string;
  grade?: string;
  age?: number;
  assigned?: boolean;
  currentTutorID?: number;
}

interface AssignedStudentsResult {
  students: Student[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────
export function useAssignedStudents(tutorId: number | string): AssignedStudentsResult {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [trigger, setTrigger]   = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/tutors/assigned-students/1`);
        if (!cancelled) setStudents(res.data.data || []);
      } catch (err: any) {
        if (!cancelled)
          setError(err.response?.data?.message || "Failed to load students.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [tutorId, trigger]);

  function refetch() {
    setTrigger((t) => t + 1);
  }

  return { students, loading, error, refetch };
}