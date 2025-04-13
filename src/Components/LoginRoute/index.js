import {Component} from 'react'

import Cookies from 'js-cookie'

import {withRouter, Redirect} from 'react-router-dom'

import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', errorMsg: '', display: false}

  saveAccessToken = jwtToken => {
    const {history} = this.props
    Cookies.set('jwtToken', jwtToken, {expires: 30})
    history.replace('/')
  }

  makeApiCall = async () => {
    const {username, password} = this.state

    const data = {username, password}
    const options = {
      method: 'Post',
      body: JSON.stringify(data),
    }

    const apiCall = await fetch('https://apis.ccbp.in/login', options)
    if (apiCall.ok === true) {
      const response = await apiCall.json()
      this.saveAccessToken(response.jwt_token)
    } else {
      const response = await apiCall.json()
      this.setState({errorMsg: response.error_msg})
    }
  }

  formEvent = event => {
    event.preventDefault()
    this.makeApiCall()
  }

  onUsernameEvent = event => {
    this.setState({username: event.target.value})
  }

  onPasswordEvent = event => {
    this.setState({password: event.target.value})
  }

  onCheckboxEvent = () => {
    this.setState(prevState => ({display: !prevState.display}))
  }

  render() {
    const {username, password, errorMsg, display} = this.state
    const jwtToken = Cookies.get('jwtToken')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="Login-background">
        <div className="Login-card">
          <img
            src="https://res.cloudinary.com/dhr677kpr/image/upload/v1743005210/Frame_8787_dnxknk.png"
            alt="login website logo"
            className="Login-image"
          />
          <form className="Login-form" onSubmit={this.formEvent}>
            <div className="Input-container">
              <label className="label" htmlFor="input-1">
                USERNAME
              </label>
              <input
                type="text"
                className="input"
                id="input-1"
                placeholder="Username"
                value={username}
                onChange={this.onUsernameEvent}
              />
              <label className="label" htmlFor="input-2">
                PASSWORD
              </label>
              <input
                type={display ? 'text' : 'password'}
                className="input"
                id="input-2"
                placeholder="Password"
                value={password}
                onChange={this.onPasswordEvent}
              />
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="input_checkbox"
                className="checkbox-element"
                onClick={this.onCheckboxEvent}
              />
              <label className="checkbox-label" htmlFor="input_checkbox">
                Show Password
              </label>
            </div>
            <button type="submit" className="Login-button">
              Login
            </button>
            <p className="error-message">
              {errorMsg.length !== 0 ? errorMsg : null}
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(LoginRoute)
