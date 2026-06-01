import "../styles/Rent2.css";
import { useTranslation } from "react-i18next";
import { CiHeart } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import Firebase from "../Firebase/Firebase.js";
import Loading from "../components/Loading.js";
import { TbRuler, TbRuler2Off } from "react-icons/tb";
import { v4 as uuid } from "uuid";
import { useContext, useState, useEffect } from "react";
import { LikeContext } from "../components/likedContext.js";
import { IoMdHeart } from "react-icons/io";
import axios from "axios";
import "react-medium-image-zoom/dist/styles.css";
import Zoom from "react-medium-image-zoom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import CardSlider from "../components/CardSlider.js";
import FullSlider from "../components/FullSlider.js";

function Rent(props) {
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
  const [zoomImage, setZoomImage] = useState(null);
  const [fullCard, setFullCard] = useState(null);

  const { likedIds, toggleLike } = useContext(LikeContext);

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

  const { t } = useTranslation();
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
    <div className={`Rent2 ${darkMode ? "dark" : ""}`}>
      <div className="orqaga">
        <Link className="back-line" to="/">
        <h1><MdKeyboardArrowLeft /> {t("orqaga")}</h1>
        </Link>
      </div>

      {/* <button
        className="darkToggle"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? <TbRuler2Off /> : <TbRuler />}
      </button> */}

      <div className="Rent2_text">
        <h1>{t("rent")}</h1>
      </div>

      <div className="rentFiltersWrapper">
        <button className="openFilterBtn" onClick={() => setIsFilterOpen(true)}>
          {t("sort")}
        </button>

        <div className="rentFilters">
          <input
            type="text"
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="number"
            placeholder={t("minArea")}
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
          />

          <input
            type="number"
            placeholder={t("maxArea")}
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
          />

          <div className="sortButtons">
            <button
              className={sortType === "new" ? "active" : ""}
              onClick={() => setSortType("new")}
            >
              {t("newest")}
            </button>

            <button
              className={sortType === "popular" ? "active" : ""}
              onClick={() => setSortType("popular")}
            >
              {t("popular")}
            </button>
          </div>
        </div>
      </div>

      <div className="cardsAndLoading">
        {isLoading ? (
          <div className="rentLoading">
            <Loading />
          </div>
        ) : (
          <div className="cards">
            {filteredCards.map((card) => (
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

                <div className="rentcardline"></div>

                {/* <h3 className="price">
                  {t("price")}: {card.price} $<div className="priceline"></div>
                  <span>{t("oyiga")}</span>
                </h3>

                <div className="rentcardline"></div> */}

                <h4 className="phoneNum">{t("phonenumber")}: +998 (90) 996-51-02</h4>

                <div className="rentcardline"></div>

                <div className="rentcardicons">
                  <i onClick={() => toggleLike(card._id)} className="likeIcon">
                    <IoMdHeart
                      style={{
                        color: likedIds?.includes(card._id) ? "red" : "gray",
                        cursor: "pointer",
                      }}
                    />
                  </i>

                  {currentUser === adminEmailMain && (
                    <button className="editBtn" onClick={() => handleEdit(card)}>
                    {t("editBtn")}
                  </button>
                  )}

                  {currentUser === adminEmailMain && (
                    <button
                      className="deleteBtn"
                      onClick={() => setConfirmDeleteId(card._id)}
                    >
                      {t("delete")}
                    </button>
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>{t("edit")}</h2>

            <label>{t("title")}</label>
            <input
              value={editData.initInformation}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  initInformation: e.target.value,
                })
              }
            />

            <label>{t("description")}</label>
            <input
              value={editData.additInformation}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  additInformation: e.target.value,
                })
              }
            />

            <label>{t("flloor")}</label>
            <input
              type="number"
              value={editData.floor}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  floor: e.target.value,
                })
              }
              onWheel={handleNumberInputWheel}
            />

              <label>{t("totalarea")}</label>
            <input
              type="number"
              value={editData.totalarea}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  totalarea: e.target.value,
                })
              }
              onWheel={handleNumberInputWheel}
            />

              <label>{t("livingarea")}</label>
            <input
              type="number"
              value={editData.livingarea}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  livingarea: e.target.value,
                })
              }
              onWheel={handleNumberInputWheel}
            />

            <label>{t("rooms")}</label>
            <input
              type="number"
              value={editData.rooms}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  rooms: e.target.value,
                })
              }
              onWheel={handleNumberInputWheel}
            />

            {/* <label>{t("price")}</label>
            <input
              value={editData.price}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  price: e.target.value,
                })
              }
            /> */}

            {/* <label>{t("phone")}</label>
            <input
              value={editData.phoneNumber}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 12) value = value.slice(0, 12);

                setEditData({
                  ...editData,
                  phoneNumber: value,
                });
              }}
            /> */}

            <div className="modalButtons">
              <button
                className="saveBtn"
                onClick={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveEdit();
                  }
                }}
              >
                {t("save")}
              </button>
              <button
                className="cancelBtn"
                onClick={() => setIsEditOpen(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomImage && (
        <div className="zoomOverlay" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} className="zoomFull" />
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

      {confirmDeleteId && (
        <div
          className="confirmOverlay"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div className="confirmBox" onClick={(e) => e.stopPropagation()}>
            <h2>{t("deleteconfirm")}</h2>
            <p>{t("deleteP")}</p> 

            <div className="confirmButtons">
              <button
                className="confirmYes"
                onClick={() => {
                  handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                {t("ha")}
              </button>

              <button
                className="confirmNo"
                onClick={() => setConfirmDeleteId(null)}
              >
                {t("yoq")}
              </button>
            </div>
          </div>
        </div>
      )}

      {isFilterOpen && (
        <div
          className="filterModalOverlay"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="filterModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Sort & Filter</h2>

            <input
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              type="number"
              placeholder={t("minArea")}
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              onWheel={handleNumberInputWheel}
            />

            <input
              type="number"
              placeholder={t("maxArea")}
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              onWheel={handleNumberInputWheel}
            />

            <div className="sortButtons modalSort">
              <button
                className={sortType === "new" ? "active" : ""}
                onClick={() => setSortType("new")}
              >
                {t("newest")}
              </button>

              <button
                className={sortType === "popular" ? "active" : ""}
                onClick={() => setSortType("popular")}
              >
                {t("popular")}
              </button>
            </div>

            <button
              className="closeFilterBtn"
              onClick={() => setIsFilterOpen(false)}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rent;