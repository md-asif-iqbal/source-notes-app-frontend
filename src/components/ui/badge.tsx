import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80',
        secondary:
          'border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200/80',
        destructive:
          'border-transparent bg-red-100 text-red-700 hover:bg-red-200',
        outline: 'border-slate-200 text-slate-950',
        admin:
          'border-amber-300 bg-amber-50 text-amber-900 font-bold uppercase tracking-wider text-[10px]',
        user:
          'border-blue-200 bg-blue-50 text-blue-700 font-semibold uppercase tracking-wider text-[10px]',
        tag:
          'border-slate-200 bg-slate-50 text-slate-600 font-normal hover:bg-slate-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
