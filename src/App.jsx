import { useState } from 'react'
import './App.css'

const recipes = [
  {
    id: 1,
    title: 'Kreminiai makaronai su grybais',
    tag: 'Pietūs',
    time: '30 min',
    servings: '2',
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Avokado skrebučiai su kiaušiniu',
    tag: 'Pusryčiai',
    time: '15 min',
    servings: '1',
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Lašiša su daržovėmis',
    tag: 'Vakarienė',
    time: '35 min',
    servings: '2',
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
  },
]

const categories = [
  { id: 'breakfast', label: 'Pusryčiai', icon: 'coffee' },
  { id: 'lunch', label: 'Pietūs', icon: 'utensils' },
  { id: 'dinner', label: 'Vakarienė', icon: 'bowl' },
  { id: 'snacks', label: 'Užkandžiai', icon: 'leaf' },
  { id: 'desserts', label: 'Desertai', icon: 'cupcake' },
  { id: 'healthy', label: 'Sveika mityba', icon: 'heart' },
]

const navLinks = [
  { href: '#', label: 'Pagrindinis', active: true },
  { href: '#receptai', label: 'Mano receptai' },
  { href: '#kategorijos', label: 'Kategorijos' },
  { href: '#apie', label: 'Apie' },
]

function LeafLogo() {
  return (
    <svg
      className="logo-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 20c1.2-3.8 4.2-6.8 8-8.2-1.5 4.2-3.8 7-8 8.2Z"
        fill="currentColor"
      />
      <path
        d="M12 20c-1.5-4.2-4.8-7.2-9-8.5 2 4 4.5 6.8 9 8.5Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M12 20c0-5.5 1.2-10.5 4.5-14.5-.8 4.2-2.2 8.2-4.5 14.5Z"
        fill="currentColor"
        opacity="0.45"
      />
      <path
        d="M12 20V8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Icon({ name }) {
  const icons = {
    search: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 2.5" strokeLinecap="round" />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="9" r="3.2" />
        <path d="M6 19c1.5-3 10.5-3 12 0" strokeLinecap="round" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8l-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L12 3.5Z" />
      </svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      </svg>
    ),
    home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m4 11 8-7 8 7v8a1 1 0 0 1-1 1h-5v-5H10v5H5a1 1 0 0 1-1-1v-8Z" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z" />
        <path d="M5 21.5A2.5 2.5 0 0 1 7.5 19H19" />
      </svg>
    ),
    coffee: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" />
        <path d="M16 10h2.5a2.5 2.5 0 0 1 0 5H16" />
        <path d="M8 3v2M11 2v3M14 3v2" strokeLinecap="round" />
      </svg>
    ),
    utensils: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 3v7a2 2 0 0 1-2 2v9" strokeLinecap="round" />
        <path d="M8 3c0 0 .5 3 0 5M6 3v5M10 3v5" strokeLinecap="round" />
        <path d="M16 3v18M16 3c2.5 0 4 2 4 5v2h-4" strokeLinecap="round" />
      </svg>
    ),
    bowl: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 11h16a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6Z" />
        <path d="M9 5c.5 1.5.5 3 0 4M12 4c.5 1.5.5 3 0 4M15 5c.5 1.5.5 3 0 4" strokeLinecap="round" />
      </svg>
    ),
    leaf: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 19c8-1 12-7 13-14-7 1-13 5-13 14Z" />
        <path d="M5 19c3-4 7-7 12-9" strokeLinecap="round" />
      </svg>
    ),
    cupcake: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 11h8l-1 8H9l-1-8Z" />
        <path d="M7 11c0-3 2-5 5-5s5 2 5 5" />
        <circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
      </svg>
    ),
  }

  return <span className="icon">{icons[name]}</span>
}

function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`Įvertinimas ${rating}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" />
      ))}
      <span className="rating-value">{rating}</span>
    </span>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [query, setQuery] = useState('')

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="page">
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="logo">
            <LeafLogo />
            <span>Recipe Book</span>
          </a>

          <nav className="nav-desktop" aria-label="Pagrindinė navigacija">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={link.active ? 'active' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button type="button" className="icon-btn search-btn" aria-label="Ieškoti">
              <Icon name="search" />
            </button>
            <button type="button" className="btn btn-outline">
              Prisijungti
            </button>
            <button type="button" className="btn btn-primary">
              Registruotis
            </button>
            <button
              type="button"
              className="icon-btn menu-btn"
              aria-label={menuOpen ? 'Uždaryti meniu' : 'Atidaryti meniu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="nav-mobile" aria-label="Mobilioji navigacija">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={link.active ? 'active' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="nav-mobile-actions">
              <button type="button" className="btn btn-outline">
                Prisijungti
              </button>
              <button type="button" className="btn btn-primary">
                Registruotis
              </button>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <p className="eyebrow">
                Sveiki atvykę <span className="eyebrow-line" aria-hidden="true" />
              </p>
              <h1>Mano receptų knyga</h1>
              <p className="hero-lead">
                Išsaugok, atrask ir kurk savo mėgstamus receptus vienoje vietoje.
              </p>

              <div className="hero-controls">
                <label className="search-field">
                  <Icon name="search" />
                  <input
                    type="search"
                    placeholder="Ieškoti receptų..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <button type="button" className="btn btn-primary btn-add">
                  <Icon name="plus" />
                  Pridėti receptą
                </button>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-circle">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section recipes-section" id="receptai">
          <div className="container">
            <div className="section-header">
              <h2>Populiarūs receptai</h2>
              <a href="#receptai" className="view-all">
                Peržiūrėti visus <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="recipe-grid">
              {recipes.map((recipe, index) => (
                <article
                  key={recipe.id}
                  className="recipe-card"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="recipe-image">
                    <img src={recipe.image} alt={recipe.title} loading="lazy" />
                    <button
                      type="button"
                      className={`fav-btn ${favorites.has(recipe.id) ? 'is-active' : ''}`}
                      aria-label={
                        favorites.has(recipe.id)
                          ? 'Pašalinti iš mėgstamų'
                          : 'Pridėti prie mėgstamų'
                      }
                      onClick={() => toggleFavorite(recipe.id)}
                    >
                      <Icon name="heart" />
                    </button>
                  </div>
                  <div className="recipe-body">
                    <span className="tag">{recipe.tag}</span>
                    <h3>{recipe.title}</h3>
                    <div className="recipe-meta">
                      <span>
                        <Icon name="clock" />
                        {recipe.time}
                      </span>
                      <span>
                        <Icon name="user" />
                        {recipe.servings}
                      </span>
                      <Stars rating={recipe.rating} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section categories-section" id="kategorijos">
          <div className="container">
            <div className="section-header">
              <h2>Kategorijos</h2>
            </div>

            <div className="category-grid">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  className="category-card"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <span className="category-icon">
                    <Icon name={category.icon} />
                  </span>
                  <span className="category-label">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-section" id="apie">
          <div className="container about-inner">
            <h2>Apie Recipe Book</h2>
            <p>
              Tai tavo asmeninė virtuvės erdvė — vieta, kurioje receptai
              surenkami, atrandami ir dalijami. Pradėk nuo mėgstamiausių
              patiekalų ir leisk kolekcijai augti kartu su tavimi.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a href="#" className="logo">
            <LeafLogo />
            <span>Recipe Book</span>
          </a>
          <p>© {new Date().getFullYear()} Recipe Book. Visi receptai — tavo.</p>
        </div>
      </footer>

      <nav className="bottom-nav" aria-label="Apatinė navigacija">
        <a href="#" className="active">
          <Icon name="home" />
          <span>Pagrindinis</span>
        </a>
        <a href="#receptai">
          <Icon name="book" />
          <span>Receptai</span>
        </a>
        <a href="#apie">
          <Icon name="user" />
          <span>Profilis</span>
        </a>
      </nav>
    </div>
  )
}

export default App
