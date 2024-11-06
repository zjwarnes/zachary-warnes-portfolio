'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Container } from './container'

const navItems = {
  '/': {
    name: 'Home',
  },
  '/projects/llm': {
    name: 'LLM & RAG',
  },
  '/projects/vision': {
    name: 'Computer Vision',
  },
  '/projects/prediction': {
    name: 'Predictive Models',
  },
}

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background-dark)] py-4">
      <Container>
        <div className="bg-[var(--color-background-card)] rounded-lg p-4">
          <button 
            className="md:hidden p-2 hover:bg-[var(--color-border-hover)] rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <nav
            className={`
              md:flex
              ${isMenuOpen ? 'flex' : 'hidden'}
              flex-col md:flex-row
              items-start
              relative px-0 pb-0
              fade md:overflow-auto
              scroll-pr-6 md:relative
            `}
            id="nav"
          >
            <div className="flex flex-col md:flex-row md:space-x-2 w-full md:w-auto">
              {Object.entries(navItems).map(([path, { name }]) => {
                const isActive = pathname === path
                return (
                  <Link
                    key={path}
                    href={path}
                    className={`
                      transition-all duration-200
                      flex align-middle relative py-2 px-4
                      rounded-md w-full md:w-auto
                      ${isActive 
                        ? 'text-[var(--color-text-primary)] bg-[var(--color-border-hover)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border-hover)]'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </Container>
    </header>
  )
}
