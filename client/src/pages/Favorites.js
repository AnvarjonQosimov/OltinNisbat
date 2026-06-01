import React, { useContext, useEffect, useState } from "react";
import "../styles/Favorites.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { LikeContext } from "../components/likedContext";
import { FaHeartBroken } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import CardSlider from "../components/CardSlider";
import FullSlider from "../components/FullSlider";

function Features() {
  const { likedIds, toggleLike } = useContext(LikeContext);
  const [confirmUnlike, setConfirmUnlike] = useState(null);
  const { t } = useTranslation();

  const [cards, setCards] = useState([]);
  const [currentSlide, setCurrentSlide] = useState({});
  const [zoomImage, setZoomImage] = useState(null);
  const [fullCard, setFullCard] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get("http://localhost:8070/api/post/get")
      .then((res) => {
        if (!cancelled) setCards(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load cards:", err);
        if (!cancelled) setCards([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const likedCards = cards.filter((c) => likedIds.includes(c._id));



  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isClickedHeart, setIsClickedHeart] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("rentDarkMode") === "true";
  });
  const adminEmailMain = "oltinnisbatarch@gmail.com";
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const authUser = localStorage.getItem("userEmail");
    if (authUser) {
      setCurrentUser(authUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rentDarkMode", darkMode);
  }, [darkMode]);

  const [userCards, setUserCards] = useState([]);
  const [search, setSearch] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [sortType, setSortType] = useState("new");
  const [isLoading, setIsLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    initInformation: "",
    additInformation: "",
    floor: "",
    totalarea: "",
    livingarea: "",
    rooms: "",
    price: "",
    phoneNumber: "",
  });
  const [editId, setEditId] = useState(null);

  const handleNumberInputWheel = (e) => {
    e.preventDefault();
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get("http://localhost:8070/api/post/get");
      setUserCards(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const filteredCards = userCards
    .filter((card) => {
      const matchesSearch =
        card.initInformation?.toLowerCase().includes(search.toLowerCase()) ||
        card.additInformation?.toLowerCase().includes(search.toLowerCase()) ||
        card.floor?.toString().includes(search.toLowerCase()) ||
        card.totalarea?.toString().includes(search.toLowerCase()) ||
        card.livingarea?.toString().includes(search.toLowerCase()) ||
        card.rooms?.toString().includes(search.toLowerCase());

      const matchesMin = minArea ? card.totalarea >= Number(minArea) : true;
      const matchesMax = maxArea ? card.totalarea <= Number(maxArea) : true;

      return matchesSearch && matchesMin && matchesMax;
    })
    .sort((a, b) => {
      if (sortType === "cheap") {
        return a.price - b.price;
      }

      if (sortType === "popular") {
        return (b.views || 0) - (a.views || 0);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const heartClicked = () => {
    setIsClickedHeart((prev) => !prev);
    setIsHeartClicked((prev) => !prev);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/api/post/delete/${id}`);
      setUserCards((prev) => prev.filter((card) => card._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (card) => {
    setEditData({
      initInformation: card.initInformation,
      additInformation: card.additInformation,
      floor: card.floor,
      totalarea: card.totalarea,
      livingarea: card.livingarea,
      rooms: card.rooms,
      price: card.price,
      phoneNumber: card.phoneNumber,
    });
    setEditId(card._id);
    setIsEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:8070/api/post/edit/${editId}`,
        editData,
      );

      setUserCards((prev) =>
        prev.map((card) =>
          card._id === editId ? { ...card, ...editData } : card,
        ),
      );

      setIsEditOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (isEditOpen) {
        if (e.key === "Enter") {
          e.preventDefault();
          saveEdit();
        }

        if (e.key === "Escape") {
          setIsEditOpen(false);
        }
      }

      if (fullCard && e.key === "Escape") {
        setFullCard(null);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [isEditOpen, fullCard]);

  return (
    <div className="Features">
      <div className="features-text">
        <h1>{t("saralanganlar")}</h1>
      </div>

      <div className="features">
        <div className="cards">
  {likedCards.map((card) => (
              <div className="card" key={card._id}>
                <div className="rentVideo">
                  {card.media && card.media.length > 0 && (
                    <CardSlider 
                      media={card.media} 
                      onImageClick={setZoomImage}
                    />
                  )}
                </div>

                <div className="lineee"></div>

                  <div className="cardBottom">
                    <h1>{card.initInformation}</h1>

                <div className="rentcardline"></div>

                {/* <div className="card-h2">
                  <h2
                    className="short-text"
                    onClick={async () => {
                      setFullCard(card);

                      try {
                        await axios.put(
                          `http://localhost:8070/api/post/view/${card._id}`,
                        );

                        setUserCards((prev) =>
                          prev.map((c) =>
                            c._id === card._id
                              ? { ...c, views: (c.views || 0) + 1 }
                              : c,
                          ),
                        );
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  >
                    {card.additInformation.length > 43
                      ? card.additInformation.slice(0, 43) + "..."
                      : card.additInformation}
                  </h2>
                </div> */}

                <div className="card-h2">
                  <h2
                    className="short-text"
                    onClick={async () => {
                      setFullCard(card);

                      try {
                        await axios.put(
                          `http://localhost:8070/api/post/view/${card._id}`,
                        );

                        setUserCards((prev) =>
                          prev.map((c) =>
                            c._id === card._id
                              ? { ...c, views: (c.views || 0) + 1 }
                              : c,
                          ),
                        );
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  >
                    {t("floors")}: {card.floor} <br/>  {t("totalarea")}: {card.totalarea} m² <br/> {t("livingarea")}: {card.livingarea} m² <br/> {t("rooms")}: {card.rooms}
                  </h2>
                </div>

              <div className="rentcardline" />

              <h3>
                {t("phonenumber")}: +998 (90) 996-51-02
              </h3>

              <div className="rentcardline" ></div>

              <div className="rentcardicons">
                <i
                  className="heartBrokenIcon"
                  onClick={() => setConfirmUnlike(card._id)}
                >
                  <FaHeartBroken
                    className={`hbIcon ${
                      likedIds?.includes(card._id) ? "activeHB" : ""
                    }`}
                  />
                </i>
              </div>
            </div>
          </div>
        ))}
        </div>

        {likedCards.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            {t("saralanganyoq")}
          </p>
        )}
      </div>

      {zoomImage && (
        <div className="zoomOverlay" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} className="zoomFull" alt="" />
        </div>
      )}

      {fullCard && (
        <div className="fullModalOverlay" onClick={() => setFullCard(null)}>
          <div
            className="fullModalContent topView"
            onClick={(e) => e.stopPropagation()}
          >
            <FullSlider media={fullCard.media} />

            <div className="topModalInfo">
              <h1>{fullCard.initInformation}</h1>

              <p className="topDescription">{fullCard.additInformation}</p>

              <p className="topDescription"><strong>{t("floors")}:</strong> {fullCard.floor}</p>
              <p className="topDescription"><strong>{t("totalarea")}:</strong> {fullCard.totalarea} m²</p>
              <p className="topDescription"><strong>{t("livingarea")}:</strong> {fullCard.livingarea} m²</p>
              <p className="topDescription"><strong>{t("rooms")}:</strong> {fullCard.rooms}</p>

              {/* <p>
                <strong>{t("price")}:</strong> {fullCard.price} $
              </p> */}

              <p className="bottomDescription">
                <strong>{t("phone")}:</strong> +998 (90) 996-51-02
              </p>

              <button
                className="closeFullBtn"
                onClick={() => setFullCard(null)}
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmUnlike && (
        <div className="confirmOverlay" onClick={() => setConfirmUnlike(null)}>
          <div className="confirmBox" onClick={(e) => e.stopPropagation()}>
            <h2>{t("deletefromfeatures")}</h2>

            <div className="confirmButtons">
              <button
                className="yesBtn"
                onClick={() => {
                  toggleLike(confirmUnlike);
                  setConfirmUnlike(null);
                }}
              >
                {t("ha")}
              </button>

              <button className="noBtn" onClick={() => setConfirmUnlike(null)}>
                {t("yoq")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Features;