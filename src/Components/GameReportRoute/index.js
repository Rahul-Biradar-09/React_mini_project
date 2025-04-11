import {Component} from 'react'

import {GrFormPrevious} from 'react-icons/gr'

import {MdOutlineNavigateNext} from 'react-icons/md'

import './index.css'

class GameReportRoute extends Component {
  state = {count: 0, display: true}

  onIncreaseCount = () => {
    const {countUnattempted} = this.props
    const {count} = this.state
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onDecreaseCount = () => {
    const {count} = this.state
    this.setState(prevState => ({count: prevState.count - 1}))
  }

  onAllAttempted = () => {
    const {rightAnswers, attempted} = this.props
    const wrongAnswers = attempted - rightAnswers
    const countUnattempted = 10 - attempted
    return (
      <div className="game-report-container">
        <div className="game-report-top-container">
          <div className="score-circle">
            <h1 className="score-head">
              10<span className="score-head cross-line">/</span>
              <span className="score-head-small">10</span>
            </h1>
          </div>
          <div className="score-rectangle">
            <div className="sub-div">
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-right-check-img.png"
                alt="correct answer icon"
                className="img"
              />
              <p className="para">{rightAnswers} Correct answers</p>
            </div>
            <div className="sub-div">
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-wrong-check-img.png"
                alt="incorrect answer icon"
                className="img"
              />
              <p className="para">{wrongAnswers} Incorrect answers</p>
            </div>
            <div className="sub-div">
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-un-answered-img.png"
                alt="unattempted icon"
                className="img"
              />
              <p className="para">{countUnattempted} Unattempted answers</p>
            </div>
          </div>
        </div>
        <div className="game-report-bottom-container-attempted">
          <h1 className="unattempted-head">Attempted all the questions</h1>
        </div>
      </div>
    )
  }

  onNotAllAttempted = () => {
    const {count, display} = this.state
    const {unattempted, rightAnswers, attempted} = this.props
    const questionNo = unattempted[count]
    const wrongAnswers = attempted - rightAnswers
    const countUnattempted = 10 - attempted
    return (
      <div className="game-report-container">
        <div className="game-report-top-container">
          <div className="score-circle">
            <h1 className="score-head">
              10<span className="score-head cross-line">/</span>
              <span className="score-head-small">10</span>
            </h1>
          </div>
          <div className="score-rectangle">
            <div className="sub-div">
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-right-check-img.png"
                alt="correct answer icon"
                className="img"
              />
              <p className="para">{rightAnswers} Correct answers</p>
            </div>
            <div className="sub-div">
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-wrong-check-img.png"
                alt="incorrect answer icon"
                className="img"
              />
              <p className="para">{wrongAnswers} Incorrect answers</p>
            </div>
            <div className="sub-div">
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-un-answered-img.png"
                alt="unattempted icon"
                className="img"
              />
              <p className="para">{countUnattempted} Unattempted answers</p>
            </div>
          </div>
        </div>
        <div className="game-report-bottom-container">
          <h1 className="unattempted-head">Unattempted Questions</h1>
          <h1 className="question-head-not-attempted">
            {questionNo.question_text}
          </h1>
          {questionNo.options_type === 'DEFAULT' && (
            <div className="questions-container-default-not-attempted">
              {questionNo.options.map(eachItem => (
                <div className="questions-options-default" key={eachItem.id}>
                  <li
                    className={
                      eachItem.is_correct === 'true'
                        ? 'options-questions-default options-question-rightAnswer'
                        : 'options-questions-default'
                    }
                  >
                    {eachItem.text}
                  </li>
                  <img
                    src={
                      eachItem.is_correct === 'true'
                        ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                        : () => {}
                    }
                    alt={
                      eachItem.is_correct === 'true'
                        ? 'correct checked circle'
                        : () => {}
                    }
                    className={
                      eachItem.is_correct === 'true'
                        ? 'options-questions-right'
                        : () => {}
                    }
                  />
                </div>
              ))}
            </div>
          )}
          {questionNo.options_type === 'IMAGE' && (
            <div className="questions-container-image-not-attempted">
              {questionNo.options.map(eachItem => (
                <div className="questions-options-image" key={eachItem.id}>
                  <img
                    src={eachItem.image_url}
                    alt={eachItem.text}
                    className="options-image-question"
                  />
                  <img
                    src={
                      eachItem.is_correct === 'true'
                        ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                        : () => {}
                    }
                    alt={
                      eachItem.is_correct === 'true'
                        ? 'correct checked circle'
                        : () => {}
                    }
                    className={
                      eachItem.is_correct === 'true'
                        ? 'image-questions-right'
                        : () => {}
                    }
                  />
                </div>
              ))}
            </div>
          )}
          {questionNo.options_type === 'SINGLE_SELECT' && (
            <div className="questions-container-single-not-attempted">
              {questionNo.options.map(eachItem => (
                <div className="questions-options-single" key={eachItem.id}>
                  <>
                    <input
                      type="radio"
                      className="radio-option-single"
                      id={eachItem.id}
                      checked={eachItem.is_correct === 'true'}
                      onChange={() => {}}
                      name="radiobutton"
                    />
                    <label htmlFor={eachItem.id} className="radio-label-single">
                      {eachItem.text}
                    </label>
                    <img
                      src={
                        eachItem.is_correct === 'true'
                          ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                          : () => {}
                      }
                      alt={
                        eachItem.is_correct === 'true'
                          ? 'correct checked circle'
                          : () => {}
                      }
                      className={
                        eachItem.is_correct === 'true'
                          ? 'single-questions-right'
                          : () => {}
                      }
                    />
                  </>
                </div>
              ))}
            </div>
          )}
          <div className="question-button-container">
            <button
              type="button"
              className="question-previous-button"
              onClick={this.onDecreaseCount}
            >
              Previous Question
            </button>
            <button
              type="button"
              className="question-next-button"
              onClick={this.onIncreaseCount}
            >
              Next Question
            </button>
            <button
              aria-label="Save"
              type="button"
              className="question-previous-button-extra"
              onClick={this.onDecreaseCount}
            >
              <GrFormPrevious fill="#ffffff" size="22px" />
            </button>
            <button
              aria-label="Save"
              type="button"
              className="question-next-button-extra"
              onClick={this.onIncreaseCount}
            >
              <MdOutlineNavigateNext fill="#ffffff" size="22px" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {attempted} = this.props
    const countUnattempted = attempted - 10
    return (
      <>
        {countUnattempted === 0
          ? this.onAllAttempted()
          : this.onNotAllAttempted()}
      </>
    )
  }
}

export default GameReportRoute
