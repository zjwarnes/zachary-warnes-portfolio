export const colors = {
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  background: {
    dark: 'var(--color-background-dark)',
    card: 'var(--color-background-card)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    accent: 'var(--color-text-accent)',
  },
  border: {
    primary: 'var(--color-border-primary)',
    hover: 'var(--color-border-hover)',
  },
}

export const commonStyles = {
  button: 
    'inline-flex items-center px-4 py-2 ' +
    'border border-transparent rounded-md shadow-sm ' +
    'text-sm font-medium ' +
    'bg-[var(--color-primary)] text-white ' +
    'hover:bg-[var(--color-primary-hover)] ' +
    'transition-colors duration-200',
  
  card: 
    'bg-[var(--color-background-card)] ' +
    'border border-[var(--color-border-primary)] ' +
    'hover:border-[var(--color-border-hover)] ' +
    'rounded-lg p-6 ' +
    'transition-all duration-200',
  
  container: 
    'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  gradientText: 
    'bg-clip-text text-transparent ' +
    'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]',
} 