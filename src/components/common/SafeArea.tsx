import React from 'react';

interface SafeAreaProps {
  children: React.ReactNode;
  className?: string;
  topOnly?: boolean;
  bottomOnly?: boolean;
}

/**
 * SafeArea wrapper component to handle hardware notches, physical camera cutouts,
 * and device system bars without duplicating Android/iOS status bars.
 */
export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  className = '',
  topOnly = false,
  bottomOnly = false
}) => {
  const topPadding = !bottomOnly ? 'pt-[max(env(safe-area-inset-top,0px),0px)]' : '';
  const bottomPadding = !topOnly ? 'pb-[max(env(safe-area-inset-bottom,0px),0px)]' : '';

  return (
    <div className={`w-full ${topPadding} ${bottomPadding} ${className}`}>
      {children}
    </div>
  );
};
