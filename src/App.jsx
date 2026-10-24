import { useState } from 'react'
import { useAuth } from './context/auth-context'
import { Backdrop } from './components/Backdrop'
import { SignIn } from './components/SignIn'
import { UserMenu } from './components/UserMenu'
import { Icon } from './components/Icon'
import { Home } from './pages/Home'
import { Urls } from './pages/Urls'

function Splash() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '40svh' }}>
      <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  )
}

// Everything lives on "/" — the API owns "/{short_code}" for redirects, so the
// ui never claims a path of its own. The list is a view toggle, not a route.
export default function App() {
  const { loading, isAuthenticated } = useAuth()
  const [showList, setShowList] = useState(false)

  return (
    <div className={`page${isAuthenticated ? '' : ' page--centered'}${showList ? ' page--urls' : ''}`}>
      <Backdrop />

      {isAuthenticated && showList ? (
        <button type="button" className="page__home" onClick={() => setShowList(false)} title="Back to the shortener">
          <Icon name="chevronLeft" size={16} className="page__home__chev" />
          <span className="page__home__label">shorten a link</span>
        </button>
      ) : null}

      <div className="page__actions">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              className={`icon-btn${showList ? ' icon-btn--on' : ''}`}
              onClick={() => setShowList((value) => !value)}
              aria-label={showList ? 'Back to shortener' : 'My urls'}
              title={showList ? 'Shortener' : 'My urls'}
            >
              <Icon name={showList ? 'home' : 'list'} size={19} />
            </button>
            <UserMenu />
          </>
        ) : null}
      </div>

      <div className="page__inner">
        {loading ? <Splash /> : !isAuthenticated ? <SignIn /> : showList ? <Urls /> : <Home />}
      </div>
    </div>
  )
}
