export function Field({ label, error, hint, children, full = false }) {
  return (
    <div className={`field ${full ? 'field--full' : ''}`}>
      {label ? <span className="field__label">{label}</span> : null}
      {children}
      {error ? <span className="field__error">{error}</span>
        : hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return <input className={`input ${className}`} {...props} />;
}

export function Textarea({ className = '', rows = 4, ...props }) {
  return <textarea className={`input input--area ${className}`} rows={rows} {...props} />;
}

export function Select({ className = '', children, ...props }) {
  return <select className={`input ${className}`} {...props}>{children}</select>;
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" className={`toggle ${checked ? 'is-on' : ''}`}
      onClick={() => onChange(!checked)} aria-pressed={checked}>
      <span className="toggle__track"><span className="toggle__thumb" /></span>
      {label ? <span className="toggle__label">{label}</span> : null}
    </button>
  );
}

export function FormGrid({ children, cols = 2 }) {
  return <div className="form-grid" style={{ '--cols': cols }}>{children}</div>;
}
