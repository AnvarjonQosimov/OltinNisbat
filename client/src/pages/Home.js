import "../styles/Home.css"
import OltinNisbat from "../images/oltinnisbat.jpg"
import "../i18n.js"
import { useTranslation } from "react-i18next"

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
        <img src={OltinNisbat} alt="OltinNisbat" />
        {/* </div> */}
      </div>
    </div>
  )
}

export default Home