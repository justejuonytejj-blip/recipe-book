import { useEffect, useState } from 'react'
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
    openable: true,
    ingredients: [
      { amount: '250 g', name: 'fetučini arba spagečių' },
      { amount: '300 g', name: 'šviežių pievagrybių' },
      { amount: '1 vnt.', name: 'svogūnas' },
      { amount: '2 skiltelės', name: 'česnako' },
      { amount: '200 ml', name: 'grietinėlės (20–30 %)' },
      { amount: '40 g', name: 'sviesto' },
      { amount: '50 g', name: 'parmezano' },
      { amount: '2 v. š.', name: 'alyvuogių aliejaus' },
      { amount: 'pagal skonį', name: 'druska, pipirai, šviežia petražolė' },
    ],
    steps: [
      'Užvirinkite sūrų vandenį ir išvirkite makaronus pagal pakuotės nurodymus iki „al dente“. Prieš nupildami, atidėkite apie 100 ml virimo vandens.',
      'Kol makaronai verda, grybus nuplaukite, nusausinkite ir supjaustykite plonais griežinėliais. Svogūną smulkiai sukapokite, česnaką – plonais griežinėliais.',
      'Keptuvėje įkaitinkite alyvuogių aliejų su sviestu. Suberkite svogūną ir kepkite 2–3 min., kol jis taps skaidrus.',
      'Įdėkite grybus ir kepkite vidutine ugnimi 6–8 min., kol jie apskrus ir išgarins skysčius. Įberkite česnaką ir kepkite dar 1 minutę.',
      'Įpilkite grietinėlę, sumažinkite ugnį ir troškinkite 3–4 min., kol padažas šiek tiek sutirštės. Pagardinkite druska ir juodaisiais pipirais.',
      'Į keptuvę sudėkite nupiltus makaronus, suberkite tarkuotą parmezaną ir, jei reikia, įpilkite šiek tiek atidėto virimo vandens. Maišykite, kol padažas apgaubs makaronus.',
      'Patiekite iškart, pabarstę smulkinta petražole ir papildomu parmezanu.',
    ],
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
    openable: true,
    ingredients: [
      { amount: '2 riekės', name: 'rūgštinės duonos (pvz. sourdough)' },
      { amount: '1 vnt.', name: 'prinokęs avokadas' },
      { amount: '1–2 vnt.', name: 'kiaušiniai' },
      { amount: '1 šaukštelis', name: 'citrinos sulčių' },
      { amount: '1 šaukštelis', name: 'alyvuogių aliejaus' },
      { amount: 'žiupsnelis', name: 'druskos ir juodųjų pipirų' },
      { amount: 'pagal skonį', name: 'čili dribsniai arba šviežios žolelės' },
    ],
    steps: [
      'Duoną paskrudinkite tosteriuje arba keptuvėje su lašeliu aliejaus, kol ji taps traški ir auksinė.',
      'Avokadą perpjaukite perpus, išimkite kauliuką, minkštimą išgriebkite šaukštu į dubenėlį. Sutrinkite šakute, įlašinkite citrinos sulčių, įberkite druskos ir pipirų.',
      'Atskirai išvirkite kiaušinius: keptuvėje su trupučiu aliejaus kepkite 3–4 min. saulutei arba 2–3 min. kiekvienoje pusėje, jei mėgstate kietesnį trynį.',
      'Ant skrebučių užtepkite avokado tyrę lygiu sluoksniu.',
      'Ant viršaus uždėkite kiaušinį, pabarstykite čili dribsniais arba smulkintomis žolelėmis ir patiekite iškart.',
    ],
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
    openable: true,
    ingredients: [
      { amount: '2 vnt.', name: 'lašišos filė (po ~150–180 g)' },
      { amount: '200 g', name: 'brokolių žiedynų' },
      { amount: '1 vnt.', name: 'cukinija' },
      { amount: '1 vnt.', name: 'raudonoji paprika' },
      { amount: '2 v. š.', name: 'alyvuogių aliejaus' },
      { amount: '1 skiltelė', name: 'česnako' },
      { amount: '1 v. š.', name: 'citrinos sulčių' },
      { amount: '1 šaukštelis', name: 'medaus (nebūtina)' },
      { amount: 'pagal skonį', name: 'druska, pipirai, džiovintas raudonėlis' },
    ],
    steps: [
      'Įkaitinkite orkaitę iki 200 °C. Skardą išklokite kepimo popieriumi.',
      'Brokolius padalinkite į žiedynus, cukiniją ir papriką supjaustykite stambiais gabaliukais. Daržoves sumaišykite su 1 v. š. aliejaus, druska, pipirais ir raudonėliu.',
      'Sudėkite daržoves ant skardos ir kepkite 10 minučių, kad jos pradėtų minkštėti.',
      'Kol daržovės kepa, lašišą nusausinkite popieriniu rankšluosčiu. Sumaišykite likusį aliejų su citrinos sultimis, smulkintu česnaku, medumi, druska ir pipirais. Šiuo mišiniu aptepkite žuvį.',
      'Išimkite skardą, pastumkite daržoves į šonus ir įdėkite lašišos filė oda žemyn. Kepkite dar 12–15 min., kol žuvis lengvai skyla šakute, o daržovės apskrunda.',
      'Patiekite lašišą kartu su keptomis daržovėmis. Jei norite, papildomai apšlakstykite citrinos sultimis.',
    ],
  },
]

const navLinks = [
  { href: '#', label: 'Pagrindinis', active: true },
  { href: '#receptai', label: 'Mano receptai' },
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

function RecipeModal({ recipe, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-icon"
          aria-label="Uždaryti"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>

        <div className="modal-image">
          <img src={recipe.image} alt={recipe.title} />
        </div>

        <div className="modal-body">
          <span className="tag">{recipe.tag}</span>
          <h2 id="recipe-modal-title">{recipe.title}</h2>

          <div className="modal-meta">
            <span>
              <Icon name="clock" />
              {recipe.time}
            </span>
            <span>
              <Icon name="user" />
              {recipe.servings} porcijos
            </span>
          </div>

          <section className="modal-section">
            <h3>Ingredientai</h3>
            <ul className="ingredient-list">
              {recipe.ingredients.map((item) => (
                <li key={`${item.amount}-${item.name}`}>
                  <span className="ingredient-amount">{item.amount}</span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="modal-section">
            <h3>Gaminimo instrukcija</h3>
            <ol className="steps-list">
              {recipe.steps.map((step, index) => (
                <li key={step}>
                  <span className="step-number">{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <button type="button" className="btn btn-primary modal-close-btn" onClick={onClose}>
            Uždaryti
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [query, setQuery] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openRecipe = (recipe) => {
    if (!recipe.openable) return
    setSelectedRecipe(recipe)
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
                  className={`recipe-card${recipe.openable ? ' is-openable' : ''}`}
                  style={{ animationDelay: `${index * 80}ms` }}
                  onClick={() => openRecipe(recipe)}
                  onKeyDown={(event) => {
                    if (!recipe.openable) return
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openRecipe(recipe)
                    }
                  }}
                  role={recipe.openable ? 'button' : undefined}
                  tabIndex={recipe.openable ? 0 : undefined}
                  aria-label={
                    recipe.openable
                      ? `Atidaryti receptą: ${recipe.title}`
                      : undefined
                  }
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
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleFavorite(recipe.id)
                      }}
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
        <a href="#">
          <Icon name="user" />
          <span>Profilis</span>
        </a>
      </nav>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  )
}

export default App
