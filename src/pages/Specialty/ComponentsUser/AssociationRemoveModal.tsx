
import { motion,  } from "framer-motion";
import Button from "../../../components/ui/button/Button";

enum StatusSpecialty {
  PENDING = 'pending',
  WAITING_BY_COUNSELOR = 'waiting_by_counselor',
  WAITING_BY_LEAD = 'waiting_by_lead',
  WAITING_BY_DIRECTOR = 'waiting_by_director',
  REJECTED_BY_COUNSELOR = 'rejected_by_counselor',
  REJECTED_BY_LEAD = 'rejected_by_lead',
  REJECTED_BY_DIRECTOR = 'rejected_by_director',
  APRROVED_BY_COUNSELOR = 'aprroved_by_counselor',
  APRROVED_BY_LEAD = 'aprroved_by_lead',
  APRROVED_BY_DIRECTOR = 'aprroved_by_director',
  APPROVED = 'approved',
}

interface SpecialtyUser {
  id: string;
  userId: string;
  specialtyId: string;
  approvalStatus: StatusSpecialty;
  report: any[];
  rejectionComments: any[];
  approvalComments: any[];
  isQuizApproved: boolean;
  counselorApproval: boolean;
  counselorApprovalAt: string | null;
  leadApproval: boolean;
  leadApprovalAt: string | null;
  directorApproval: boolean;
  directorApprovalAt: string | null;
  createdAt: string;
  updatedAt: string;
  specialtyUser: {
    name: string;
    photoUrl?: string;
  };
  specialtyInfo?: {
    name: string;
    category: string;
    imageUrl: string;
  };
}

export type SpecialtyAssociation = {
  userId: string;
  specialtyId: string;
};

interface AssociationModalProps {
  //isOpen: boolean; 
  onClose: () => void; 
  onRemove: () => void; 
  specialtyToRemove: SpecialtyUser; 
}

export default function AssociationRemoveModal({ 
  //isOpen, 
  onClose, 
  onRemove,
  specialtyToRemove 
}: AssociationModalProps) {

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Confirmar Remoção</h3>
      <p className="text-gray-300 mb-6">
        Tem certeza que deseja remover a especialidade <strong>{specialtyToRemove.specialtyInfo?.name}</strong> do desbravador <strong>{specialtyToRemove.specialtyUser?.name}</strong>?
        <br /><br />
        <span className="text-red-400">Esta ação não pode ser desfeita.</span>
      </p>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button
          //variant="secondary"
          onClick={() => onClose()}
        >
          Cancelar
        </Button>
        <Button
          //variant="danger"
          onClick={onRemove}
        >
          Remover
        </Button>
      </div>
    </motion.div>
  </motion.div>

  );
}












