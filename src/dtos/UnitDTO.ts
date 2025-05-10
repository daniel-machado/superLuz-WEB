interface Counselor {
  id: string;
  counselor: {
    id: string;
    name: string;
    photoUrl: string
  };
}

interface Dbv {
  id: string;
  dbv: {
    id: string;
    name: string;
    photoUrl: string
  };
}

export interface Unit {
  id: string;
  name: string;
  photo?: string | null;
  createdAt?: string;
  updatedAt?: string;
  counselors?: Counselor[];
  dbvs?: Dbv[];
}