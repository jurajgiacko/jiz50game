'use client';

interface RetroInputProps {
  label: string;
  type?: 'text' | 'email';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function RetroInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}: RetroInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-300 font-mono text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="bg-white text-gray-900 placeholder-gray-500 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}

interface RetroCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function RetroCheckbox({ label, checked, onChange }: RetroCheckboxProps) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 mt-0.5 accent-orange-500"
      />
      <span className="text-gray-300 text-sm">{label}</span>
    </label>
  );
}
