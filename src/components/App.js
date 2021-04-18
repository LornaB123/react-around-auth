import React, { useEffect, useState } from "react";
import {
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithImage from "./PopupWithImage.js";
import PopupWithForm from "./PopupWithForm.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import Login from "./Login.js";
import Register from "./Register.js";
import InfoToolTip from "./InfoToolTip.js";

import api from "../utils/api.js";
import auth from '../utils/auth.js';
import ProtectedRoute from "./ProtectedRoute.js";

function App() {
  const [editAvatarOpen, setEditAvatarOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  const [tooltipMode, setTooltipMode] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const history = useHistory();

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    let likeStatus;
    if (isLiked === false) {
      likeStatus = api.addLike(card._id);
    } else {
      likeStatus = api.removeLike(card._id);
    }
    likeStatus
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        //update the state
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        const cardList = cards.filter((c) => c._id !== card._id);
        setCards(cardList);
      })
      .catch((err) => console.log(err));
  }

  //call server for profile content
  useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
      const jwt = localStorage.getItem('jwt');
      if(jwt) {
          auth
          .getContent(jwt)
          .then((res) => {
              setLoggedIn(true);
              setUserEmail(res.data.email);
          })
          .catch((err) => {
              console.log(err);
          }); 
      } else {
          setLoggedIn(false);
      }
  }, []);

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo({ name, about })
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => console.log(err))
      .finally(() => closeAllPopups());
  }

  function handleUpdateAvatar(avatar) {
    api
      .setUserAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => console.log(err))
      .finally(() => closeAllPopups());
  }

  function handleAddPlace({ name, link }) {
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((err) => console.log(err))
      .finally(() => closeAllPopups());
  }

  //handler functions for popups
  function handleEditAvatarClick(e) {
    setEditAvatarOpen(true);
  }

  function handleEditProfileClick(e) {
    setEditProfileOpen(true);
  }

  function handleAddCardClick(e) {
    setAddCardOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarOpen(false);
    setEditProfileOpen(false);
    setAddCardOpen(false);
    setDeletePopupOpen(false);
    setImagePopupOpen(false);
    setIsInfoToolTipOpen(false);
  }

  function handleClosePopups(e) {
    if (e.target !== e.currentTarget) return;
    closeAllPopups();
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function resetForm() {
    setEmail('');
    setPassword('');
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const [email, password] = [e.target.email.value, e.target.password.value];
    auth
      .authorize(email, password)
      .then((data) => {
        if (data && data.token) {
          handleLogin();
        } else {
          resetForm();
          if (!email || !password) {
            throw new Error('400 - one or more of the fields were not provided');
          }
          if (!data) {
            throw new Error('401 - bad email or password');
          }
        }
      })
      .then(() => {
        resetForm();
      })
      .then(() => {
        history.push('/main');
      })
      .catch((err) => console.log(err.message));
  };

  function handleRegisterSubmit(e){
    e.preventDefault();
    auth.register(email, password)
      .then((res) => {
        if (!res.data) {
          handleToolTip('failure');
          throw new Error(`400 - ${res.message ? res.message : res.error}`);
        }})
        .then((res) => {
          setRegistered(true);
          history.push('/signin');
          return res;
        })
        .then((res) => {
          handleToolTip('success');
          return res;
        })
      .then(resetForm)
      .catch(err => {
        console.log(err)
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    history.push('/signin');
  }

  function handleToolTip(mode) {
    setTooltipMode(mode);
    setIsInfoToolTipOpen(true);
  }



  return (
    <div className="body">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
            loggedIn={loggedIn}
            logout={handleLogout}
            email={userEmail}
        />
        <Switch>
          <Route path="/signin">
            <Login
              loggedIn={loggedIn}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              userEmail={setUserEmail}
              setUserEmail={setUserEmail}
              handleLogin={handleLogin}
              handleLoginSubmit={handleLoginSubmit}
              handleToolTip={handleToolTip}
            />
            <InfoToolTip
              isOpen={isInfoToolTipOpen}
              onClose={closeAllPopups}
              loggedIn={loggedIn}
              mode={tooltipMode}
            />
          </Route>
          <Route exact path="/signup">
          <Register
              registered={registered}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleRegisterSubmit={handleRegisterSubmit}
              setUserEmail={setUserEmail}
              handleLogin={handleLogin}
              handleToolTip={handleToolTip}
            />
            <InfoToolTip
              isOpen={isInfoToolTipOpen}
              onClose={closeAllPopups}
              loggedIn={loggedIn}
              mode={tooltipMode}
            />
          </Route>
          <ProtectedRoute 
            path="/main" 
            loggedIn={loggedIn}>
            <Main
              cards={cards}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddCardClick}
              onCardDelete={handleCardDelete}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCloseButtons={closeAllPopups}
            />
            <Footer />
            <EditAvatarPopup
              isOpen={editAvatarOpen}
              onClose={handleClosePopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
            <EditProfilePopup
              isOpen={editProfileOpen}
              onClose={handleClosePopups}
              onUpdateUser={handleUpdateUser}
            />
            <AddPlacePopup
              isOpen={addCardOpen}
              onClose={handleClosePopups}
              onAddPlace={handleAddPlace}
            />
            <PopupWithForm
              name="type_delete-card"
              title="Are you sure?"
              buttonText="Yes"
              isOpen={deletePopupOpen}
              onClose={handleClosePopups}
            />
            <PopupWithImage
              card={selectedCard}
              isOpen={imagePopupOpen}
              onClose={handleClosePopups}
            />
          </ProtectedRoute>
          <Route path="/">
            {loggedIn ? <Redirect to="/main" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
      </CurrentUserContext.Provider>
    </div>
  );
}
export default App;
