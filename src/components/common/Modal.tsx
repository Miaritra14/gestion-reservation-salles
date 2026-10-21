
import type { ReactNode } from "react";

interface ModalProps {
  titre: string;
  ouvert: boolean;
  onFermer: () => void;
  children: ReactNode;
}

function Modal({
  titre,
  ouvert,
  onFermer,
  children,
}: ModalProps) {
  // Ne pas afficher la fenêtre si elle est fermée
  if (!ouvert) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onFermer}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titre"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="modal-titre" className="text-xl font-bold text-gray-800">
            {titre}
          </h2>

          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer la fenêtre"
            className="text-2xl text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
