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
        w-full mx-auto px-4
        sm:max-w-screen-sm 
        md:max-w-screen-md md:px-6
        lg:max-w-screen-lg lg:px-8
        xl:max-w-screen-xl
        ${className}
      `}
    >
      {children}
    </Component>
  )
} 