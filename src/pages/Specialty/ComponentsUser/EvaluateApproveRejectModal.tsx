


import { motion,  } from "framer-motion";
import Button from "../../../components/ui/button/Button";
import { useState } from "react";

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
  isOpen: boolean;
  onClose: () => void;
  specialty: SpecialtyUser;
  approve: (approvalComment: string) => void;
  reject: (approvalComment: string) => void
}

export default function EvaluateApproveRejectModal({
  //isOpen, 
  onClose,
  specialty,
  approve,
  reject
}: AssociationModalProps) {

  const [approvalComment, setApprovalComment] = useState("");

  const onApprove = () => {
    approve(approvalComment)
  }
  const onReject= () => {
    reject(approvalComment)
  }


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
        <h3 className="text-xl font-semibold text-white mb-4">
          Avaliar Especialidade
        </h3>
        <p className="text-gray-300 mb-2">
          Avaliando {specialty.specialtyInfo?.name} para {specialty.specialtyUser?.name}
        </p>
        
        {specialty.report.length > 0 && (
          <div className="mb-4 bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Relatório do desbravador:</h4>
            <p className="text-sm text-gray-300">{specialty.report}</p>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Comentário
          </label>
          <textarea
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y min-h-[100px]"
            placeholder="Adicione um comentário sobre sua decisão..."
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            //variant="secondary"
            onClick={() => {
              onClose()
              setApprovalComment("");
            }}
          >
            Cancelar
          </Button>
          <Button
            //variant="danger"
            onClick={onReject}
            disabled={!approvalComment.trim()}
          >
            Rejeitar
          </Button>
          <Button
            //variant="success"
            onClick={onApprove}
            disabled={!approvalComment.trim()}
          >
            Aprovar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
