import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './App.css'

const STORAGE_KEY = 'recipe-book-user-recipes'

const RECIPE_IMAGES = {
  pasta: '/recipes/pasta.jpg',
  breakfast: '/recipes/breakfast.jpg',
  dinner: '/recipes/dinner.jpg',
  dessert: '/recipes/dessert.jpg',
  default: '/recipes/default.jpg',
}

/**
 * Pagal pavadinimo raktažodžius parenka numatytą recepto nuotrauką.
 * Veikia ir be lietuviškų raidžių (naudoja normalizuotą tekstą).
 */
function getRecipeImageByTitle(title) {
  const normalized = normalizeSearchText(title)

  if (
    normalized.includes('makaron') ||
    normalized.includes('pasta')
  ) {
    return RECIPE_IMAGES.pasta
  }

  if (
    normalized.includes('avokad') ||
    normalized.includes('kiausin')
  ) {
    return RECIPE_IMAGES.breakfast
  }

  if (
    normalized.includes('lasis') ||
    normalized.includes('zuvis')
  ) {
    return RECIPE_IMAGES.dinner
  }

  if (
    normalized.includes('pirag') ||
    normalized.includes('sokolad') ||
    normalized.includes('desert')
  ) {
    return RECIPE_IMAGES.dessert
  }

  return RECIPE_IMAGES.default
}

const SAMPLE_RECIPES = [
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

const LT_CHAR_MAP = {
  ą: 'a',
  č: 'c',
  ę: 'e',
  ė: 'e',
  į: 'i',
  š: 's',
  ų: 'u',
  ū: 'u',
  ž: 'z',
}

/** Pašalina diakritikus, suvienodina y/i ir mažąsias raides. */
function normalizeSearchText(text) {
  return text
    .toLocaleLowerCase('lt')
    .split('')
    .map((char) => LT_CHAR_MAP[char] || char)
    .join('')
    .replace(/y/g, 'i')
}

/**
 * Supaprastina lietuviškas galūnes, kad „makaronai / makaronų / makaronus“
 * ir „avokadas / avokado / avokadu“ atitiktų tą patį kamieną.
 */
function stemSearchWord(word) {
  const endings = [
    'ais',
    'ams',
    'ami',
    'oje',
    'ose',
    'ius',
    'iam',
    'iems',
    'us',
    'as',
    'is',
    'ys',
    'ai',
    'ui',
    'uo',
    'om',
    'os',
    'es',
    'ei',
    'a',
    'o',
    'u',
    'e',
    'i',
  ]

  let stem = word
  for (const ending of endings) {
    if (stem.length - ending.length >= 4 && stem.endsWith(ending)) {
      stem = stem.slice(0, -ending.length)
      break
    }
  }
  return stem
}

function getSearchTokens(text) {
  return normalizeSearchText(text)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(stemSearchWord)
}

/** Filtruoja bet kurį receptų sąrašą pagal pavadinimą (veiks ir su Supabase duomenimis). */
function filterRecipesByTitle(recipeList, searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery.trim())
  if (!normalizedQuery) return recipeList

  const queryTokens = getSearchTokens(searchQuery)
  if (queryTokens.length === 0) return recipeList

  return recipeList.filter((recipe) => {
    const normalizedTitle = normalizeSearchText(recipe.title)
    if (normalizedTitle.includes(normalizedQuery)) return true

    const titleTokens = getSearchTokens(recipe.title)
    return queryTokens.every((queryToken) =>
      titleTokens.some(
        (titleToken) =>
          titleToken.includes(queryToken) || queryToken.includes(titleToken),
      ),
    )
  })
}

function loadUserRecipes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Užtikriname, kad seni įrašai turėtų reikalingas žymas ištrynimui/redagavimui.
    return parsed.map((recipe) => ({
      ...recipe,
      id: recipe.id,
      isUserRecipe: true,
      openable: true,
    }))
  } catch {
    return []
  }
}

function saveUserRecipes(userRecipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userRecipes))
}

function parseIngredientLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(
        /^(\d+[.,]?\d*\s*[a-ząčęėįšųūžA-ZĄČĘĖĮŠŲŪŽ.%]*\.?|\d+\s*v\.?\s*š\.?|pagal\s+skonį)\s+(.+)$/iu,
      )
      if (match) {
        return { amount: match[1].trim(), name: match[2].trim() }
      }
      return { amount: '', name: line }
    })
}

function parseStepLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

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
    edit: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20h9" strokeLinecap="round" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" strokeLinejoin="round" />
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7h16" strokeLinecap="round" />
        <path d="M10 11v6M14 11v6" strokeLinecap="round" />
        <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" strokeLinejoin="round" />
        <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinejoin="round" />
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

function serializeIngredients(ingredients) {
  return ingredients
    .map((item) => (item.amount ? `${item.amount} ${item.name}` : item.name))
    .join('\n')
}

function RecipeModal({ recipe, onClose, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (confirmDelete) setConfirmDelete(false)
      else onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, confirmDelete])

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => {
        // Kol atidarytas ištrynimo patvirtinimas, neuždaryti recepto modalų
        // (portalo įvykiai React medyje kyla iki backdrop).
        if (confirmDelete) return
        onClose()
      }}
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
          {recipe.tag && <span className="tag">{recipe.tag}</span>}
          <h2 id="recipe-modal-title">{recipe.title}</h2>

          {(recipe.time || recipe.servings) && (
            <div className="modal-meta">
              {recipe.time && (
                <span>
                  <Icon name="clock" />
                  {recipe.time}
                </span>
              )}
              {recipe.servings && (
                <span>
                  <Icon name="user" />
                  {recipe.servings} porcijos
                </span>
              )}
            </div>
          )}

          <section className="modal-section">
            <h3>Ingredientai</h3>
            <ul className="ingredient-list">
              {recipe.ingredients.map((item, index) => (
                <li key={`${index}-${item.name}`}>
                  {item.amount ? (
                    <span className="ingredient-amount">{item.amount}</span>
                  ) : null}
                  <span className={item.amount ? undefined : 'ingredient-full'}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="modal-section">
            <h3>Gaminimo instrukcija</h3>
            <ol className="steps-list">
              {recipe.steps.map((step, index) => (
                <li key={`${index}-${step.slice(0, 24)}`}>
                  <span className="step-number">{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="modal-actions">
            {recipe.isUserRecipe && (
              <>
                <button
                  type="button"
                  className="btn btn-outline modal-action-btn"
                  onClick={() => onEdit(recipe)}
                >
                  <Icon name="edit" />
                  Redaguoti
                </button>
                <button
                  type="button"
                  className="btn btn-danger modal-action-btn"
                  onClick={(event) => {
                    event.stopPropagation()
                    setConfirmDelete(true)
                  }}
                >
                  <Icon name="trash" />
                  Ištrinti
                </button>
              </>
            )}
            <button type="button" className="btn btn-primary modal-action-btn" onClick={onClose}>
              Uždaryti
            </button>
          </div>
        </div>
      </div>

      {confirmDelete &&
        createPortal(
          <div
            className="confirm-overlay"
            role="presentation"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="confirm-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-delete-title"
              aria-describedby="confirm-delete-text"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 id="confirm-delete-title">Ištrinti receptą</h3>
              <p id="confirm-delete-text">Ar tikrai norite ištrinti šį receptą?</p>
              <div className="confirm-actions">
                <button
                  type="button"
                  className="btn btn-outline form-btn"
                  onClick={() => setConfirmDelete(false)}
                >
                  Atšaukti
                </button>
                <button
                  type="button"
                  className="btn btn-danger form-btn"
                  onClick={(event) => {
                    event.stopPropagation()
                    onDelete(recipe.id)
                  }}
                >
                  Taip, ištrinti
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

function RecipeFormModal({ recipe = null, onClose, onSave }) {
  const isEdit = Boolean(recipe)
  const [title, setTitle] = useState(recipe?.title ?? '')
  const [ingredientsText, setIngredientsText] = useState(
    recipe ? serializeIngredients(recipe.ingredients) : '',
  )
  const [instructionsText, setInstructionsText] = useState(
    recipe ? recipe.steps.join('\n') : '',
  )
  const [error, setError] = useState('')

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

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const ingredients = parseIngredientLines(ingredientsText)
    const steps = parseStepLines(instructionsText)

    if (!trimmedTitle || ingredients.length === 0 || steps.length === 0) {
      setError('Užpildykite visus privalomus laukus: pavadinimą, ingredientus ir gaminimo instrukciją.')
      return
    }

    onSave({
      ...(recipe ?? {
        tag: 'Mano receptas',
        openable: true,
        isUserRecipe: true,
      }),
      id: recipe?.id ?? `user-${Date.now()}`,
      title: trimmedTitle,
      ingredients,
      steps,
      // Naujiems receptams nuotrauka parenkama automatiškai; redaguojant paliekama esama.
      image: recipe?.image ?? getRecipeImageByTitle(trimmedTitle),
      isUserRecipe: true,
      openable: true,
    })
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal modal-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-form-title"
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

        <form className="modal-body add-recipe-form" onSubmit={handleSubmit}>
          <h2 id="recipe-form-title">
            {isEdit ? 'Redaguoti receptą' : 'Pridėti receptą'}
          </h2>
          <p className="form-lead">
            {isEdit
              ? 'Pakeiskite recepto duomenis. Ingredientus ir instrukciją rašykite po vieną eilutę.'
              : 'Užpildykite privalomus laukus. Ingredientus ir instrukciją rašykite po vieną eilutę.'}
          </p>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <label className="form-field">
            <span>Recepto pavadinimas *</span>
            <input
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError('')
              }}
              placeholder="Pvz. Šokoladinis pyragas"
              autoFocus
            />
          </label>

          <label className="form-field">
            <span>Ingredientai *</span>
            <textarea
              rows={5}
              value={ingredientsText}
              onChange={(event) => {
                setIngredientsText(event.target.value)
                setError('')
              }}
              placeholder={'Pvz.\n200 g miltų\n2 vnt. kiaušiniai\n100 g cukraus'}
            />
          </label>

          <label className="form-field">
            <span>Gaminimo instrukcija *</span>
            <textarea
              rows={6}
              value={instructionsText}
              onChange={(event) => {
                setInstructionsText(event.target.value)
                setError('')
              }}
              placeholder={'Pvz.\nĮkaitinkite orkaitę.\nSumaišykite ingredientus.\nKepkite 30 min.'}
            />
          </label>

          <div className="form-actions">
            <button type="button" className="btn btn-outline form-btn" onClick={onClose}>
              Atšaukti
            </button>
            <button type="submit" className="btn btn-primary form-btn">
              {isEdit ? 'Išsaugoti pakeitimus' : 'Išsaugoti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [query, setQuery] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [userRecipes, setUserRecipes] = useState(() => loadUserRecipes())
  const [toastMessage, setToastMessage] = useState('')

  const recipes = [...SAMPLE_RECIPES, ...userRecipes]

  useEffect(() => {
    if (!toastMessage) return undefined
    const timer = window.setTimeout(() => setToastMessage(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

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

  const closeRecipeForm = () => {
    setIsAddOpen(false)
    setEditingRecipe(null)
  }

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(null)
    setIsAddOpen(false)
    setEditingRecipe(recipe)
  }

  const handleSaveRecipe = (recipe) => {
    const isEdit = userRecipes.some((item) => item.id === recipe.id)
    const nextUserRecipes = isEdit
      ? userRecipes.map((item) => (item.id === recipe.id ? recipe : item))
      : [...userRecipes, recipe]

    setUserRecipes(nextUserRecipes)
    saveUserRecipes(nextUserRecipes)
    closeRecipeForm()

    if (isEdit) {
      setSelectedRecipe(recipe)
    }
  }

  const handleDeleteRecipe = (recipeId) => {
    setUserRecipes((prev) => {
      const nextUserRecipes = prev.filter((item) => String(item.id) !== String(recipeId))
      saveUserRecipes(nextUserRecipes)
      return nextUserRecipes
    })
    setSelectedRecipe(null)
    setToastMessage('Receptas sėkmingai ištrintas')
  }

  const filteredRecipes = filterRecipesByTitle(recipes, query)

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
                <button
                  type="button"
                  className="btn btn-primary btn-add"
                  onClick={() => setIsAddOpen(true)}
                >
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

            {filteredRecipes.length === 0 ? (
              <p className="recipes-empty" role="status">
                Receptų nerasta
              </p>
            ) : (
              <div className="recipe-grid">
                {filteredRecipes.map((recipe, index) => (
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
                      {recipe.tag && <span className="tag">{recipe.tag}</span>}
                      <h3>{recipe.title}</h3>
                      {(recipe.time || recipe.servings || recipe.rating != null) && (
                        <div className="recipe-meta">
                          {recipe.time && (
                            <span>
                              <Icon name="clock" />
                              {recipe.time}
                            </span>
                          )}
                          {recipe.servings && (
                            <span>
                              <Icon name="user" />
                              {recipe.servings}
                            </span>
                          )}
                          {recipe.rating != null && <Stars rating={recipe.rating} />}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
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
          onEdit={handleEditRecipe}
          onDelete={handleDeleteRecipe}
        />
      )}

      {(isAddOpen || editingRecipe) && (
        <RecipeFormModal
          recipe={editingRecipe}
          onClose={closeRecipeForm}
          onSave={handleSaveRecipe}
        />
      )}

      {toastMessage && (
        <div className="toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default App
