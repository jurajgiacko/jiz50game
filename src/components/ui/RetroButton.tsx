'use client';

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function RetroButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: RetroButtonProps) {
  const baseStyles =
    'font-mono font-bold uppercase transition-all active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-orange-600 text-white border-4 border-orange-400 border-b-orange-800 border-r-orange-800 hover:bg-orange-500',
    secondary:
      'bg-gray-600 text-white border-4 border-gray-400 border-b-gray-800 border-r-gray-800 hover:bg-gray-500',
    success:
      'bg-green-600 text-white border-4 border-green-400 border-b-green-800 border-r-green-800 hover:bg-green-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base md:text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}
