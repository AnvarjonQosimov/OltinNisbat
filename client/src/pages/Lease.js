import * as React from "react";
import "../styles/Lease.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { db } from "../Firebase/Firebase.js";
import { addDoc, collection, getDocs } from "firebase/firestore";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import Success from "../components/Sucsess.js";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "../components/Loading.js";
import { v4 as uuid } from "uuid";
import InputMask from "react-input-mask";
import axios from "axios";
import { auth } from "../Firebase/Firebase.js";
import { onAuthStateChanged } from "firebase/auth";

function Lease() {
  const [age, setAge] = React.useState("");

  const handleChangeSelect = (event) => {
    setAge(event.target.value);
  };

  const [picture, setPicture] = useState("");
  const [video, setVideo] = useState("");
  const [files, setFiles] = useState([]);
  const [initalInformation, setInitalInformation] = useState("");
  const [additionalInformation, setAdditionalInformation] = useState("");
  const [floor, setFloor] = useState("");
  const [totalarea, setTotalarea] = useState("");
  const [livingarea, setLivingarea] = useState("");
  const [rooms, setRooms] = useState("");
  // const [price, setPrice] = useState("");
  // const [phoneNumberInPanel, setPhoneNumberInPanel] = useState("");
  const [collectionAdmin, setCollectionAdmin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [phoneError, setPhoneError] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [initialError, setInitialError] = useState("");
  const mediaInputRef = React.useRef(null);

  const moveFile = (fromIndex, toIndex) => {
    const updated = [...files];

    const [removed] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, removed);

    setFiles(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Если это внутреннее перемещение файла внутри списка
    if (dragIndex !== null) {
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer.files);

    console.log("Dropped files:", droppedFiles);

    if (droppedFiles.length === 0) return;

    setFiles((prev) => {
      const merged = [...prev];

      droppedFiles.forEach((file) => {
        const exists = merged.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        );

        if (!exists) {
          merged.push(file);
        }
      });

      return merged;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const addData = async (e) => {
    if (initalInformation.length > 21) {
      alert("Initial information не может быть больше 21 букв");
      return;
    }
    e.preventDefault();

    const wordCount = additionalInformation.trim().split(/\s+/).length;
    if (wordCount < 30) {
      alert("Description must contain at least 30 words.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();

      // const cleanPhone = phoneNumberInPanel.replace(/\D/g, "");

      const ownerId = auth.currentUser?.uid;
      formData.append("ownerId", ownerId);
      formData.append("initInformation", initalInformation);
      formData.append("additInformation", additionalInformation);
      formData.append("floor", floor);
      formData.append("totalarea", totalarea);
      formData.append("livingarea", livingarea);
      formData.append("rooms", rooms);
      // formData.append("price", price);
      // formData.append("phoneNumber", cleanPhone);
      formData.append("id", uuid());

      for (let file of files) {
        formData.append("media", file);
      }

      await axios.post(
        "https://oltinnisbat.onrender.com/api/post/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      alert("Ma'lumot muvaffaqiyatli qo'shildi!");
      // <Success className="successJs"/>

      setFiles([]);
      if (mediaInputRef.current) {
        mediaInputRef.current.value = "";
      }

      setVideo(null);
      setInitalInformation("");
      setAdditionalInformation("");
      setFloor("");
      setTotalarea("");
      setLivingarea("");
      setRooms("");
      // setPrice("");
      // setPhoneNumberInPanel("");
      setIsLoading(false);
    } catch (error) {
      console.error("Xatolik:", error);
      setIsLoading(false);
    }
  };

  const { t } = useTranslation();

  // const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(true);

  const handleChange = (value) => {
    // setPhoneNumber(value);
    // setValid(validatePhoneNumber(value));
  };

  // const validatePhoneNumber = (number) => {
  //   const phoneNumberPattern = /^\d{10}$/;
  //   return phoneNumberPattern.test(number);
  // };

  const [isSuccess, setIsSuccess] = useState(false);

  // const issuccessFunc = () => {
  //   setIsSuccess(true);
  // };

  const handleInitialChange = (e) => {
    const value = e.target.value;

    if (value.length > 21) {
      setInitialError("Максимум 21 символов");
      return;
    }

    setInitialError("");
    setInitalInformation(value);
  };

  const adminEmail = "oltinnisbatarch@gmail.com";

  const handleNumberInputWheel = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const [dragIndex, setDragIndex] = useState(null);

  return (
    <div className="Lease">
      <div className="Lease">
        <div className="adminPanel">
          <div className="leasetext">
            <h1>{t("lease")}</h1>
          </div>

          {isLoading ? (
            <div className="leaseLoading">
              <Loading />
            </div>
          ) : (
            <div>
              <form
                onSubmit={(e) => addData(e)}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="media-upload-container">
                  <input
                    ref={mediaInputRef}
                    id="media"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files);

                      setFiles((prev) => [...prev, ...selectedFiles]);

                      e.target.value = "";
                    }}
                    style={{ display: "none" }}
                  />

                  <div className="preview-container">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="preview-item"
                        draggable
                        onDragStart={() => setDragIndex(index)}
                        onDragEnd={() => setDragIndex(null)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (dragIndex === null || dragIndex === index) return;

                          const updated = [...files];

                          const [moved] = updated.splice(dragIndex, 1);
                          updated.splice(index, 0, moved);

                          setFiles(updated);
                          setDragIndex(null);
                        }}
                      >
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="preview-image"
                          />
                        ) : (
                          <video
                            className="preview-video"
                            src={URL.createObjectURL(file)}
                            controls
                          />
                        )}

                        <button
                          className="remove-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            setFiles(files.filter((_, i) => i !== index));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div
                    className="media-upload-label"
                    onClick={() => {
                      mediaInputRef.current.value = null;
                      mediaInputRef.current.click();
                    }}
                  >
                    {files.length > 0
                      ? `Selected: ${files.length} files`
                      : t("ivideo")}
                  </div>
                </div>

                {/* <label htmlFor="media" className="media-upload-label">
                    {picture?.name || video?.name || t("ivideo")}
                  </label>

                  {!(picture?.name || video?.name) && (
                    <label className="floating-label">{t("ivideo")}</label>
                  )} */}

                <div className="lease-line" />

                <div className="input-container">
                  <input
                    type="text"
                    value={initalInformation}
                    maxLength={25}
                    className="input-field"
                    placeholder=" "
                    onChange={handleInitialChange}
                    id="name"
                    required
                  />
                  <label htmlFor="name" className="input-label">
                    {t("initalinf")}
                    <span />
                  </label>
                </div>

                <div className="input-container">
                  <textarea
                    value={additionalInformation}
                    className="input-field"
                    placeholder=" "
                    onChange={(e) => setAdditionalInformation(e.target.value)}
                    id="optional"
                  />
                  <label htmlFor="optional" className="input-label">
                    {t("additionalinf")}
                  </label>
                </div>

                <div className="input-container">
                  <input
                    type="number"
                    value={floor}
                    className="input-field"
                    placeholder=" "
                    onChange={(e) => setFloor(e.target.value)}
                    onWheel={handleNumberInputWheel}
                    id="floor"
                    required
                  />
                  <label htmlFor="floor" className="input-label">
                    {t("number of floors")}
                    <span />
                  </label>
                </div>

                <div className="input-container">
                  <input
                    type="number"
                    value={totalarea}
                    className="input-field"
                    placeholder=" "
                    onChange={(e) => setTotalarea(e.target.value)}
                    onWheel={handleNumberInputWheel}
                    id="totalarea"
                    required
                  />
                  <label htmlFor="totalarea" className="input-label">
                    {t("total area")}
                    <span />
                  </label>
                </div>

                <div className="input-container">
                  <input
                    type="number"
                    value={livingarea}
                    className="input-field"
                    placeholder=" "
                    onChange={(e) => setLivingarea(e.target.value)}
                    onWheel={handleNumberInputWheel}
                    id="livingarea"
                    required
                  />
                  <label htmlFor="livingarea" className="input-label">
                    {t("living area")}
                    <span />
                  </label>
                </div>

                <div className="input-container">
                  <input
                    type="number"
                    value={rooms}
                    className="input-field"
                    placeholder=" "
                    onChange={(e) => setRooms(e.target.value)}
                    onWheel={handleNumberInputWheel}
                    id="rooms"
                    required
                  />
                  <label htmlFor="rooms" className="input-label">
                    {t("number of rooms")}
                    <span />
                  </label>
                </div>

                {/* <div className="input-container">
                  <input
                    type="number"
                    value={price}
                    className="input-field"
                    placeholder=" "
                    onChange={(e) => setPrice(e.target.value)}
                    id="price"
                    required
                  />
                  <label htmlFor="price" className="input-label">
                    {t("price")}
                    <span>{t("pricepl")}</span>
                  </label>
                </div> */}

                {/* <div className="container phone-custom">
                  <PhoneInput
                    country={"uz"}
                    value={phoneNumberInPanel}
                    onChange={(phone) => setPhoneNumberInPanel(phone)}
                    inputProps={{
                      name: "phone",
                      required: true,
                      autofocus: true,
                    }}
                  />
                </div> */}

                {user?.email === adminEmail && (
                  <button type="submit">{t("savebtn")}</button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lease;
