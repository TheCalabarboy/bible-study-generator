/* ============================================
   REUSABLE UI COMPONENTS - Apple Design System
   ============================================ */

export function Input({ value, onChange, placeholder, type = 'text', style = {}, ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: 'var(--space-4)',
        fontSize: '16px',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-gray-900)',
        background: 'var(--color-white)',
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        transition: 'all var(--transition-fast)',
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--color-primary)';
        e.target.style.boxShadow = '0 0 0 4px rgba(0, 122, 255, 0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--color-gray-200)';
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    />
  );
}

export function Select({ value, onChange, children, style = {}, ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: 'var(--space-4)',
        fontSize: '16px',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-gray-900)',
        background: 'var(--color-white)',
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        transition: 'all var(--transition-fast)',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23636366' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right var(--space-4) center',
        paddingRight: 'var(--space-10)',
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--color-primary)';
        e.target.style.boxShadow = '0 0 0 4px rgba(0, 122, 255, 0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--color-gray-200)';
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    >
      {children}
    </select>
  );
}

export function Checkbox({ checked, onChange, label, description, style = {}, ...props }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        cursor: 'pointer',
        gap: 'var(--space-3)',
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        transition: 'background var(--transition-fast)',
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          width: '20px',
          height: '20px',
          marginTop: '2px',
          cursor: 'pointer',
          accentColor: 'var(--color-primary)',
          flexShrink: 0,
        }}
        {...props}
      />
      <div>
        <div style={{
          fontWeight: '500',
          fontSize: '16px',
          color: 'var(--color-gray-900)',
          marginBottom: description ? 'var(--space-1)' : 0,
        }}>
          {label}
        </div>
        {description && (
          <div style={{
            fontSize: '14px',
            color: 'var(--color-gray-600)',
            lineHeight: '1.5',
          }}>
            {description}
          </div>
        )}
      </div>
    </label>
  );
}

export function Button({ children, onClick, disabled, variant = 'primary', style = {}, ...props }) {
  const variants = {
    primary: {
      background: 'var(--color-gray-100)',
      color: 'var(--color-gray-900)',
      border: '1px solid var(--color-gray-200)',
    },
    secondary: {
      background: 'var(--color-white)',
      color: 'var(--color-gray-900)',
      border: '1px solid var(--color-gray-300)',
    },
    success: {
      background: 'var(--gradient-success)',
      color: 'var(--color-white)',
      border: 'none',
    },
    gradient: {
      background: 'var(--gradient-primary)',
      color: 'var(--color-white)',
      border: 'none',
    },
  };

  const variantStyle = variants[variant] || variants.primary;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: 'var(--space-4) var(--space-6)',
        fontSize: '17px',
        fontWeight: '600',
        fontFamily: 'var(--font-sans)',
        borderRadius: 'var(--radius-lg)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'opacity var(--transition-fast)',
        boxShadow: disabled ? 'none' : 'var(--shadow-sm)',
        opacity: disabled ? 0.5 : 1,
        ...variantStyle,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '0.8';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '1';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, style = {}, ...props }) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(var(--blur-md))',
        WebkitBackdropFilter: 'blur(var(--blur-md))',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-10)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Label({ children, style = {}, ...props }) {
  return (
    <label
      style={{
        display: 'block',
        fontSize: '15px',
        fontWeight: '600',
        color: 'var(--color-gray-900)',
        marginBottom: 'var(--space-2)',
        letterSpacing: '-0.01em',
        ...style,
      }}
      {...props}
    >
      {children}
    </label>
  );
}

export function ErrorMessage({ children, style = {}, ...props }) {
  return (
    <div
      style={{
        background: 'rgba(255, 59, 48, 0.08)',
        color: 'var(--color-error)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        fontSize: '15px',
        fontWeight: '500',
        border: '1px solid rgba(255, 59, 48, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        ...style,
      }}
      {...props}
    >
      <span style={{ fontSize: '18px' }}>⚠️</span>
      <span>{children}</span>
    </div>
  );
}

export function SuccessBanner({ children, style = {}, ...props }) {
  return (
    <div
      style={{
        background: 'var(--gradient-success)',
        color: 'var(--color-white)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        boxShadow: 'var(--shadow-lg)',
        ...style,
      }}
      {...props}
    >
      <span style={{ fontSize: '40px' }}>✅</span>
      <div>{children}</div>
    </div>
  );
}
