
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  variant?: 'white' | 'red' | 'dark' | 'red-intense';
  className?: string;
  withSeparator?: boolean;
  separatorType?: 'thin' | 'thick' | 'gradient';
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  variant = 'white',
  className,
  withSeparator = false,
  separatorType = 'thin'
}) => {
  const variantClasses = {
    white: 'section-pattern-white',
    red: 'section-pattern-red',
    dark: 'section-pattern-dark',
    'red-intense': 'section-pattern-red-intense'
  };

  const separatorClasses = {
    thin: 'section-separator-red',
    thick: 'section-separator-red-thick',
    gradient: 'section-separator-red-gradient'
  };

  return (
    <>
      {withSeparator && <div className={separatorClasses[separatorType]} />}
      <section className={cn(variantClasses[variant], 'py-16', className)}>
        <div className="container mx-auto px-4">
          {children}
        </div>
      </section>
    </>
  );
};

export default SectionWrapper;
