import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const HomeRoute = () => (
  <>
    <Header />
    <div className="Home-background">
      <div className="Home-card-container">
        <div className="Home-block">
          <img
            src="https://res.cloudinary.com/dhr677kpr/image/upload/v1743005303/undraw_Questions_re_1fy7_1_wuvqfu.png"
            alt="start quiz game"
            className="HomeRoute-image"
          />
          <h1 className="HomeRoute-heading">
            How Many Of These Questions Do You Actually Know?
          </h1>
          <p className="HomeRoute-para">
            Test yourself with these easy quiz questions and answers
          </p>
          <Link to="/quiz-game">
            <button type="button" className="start-Button">
              Start Quiz
            </button>
          </Link>
        </div>
        <div className="PopUp-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/quiz-game-error-img.png"
            alt="warning icon"
            className="exclamation_image"
          />
          <p>All the progress will be lost, if you reload during the quiz</p>
        </div>
      </div>
    </div>
  </>
)

export default HomeRoute
