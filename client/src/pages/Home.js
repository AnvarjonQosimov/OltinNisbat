import "../styles/Home.css"
import OltinNisbat from "../images/oltinnisbat.jpg"
import "../i18n.js"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../Firebase/Firebase";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { MdStackedLineChart } from "react-icons/md";

function Home() {
    const [usersCount, setUsersCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [rendersCount, setRendersCount] = useState(0);

    const fetchUsersAndRenders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setUsersCount(usersData.length);

        const response = await axios.get("https://oltinnisbat.onrender.com/api/post/get");
        if (response.data) {
          setRendersCount(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    useEffect(() => {
      fetchUsersAndRenders();
    }, []);
  
  const { t } = useTranslation()
  return (
    <div className='Home'>
      <div className="home_left">
        <div className="homeleftTop">
          <h1 className="homelefttext1">{t('welcome')}<span> {t('welcomepl')}</span></h1>
        <Link to={"/rent"} className="linktorentbtn"><button>{t("letStart")}</button></Link>
        </div>

        <div className="homeStatistics">
          <div className="numberOfusers">
            <h2 className="userscountstatistic">{t("users")}</h2>
          <h1>{usersCount}</h1>
        </div>

        <h1 className="stIc"><MdStackedLineChart/></h1>

        <div className="numberOfRenders">
          <h2 className="renderscountstatistic">{t("renders")}</h2>
          <h1>{rendersCount}</h1>
        </div>
        </div>

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