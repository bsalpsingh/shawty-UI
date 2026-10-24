import { useRouter } from './lib/router-context'
import { useAuth } from './context/auth-context'
import { Backdrop } from './components/Backdrop'
import { SignIn } from './components/SignIn'
import { UserMenu } from './components/UserMenu'
import { Icon } from './components/Icon'
import { Link } from './lib/RouterProvider'
import { Home } from './pages/Home'
import { Urls } from './pages/Urls'

function Splash() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '40svh' }}>
      <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  )
}

export default function App() {
  const { path } = useRouter()
  const { loading, isAuthenticated } = useAuth()
  const { navigate } = useRouter()

  const onUrls = path === '/urls'

  return (
    <div className={`page${isAuthenticated ? '' : ' page--centered'}${onUrls ? ' page--urls' : ''}`}>
      <Backdrop />

      {isAuthenticated && onUrls ? (
        <Link to="/" className="page__brand" title="Go to shawty">
          shawty
        </Link>
      ) : null}

      <div className="page__actions">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              className={`icon-btn${onUrls ? ' icon-btn--on' : ''}`}
              onClick={() => navigate(onUrls ? '/' : '/urls')}
              aria-label={onUrls ? 'Back to shortener' : 'My urls'}
              title={onUrls ? 'Shortener' : 'My urls'}
            >
              <Icon name={onUrls ? 'home' : 'list'} size={19} />
            </button>
            <UserMenu />
          </>
        ) : null}
      </div>

      <div className="page__inner">
        {loading ? <Splash /> : !isAuthenticated ? <SignIn /> : onUrls ? <Urls /> : <Home />}
      </div>
    </div>
  )
}
