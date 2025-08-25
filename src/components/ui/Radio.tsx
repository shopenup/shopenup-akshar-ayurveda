import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

const Radio: React.FC<RadioProps> = ({
  options,
  value,
  onChange,
  name,
  label,
  disabled = false,
  required = false,
  className = '',
  direction = 'vertical',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const directionClasses = {
    horizontal: 'flex-row flex-wrap',
    vertical: 'flex-col',
  };

  const handleChange = (optionValue: string) => {
    if (!disabled) {
      onChange?.(optionValue);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className={`block ${labelSizeClasses[size]} font-medium text-gray-700 mb-2`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={`flex ${directionClasses[direction]} gap-3`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled || option.disabled}
              required={required}
              className={`${sizeClasses[size]} text-green-600 border-gray-300 focus:ring-green-500 focus:ring-2 ${
                disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            />
            <label className={`ml-2 ${labelSizeClasses[size]} text-gray-700 ${disabled || option.disabled ? 'opacity-50' : ''}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Radio;
