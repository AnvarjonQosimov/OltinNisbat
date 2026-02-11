import "../styles/AboutUs.css"
import { useTranslation } from "react-i18next";

function AboutUs() {
    const { t } = useTranslation();
    return (
        <div className="AboutUs">
            <div className="aboutUsText">
                <h1>{t("bizHaqimizda")}</h1>
            </div>
        </div>
    )
}

export default AboutUs