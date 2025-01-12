import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import './index.css'

import Header from '../Header'

const apiConstants = {
  loading: 'Loading',
  success: 'Success',
  failure: 'Failure',
}

class QuizGameRoute extends Component {
  state = {
    questionsList: [],
    apiStatus: apiConstants.loading,
    count: 0,
    unattempted: [],
    rightAnswers: 0,
    questionNo: 0,
    selectedOption: [],
    display: false,
    rightOption: false,
    timer: 15,
  }

  componentDidMount() {
    this.makeApiCall()
    this.runTimer()
  }

  runTimer = () => {
    this.timerId = setInterval(this.startTimer, 1000)
  }

  makeApiCall = async () => {
    const jwtToken = Cookies.get('jwtToken')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const fetchData = await fetch(
      'https://apis.ccbp.in/assess/questions',
      options,
    )

    if (fetchData.ok === true) {
      const response = await fetchData.json()
      this.setState({
        questionsList: response.questions,
        apiStatus: apiConstants.success,
        count: 1,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  retryButtonEvent = () => {
    this.setState({apiStatus: apiConstants.loading}, this.makeApiCall)
  }

  nextQuestionEvent = () => {
    const {display, count} = this.state
    const {history} = this.props
    if (display) {
      this.setState(
        prevState => ({
          questionNo: prevState.questionNo + 1,
          display: !prevState.display,
          count: prevState.count + 1,
          rightOption: false,
          timer: 15,
        }),
        this.runTimer,
      )
    }
    if (count > 9) {
      history.replace('/game-results')
    }
  }

  loadingStateView = () => {
    return (
      <div className="Quiz-loading-card">
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#263868" height={50} width={50} />
        </div>
      </div>
    )
  }

  optionSelectedEvent = id => {
    const {questionsList, questionNo} = this.state
    const questionValue = questionsList[questionNo]

    const objectValue = questionValue.options.filter(
      eachItem => eachItem.id === id,
    )

    if (objectValue[0].is_correct) {
      this.setState(prevState => ({
        display: !prevState.display,
        rightOption: !prevState.rightOption,
        selectedOption: objectValue[0],
      }))
    } else {
      this.setState(prevState => ({
        display: !prevState.display,
        selectedOption: objectValue[0],
      }))
    }
  }

  startTimer = () => {
    const {timer, display, count, questionsList, questionNo} = this.state
    const {history} = this.props

    const questionNotattemptted = questionsList[questionNo]

    if (display) {
      clearInterval(this.timerId)
    }
    if (timer === 0) {
      clearInterval(this.timerId)
      if (display === false) {
        this.setState(prevState => ({
          unattempted: {...prevState.unattempted, questionNotattemptted},
        }))
      }
      if (count > 9) {
        history.replace('/game-results')
      }
      this.setState(
        prevState => ({
          questionNo: prevState.questionNo + 1,
          count: prevState.count + 1,
          timer: 15,
        }),
        this.runTimer,
      )
    } else {
      this.setState(prevState => ({timer: prevState.timer - 1}))
    }
  }

  successStateView = () => {
    const {
      questionsList,
      questionNo,
      count,
      selectedOption,
      rightOption,
      display,
      timer,
    } = this.state
    const question = questionsList[questionNo]
    return (
      <div className="Quiz-success-card">
        <div className="top-section">
          <div className="block-one">
            <div className="questionscount-container">
              <p className="questions-para">Question</p>
              <h1 className="questions-count">{`${count}/${questionsList.length}`}</h1>
            </div>
            <div className="timer-container">
              <p className="timer-para">{timer}</p>
            </div>
          </div>
          <div className="questions-container" key={question.id}>
            <h1 className="questions">{question.question_text}</h1>
            {question.options_type === 'DEFAULT' && (
              <div className="options-container-default">
                {question.options.map(eachItem => (
                  <div className="options-check-default" key={eachItem.id}>
                    {selectedOption.id === eachItem.id ? (
                      <>
                        <li
                          className={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'options right-option'
                              : 'options wrong-option'
                          }
                        >
                          {eachItem.text}
                        </li>
                        <img
                          src={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                              : 'https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png'
                          }
                          alt={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'correct checked circle'
                              : 'incorrect close circle'
                          }
                          className={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'right-answer'
                              : 'wrong-answer'
                          }
                        />
                      </>
                    ) : (
                      <>
                        {rightOption ? (
                          <>
                            <li
                              className={
                                eachItem.is_correct === 'true'
                                  ? 'options right-option'
                                  : 'options'
                              }
                            >
                              {eachItem.text}
                            </li>
                            <img
                              src={
                                eachItem.is_correct === 'true'
                                  ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                                  : null
                              }
                              alt={
                                eachItem.is_correct === 'true'
                                  ? 'correct checked circle'
                                  : null
                              }
                              className={
                                eachItem.is_correct === 'true'
                                  ? 'right-answer'
                                  : null
                              }
                            />
                          </>
                        ) : (
                          <li
                            className="options"
                            onClick={
                              display
                                ? null
                                : () => {
                                    this.optionSelectedEvent(eachItem.id)
                                  }
                            }
                          >
                            {eachItem.text}
                          </li>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            {question.options_type === 'IMAGE' && (
              <div className="options-container-image">
                {question.options.map(eachItem => (
                  <div className="options-check-image" key={eachItem.id}>
                    {selectedOption.id === eachItem.id ? (
                      <>
                        <img
                          src={eachItem.image_url}
                          alt={eachItem.text}
                          className="options-image"
                        />
                        <img
                          src={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                              : 'https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png'
                          }
                          alt={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'correct checked circle'
                              : 'incorrect close circle'
                          }
                          className={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'right-answer'
                              : 'wrong-answer'
                          }
                        />
                      </>
                    ) : (
                      <>
                        {rightOption ? (
                          <>
                            <img
                              src={eachItem.image_url}
                              alt={eachItem.text}
                              className="options-image"
                            />
                            <img
                              src={
                                eachItem.is_correct === 'true'
                                  ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                                  : null
                              }
                              alt={
                                eachItem.is_correct === 'true'
                                  ? 'correct checked circle'
                                  : null
                              }
                              className={
                                eachItem.is_correct === 'true'
                                  ? 'right-answer'
                                  : null
                              }
                            />
                          </>
                        ) : (
                          <img
                            src={eachItem.image_url}
                            alt={eachItem.text}
                            className="options-image"
                            onClick={
                              display
                                ? null
                                : () => this.optionSelectedEvent(eachItem.id)
                            }
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            {question.options_type === 'SINGLE_SELECT' && (
              <div className="options-container-single">
                {question.options.map(eachItem => (
                  <div className="options-check-single" key={eachItem.id}>
                    {selectedOption.id === eachItem.id ? (
                      <>
                        <input
                          type="radio"
                          className="radio-option"
                          id={eachItem.id}
                          name="radiobutton"
                        />
                        <lable htmlFor={eachItem.id} className="radio-label">
                          {eachItem.text}
                        </lable>
                        <img
                          src={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                              : 'https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png'
                          }
                          alt={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'correct checked circle'
                              : 'incorrect close circle'
                          }
                          className={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'answer-single'
                              : 'answer-single'
                          }
                        />
                      </>
                    ) : (
                      <>
                        {rightOption ? (
                          <>
                            <input
                              type="radio"
                              className="radio-option"
                              id={eachItem.id}
                              name="radiobutton"
                            />
                            <lable
                              htmlFor={eachItem.id}
                              className="radio-label"
                            >
                              {eachItem.text}
                            </lable>
                            <img
                              src={
                                eachItem.is_correct === 'true'
                                  ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                                  : null
                              }
                              alt={
                                eachItem.is_correct === 'true'
                                  ? 'correct checked circle'
                                  : null
                              }
                              className={
                                eachItem.is_correct === 'true'
                                  ? 'answer-single'
                                  : null
                              }
                            />
                          </>
                        ) : (
                          <div>
                            <input
                              type="radio"
                              className="radio-option"
                              id={eachItem.id}
                              name="radiobutton"
                              onChange={
                                display
                                  ? null
                                  : () => this.optionSelectedEvent(eachItem.id)
                              }
                            />
                            <lable
                              htmlFor={eachItem.id}
                              className="radio-label"
                            >
                              {eachItem.text}
                            </lable>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="button-container">
          <button
            type="button"
            className={display ? 'next-button' : 'blue-button'}
            onClick={display ? this.nextQuestionEvent : null}
          >
            {count > 9 ? 'Submit' : 'Next Question'}
          </button>
        </div>
      </div>
    )
  }

  failureStateView = () => {
    return (
      <div className="Quiz-failure-card">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-assess-failure-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="failure-heading">Something went wrong</h1>
        <p className="failure-para">Our server are busy please try again </p>
        <button
          type="button"
          className="failure-button"
          onClick={this.retryButtonEvent}
        >
          Retry
        </button>
      </div>
    )
  }

  apistatusConstants = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.loading:
        return this.loadingStateView()
      case apiConstants.success:
        return this.successStateView()
      case apiConstants.failure:
        return this.failureStateView()
      default:
        return null
    }
  }

  render() {
    const {count, unattempted} = this.state
    return (
      <>
        <Header />
        <div className="Quiz-background">{this.apistatusConstants()}</div>
      </>
    )
  }
}

export default QuizGameRoute
