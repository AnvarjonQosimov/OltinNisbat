import "../styles/Home.css"
import OltinNisbat from "../images/oltinnisbat.jpg"
import "../i18n.js"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";

function Home() {

  const { t } = useTranslation()
  return (
    <div className='Home'>
      <div className="home_left">
        <h1><span>{t('welcome')} {t('welcomepl')}</span></h1>
      </div>
      <div className="home_right">
        {/* <div className="home_right-animation"> */}
        <div className="circleh"></div>
        <div className="circleho"></div>
        <Link className="home-link" to={"/rent2"}>
            <img src={OltinNisbat} alt="OltinNisbat" />
          </Link>
        {/* </div> */}
      </div>
    </div>
  )
}

export default Home