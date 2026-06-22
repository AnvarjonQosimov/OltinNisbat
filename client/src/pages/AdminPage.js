import "../styles/AdminPage.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../Firebase/Firebase";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";

function AdminPage() {
    const { t } = useTranslation();

  const [usersCount, setUsersCount] = useState(0);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sortType, setSortType] = useState("newest");
  const [search, setSearch] = useState("");
  const adminEmail = "oltinnisbatarch@gmail.com";
  const [users, setUsers] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showUsersModal, setShowUsersModal] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);
  useEffect(() => {
    fetchUsers();
    fetchCards();
  }, []);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersData);
    setUsersCount(usersData.length);
  };

  const fetchCards = async () => {
    try {
      const res = await axios.get("https://oltinnisbat.onrender.com/api/post/get");
      setCards(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteCard = async (id) => {
    try {
      await axios.delete(`https://oltinnisbat.onrender.com/api/post/delete/${id}`);
      setCards(cards.filter((card) => card._id !== id));
      setSelectedCard(null);
    } catch (err) {
      console.log(err);
    }
  };

  const sortedCards = [...cards]
    .filter((card) =>
      card.initInformation.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortType === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortType === "views") {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });

  if (!currentUser || currentUser.email !== adminEmail) {
    return (
      <div className="AdminPage">
        <h2>Access Denied</h2>
      </div>
    );
  }

  const handleDelete = async (id) => {
  await deleteCard(id);
};

  return (
    <div className="AdminPage">
      <h1>{t("adminpanel")}</h1>
      <div className="stats">
        <div className="statBox" onClick={() => setShowUsersModal(true)} style={{ cursor: 'pointer' }}>
          <h2>{t("users")}</h2>
          <p>{usersCount}</p>
        </div>
        <div className="statBox">
          <h2>{t("cards")}</h2>
          <p>{cards.length}</p>
        </div>
        <div className="statBox">
          <h2>{t("views")}</h2>
          <p>{cards.reduce((acc, card) => acc + (card.views || 0), 0)}</p>
        </div>
      </div>
      <div className="controls">
        <input
          type="text"
          placeholder={t("searchpl")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="choose" value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="newest">{t("newest")}</option>
          <option value="views">{t("mostviewed")}</option>
        </select>
      </div>
      <div className="cardsList">
        {sortedCards.map((card) => (
          <div
            key={card._id}
            className="adminCard"
            onClick={() => setSelectedCard(card)}
          >
            <h3>{card.initInformation}</h3>
            <p>{card.additInformation}</p>
            <span className="views">👁 {card.views || 0}</span>
          </div>
        ))}
      </div>
      {selectedCard && (
        <div className="modalOverlay" onClick={() => setSelectedCard(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCard.initInformation}</h2>
            <p>{selectedCard.additInformation}</p>
            <p>
              <strong>{t("id")}:</strong> {selectedCard._id}
            </p>
            <p>
              <strong>{t("views")}:</strong> {selectedCard.views || 0}
            </p>
            <p>
              <strong>{t("posted")}:</strong>{" "}
              {selectedCard.createdAt
                ? new Date(selectedCard.createdAt).toLocaleString()
                : t("unknown")}
            </p>
            <div className="modalButtons">
              {currentUser === adminEmail && (
                <button
                  className="deleteBtn"
                  onClick={() => setConfirmDeleteId(selectedCard._id)}
                >
                  {t("delete")}
                </button>
              )}
              <button
                className="closeBtn"
                onClick={() => setSelectedCard(null)}
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

      {showUsersModal && (
        <div
          className="modalOverlay"
          onClick={() => setShowUsersModal(false)}
        >
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>{t("users")}</h2>
            <div className="usersList">
              {users.map((user) => (
                <div key={user.id} className="userItem">
                  <p>{user.email}</p>
                </div>
              ))}
            </div>
            <div className="modalButtons">
              <button
                className="closeBtn"
                onClick={() => setShowUsersModal(false)}
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminPage;