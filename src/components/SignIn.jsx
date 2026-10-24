import { useAuth } from '../context/auth-context'
import { Icon } from './Icon'

export function SignIn() {
  const { signInWithGithub, authError } = useAuth()

  return (
    <div className="signin">
      <h1 className="wordmark">shawty</h1>

      <button type="button" className="btn btn--github" onClick={signInWithGithub}>
        <Icon name="github" size={18} />
        Sign in with GitHub
      </button>



      {authError ? <p className="signin__error">{authError}</p> : null}
    </div>
  )
}
