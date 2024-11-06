type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Container({ 
  children, 
  className = '', 
  as: Component = 'div' 
}: ContainerProps) {
  return (
    <Component 
      className={`
        w-full mx-auto px-6
        max-w-[95%]
        ${className}
      `}
    >
      {children}
    </Component>
  )
} 