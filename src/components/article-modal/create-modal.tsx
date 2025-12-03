import React, { type ReactNode, useEffect } from 'react';
import './create-modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
