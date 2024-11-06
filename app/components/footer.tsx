import { Container } from './container'

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="py-8 mt-auto bg-[var(--color-background-dark)]">
      <Container>
        <div className="bg-[var(--color-background-card)] rounded-lg p-8">
          <ul className="font-sm flex flex-col space-x-0 space-y-2 md:flex-row md:space-x-4 md:space-y-0 text-[var(--color-text-secondary)]">
            {[
              { href: '/resume.pdf', label: 'Resume' },
              { href: 'https://github.com/zjwarnes', label: 'GitHub' },
              { href: 'https://zjwarnes.medium.com/', label: 'Medium' },
              { href: 'https://linkedin.com/in/zjwarnes', label: 'LinkedIn' },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  className="flex items-center transition-all duration-200 hover:text-[var(--color-text-primary)]"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={href}
                >
                  <ArrowIcon />
                  <p className="ml-2 h-7">{label}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
