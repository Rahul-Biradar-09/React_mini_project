import {withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const imageHomeButton = () => {
    const {history} = props
    history.replace('/')
  }

  const logoutButton = () => {
    const {history} = props
    Cookies.remove('jwtToken')
    history.replace('/login')
  }

  return (
    <div className="Header-container">
      <button type="button" onClick={imageHomeButton} className="imgButton">
        <img
          src="https://res.cloudinary.com/dhr677kpr/image/upload/v1743005210/Frame_8787_dnxknk.png"
          alt="website logo"
          className="Home-image"
        />
      </button>
      <button type="button" className="Home-button" onClick={logoutButton}>
        Logout
      </button>
      <button type="button" className="img-home-button" onClick={logoutButton}>
        <img
          src="https://res.cloudinary.com/dhr677kpr/image/upload/v1736766624/log-out-02_k0q5v8.png"
          alt="logout"
          className="logout-image"
        />
      </button>
    </div>
  )
}

export default withRouter(Header)
