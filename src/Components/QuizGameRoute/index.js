import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import GameResultRoute from '../GameResultRoute'

import './index.css'

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
    attempted: 0,
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

    if (display) {
      clearInterval(this.timerId)
      this.setState(prevState => ({
        questionNo: prevState.questionNo + 1,
        display: !prevState.display,
        count: prevState.count + 1,
        rightOption: false,
        timer: 15,
      }))
    }
    if (count < 11) {
      this.runTimer()
    }
  }

  loadingStateView = () => (
    <div className="Quiz-loading-card">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#263868" height={50} width={50} />
      </div>
    </div>
  )

  onClickedOption = id => {
    const {questionNo, questionsList} = this.state
    const value = questionsList[questionNo]
    const correct = value.options.filter(eachItem => eachItem.id === id)
    if (correct[0].is_correct === 'true') {
      this.setState(prevState => ({rightAnswers: prevState.rightAnswers + 1}))
    }
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
        attempted: prevState.attempted + 1,
        selectedOption: objectValue[0],
      }))
    } else {
      this.setState(prevState => ({
        display: !prevState.display,
        attempted: prevState.attempted + 1,
        selectedOption: objectValue[0],
      }))
    }

    this.onClickedOption(id)
  }

  startTimer = () => {
    const {timer, display, count, questionsList, questionNo} = this.state
    const questionNotattemptted = questionsList[questionNo]

    if (display) {
      clearInterval(this.timerId)
    }
    if (timer === 0) {
      clearInterval(this.timerId)
      if (display === false) {
        this.setState(prevState => ({
          unattempted: [...prevState.unattempted, questionNotattemptted],
        }))
      }
      if (count === 11) {
        clearInterval(this.timerId)
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
              <p className="questions-count">{`${count}/${questionsList.length}`}</p>
            </div>
            <div className="timer-container">
              <p className="timer-para">{timer}</p>
            </div>
          </div>
          <ul className="questions-container" key={question.id}>
            <p className="questions">{question.question_text}</p>
            {question.options_type === 'DEFAULT' && (
              <ul className="options-container-default">
                {question.options.map(eachItem => (
                  <li className="options-check-default" key={eachItem.id}>
                    {selectedOption.id === eachItem.id ? (
                      <>
                        <button
                          type="button"
                          className={
                            selectedOption.is_correct === `${rightOption}`
                              ? 'options right-option'
                              : 'options wrong-option'
                          }
                        >
                          <li className="list-default">{eachItem.text}</li>
                        </button>
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
                            <button
                              type="button"
                              className={
                                eachItem.is_correct === 'true'
                                  ? 'options right-option'
                                  : 'options'
                              }
                            >
                              <li className="list-default">{eachItem.text}</li>
                            </button>
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
                          <button
                            type="button"
                            className="options"
                            onClick={
                              display
                                ? () => {}
                                : () => {
                                    this.optionSelectedEvent(eachItem.id)
                                  }
                            }
                          >
                            <li className="list-default">{eachItem.text}</li>
                          </button>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {question.options_type === 'IMAGE' && (
              <ul className="options-container-image">
                {question.options.map(eachItem => (
                  <li className="options-check-image" key={eachItem.id}>
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
                              ? 'right-answer-image'
                              : 'wrong-answer-image'
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
                                  ? 'right-answer-image'
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
                                ? () => {}
                                : () => this.optionSelectedEvent(eachItem.id)
                            }
                          />
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {question.options_type === 'SINGLE_SELECT' && (
              <ul className="options-container-single">
                {question.options.map(eachItem => (
                  <li className="options-check-single" key={eachItem.id}>
                    {selectedOption.id === eachItem.id ? (
                      <>
                        <input
                          type="radio"
                          className="radio-option"
                          id={eachItem.id}
                          checked={selectedOption.id === eachItem.id}
                          onChange={
                            display
                              ? () => {}
                              : () => this.optionSelectedEvent(eachItem.id)
                          }
                          name="radiobutton"
                        />
                        <label htmlFor={eachItem.id} className="radio-label">
                          {eachItem.text}
                        </label>

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
                              checked={selectedOption.id === eachItem.id}
                              onChange={
                                display
                                  ? () => {}
                                  : () => this.optionSelectedEvent(eachItem.id)
                              }
                              name="radiobutton"
                            />
                            <label
                              htmlFor={eachItem.id}
                              className="radio-label"
                            >
                              {eachItem.text}
                            </label>

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
                          <>
                            <input
                              type="radio"
                              className="radio-option"
                              id={eachItem.id}
                              name="radiobutton"
                              checked={selectedOption.id === eachItem.id}
                              onChange={
                                display
                                  ? () => {}
                                  : () => this.optionSelectedEvent(eachItem.id)
                              }
                            />
                            <label
                              htmlFor={eachItem.id}
                              className="radio-label"
                            >
                              {eachItem.text}
                            </label>
                          </>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </ul>
        </div>
        <div className="button-container">
          <button
            type="button"
            className={display ? 'next-button' : 'blue-button'}
            onClick={display ? this.nextQuestionEvent : () => {}}
          >
            {count > 9 ? 'Submit' : 'Next Question'}
          </button>
        </div>
      </div>
    )
  }

  failureStateView = () => (
    <div className="Quiz-failure-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-assess-failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Something went wrong</h1>
      <p className="failure-para">Our servers are busy please try again</p>
      <button
        type="button"
        className="failure-button"
        onClick={this.retryButtonEvent}
      >
        Retry
      </button>
    </div>
  )

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
    const {count, unattempted, rightAnswers, attempted} = this.state
    return (
      <>
        {count < 11 ? (
          <>
            <Header />
            <div className="Quiz-background">{this.apistatusConstants()}</div>
          </>
        ) : (
          <>
            <Header />
            <div className="Quiz-background">
              <GameResultRoute
                unattempted={unattempted}
                rightAnswers={rightAnswers}
                attempted={attempted}
              />
            </div>
          </>
        )}
      </>
    )
  }
}

export default QuizGameRoute
