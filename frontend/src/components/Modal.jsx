import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`modal modal--${size}`} role="dialog" aria-modal="true">
        <div className="modal__head">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__foot">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}

export function ConfirmDialog({
  open, title = 'Are you sure?', message = 'This action cannot be undone.',
  confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel, danger = true,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm"
      footer={
        <>
          <button className="btn btn--ghost" onClick={onCancel}>{cancelText}</button>
          <button className={danger ? 'btn btn--danger' : 'btn btn--primary'} onClick={onConfirm}>
            {confirmText}
          </button>
        </>
      }
    >
      <p className="muted">{message}</p>
    </Modal>
  );
}
