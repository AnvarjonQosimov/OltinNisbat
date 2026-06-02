import React, { useEffect, useState } from "react";
import "../styles/AboutUser.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import personFace from "../images/personFace.jpg";

function AboutUser() {
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

// console.log(user?.photoURL);

  return (
    <div className="AboutUser">
      <div className="aboutUserCard">
        <div className="classTop">
          <img
            src={user?.photoURL || personFace}
            alt={t("user")}
            className="userImage"
          />
          <h1>{user?.displayName || user?.phoneNumber || t("user")}</h1>
        </div>

        <div className="classTopLine"></div>

        <div className="classBottom">
          {user?.phoneNumber && (
            <div className="infoRow">
              <h3>📞 {t("phoneNumber_label")}</h3>
              <div className="lineInRight"></div>
              <h3 className="infoValue">{user.phoneNumber}</h3>
            </div>
          )}

          {user?.email && (
            <div className="infoRow">
              <h3>📧 {t("email_label")}</h3>
              <div className="lineInRight"></div>
              <h3 className="infoValue">{user.email}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutUser;
