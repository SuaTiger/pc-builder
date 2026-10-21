import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const base =
  'inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-semibold ' +
  'disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-trace text-trace-ink hover:brightness-110',
  secondary: 'border border-line bg-surface hover:border-trace',
  ghost: 'text-muted hover:text-ink',
  danger: 'border border-line bg-surface text-fault hover:border-fault',
};

/** Class names for things that look like buttons but are links (<Link className={buttonClass()}>). */
export const buttonClass = (variant: ButtonVariant = 'secondary', extra = '') =>
  `${base} ${variants[variant]} ${extra}`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'secondary', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
