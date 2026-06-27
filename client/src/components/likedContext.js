import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../Firebase/Firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedIds, setLikedIds] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const ref = doc(db, "likes", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            setLikedIds(Array.isArray(data.ids) ? data.ids : []);
          } else {
            await setDoc(ref, { ids: [] });
            setLikedIds([]);
          }
        } catch (err) {
          console.error("Error loading likes:", err);
          setLikedIds([]);
        }
      } else {
        setUserId(null);
        setLikedIds([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleLike = async (id) => {
  if (!userId) {
    alert("Пожалуйста, войдите в аккаунт, чтобы ставить лайки.");
    return;
  }

  const ref = doc(db, "likes", userId);

  const isLiked = likedIds.includes(id);

  // мгновенное изменение интерфейса
  if (isLiked) {
    setLikedIds(prev => prev.filter(x => x !== id));
  } else {
    setLikedIds(prev => [...prev, id]);
  }

  try {
    if (isLiked) {
      await updateDoc(ref, {
        ids: arrayRemove(id),
      });
    } else {
      await updateDoc(ref, {
        ids: arrayUnion(id),
      });
    }
  } catch (err) {
    console.error(err);

    // откат если запрос не удался
    if (isLiked) {
      setLikedIds(prev => [...prev, id]);
    } else {
      setLikedIds(prev => prev.filter(x => x !== id));
    }
  }
};

  return (
    <LikeContext.Provider value={{ likedIds, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
};