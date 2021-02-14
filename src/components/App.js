import React, {useEffect, useState} from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithImage from './PopupWithImage.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import DeleteCardPopup from './DeleteCardPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import FormValidator from './FormValidator.js';
import api from '../utils/api.js';
import CurrentUserContext from '../contexts/CurrentUserContext.js';


function App() {
    const [editAvatarOpen, setEditAvatarOpen] = useState(false);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [addCardOpen, setAddCardOpen] = useState(false);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [imagePopupOpen, setImagePopupOpen] = useState(false);
    //set image popup states
    const [selectedCard, setSelectedCard] = useState('');
    //state variable for current user - calls api.getUserInfo()
    const [currentUser, setCurrentUser] = useState('');
    //set card states
    const [cards, setCards] = useState([]); 

    function handleCardLike(card) {
    //check one more time if this card was already liked
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    let likeStatus
    if(isLiked === false){
        likeStatus = api.addLike(card._id)
    }
    else{
        likeStatus = api.removeLike(card._id)
    }
    likeStatus
    .then((newCard) => {
        const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        //update the state
        setCards(newCards);
    })
    .catch((err) => console.log(err));
 } 

 function handleCardDeleteSubmit(card = selectedCard){
     api.removeCard(card._id)
     .then(() => {
         const cardList = cards.filter((c) => (c._id !== card._id))
         setCards(cardList);
     })
     .catch((err) => console.log(err))
     .finally(() => closeAllPopups());
 }

 
    //call server for profile content
    useEffect(() => {
        api.getInitialCards()
        .then((res) => {
            setCards(res)
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        api.getUserInfo()
        .then((res) => {
            setCurrentUser(res);
        })
        .catch(err => console.log(err));
    }, []);
    
    function handleUpdateUser({name, about}){
        api.setUserInfo({name, about})
        .then((res) => {
            setCurrentUser(res);
        })
        .catch((err) => console.log(err))
        .finally(() => closeAllPopups());
    }

    function handleUpdateAvatar(avatar) {
        api.setUserAvatar(avatar)
        .then((res) => {
            setCurrentUser(res);
        })
        .catch((err)=> console.log(err))
        .finally(() => closeAllPopups());
    }

    function handleAddPlace({name, link}){
        api.addCard({name, link})
        .then((newCard)=> {
           setCards([newCard, ...cards]);
        })
        .catch((err) => console.log(err))
        .finally(()=> closeAllPopups());
        }
    

    //handler functions for popups
    function handleEditAvatarClick() {
        setEditAvatarOpen(true);
    } 

    function handleEditProfileClick() {
        setEditProfileOpen(true);
    }

    function handleAddCardClick() {
        setAddCardOpen(true);
    }

    function handleCardDeleteClick(card) {
        setDeletePopupOpen(true);
        setSelectedCard(card)
    }

    function closeAllPopups() {
        setEditAvatarOpen(false);
        setEditProfileOpen(false);
        setAddCardOpen(false);
        setDeletePopupOpen(false);
        setImagePopupOpen(false);
    }

    function handleClosePopups(e){
        if(e.target !== e.currentTarget)
        return
        closeAllPopups()
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setImagePopupOpen(true);
    }

    return (
    
    <div className="body">

    <CurrentUserContext.Provider value={currentUser}>
    
    <Header />
    
    <Main 
    //prop values passed to main
     cards = {cards}
     onEditAvatar = {handleEditAvatarClick}
     onEditProfile = {handleEditProfileClick}
     onAddPlace = {handleAddCardClick}
     onCardDelete = {handleCardDeleteClick}
     onCardClick = {handleCardClick}
     onCardLike = {handleCardLike}
    />

    <Footer />

    <EditAvatarPopup 
        isOpen={editAvatarOpen} 
        onClose={handleClosePopups} 
        onUpdateAvatar={handleUpdateAvatar} />

    <EditProfilePopup 
        isOpen={editProfileOpen} 
        onClose={handleClosePopups} 
        onUpdateUser={handleUpdateUser}/>

    <AddPlacePopup
        isOpen={addCardOpen}
        onClose = {handleClosePopups}
        onAddPlace = {handleAddPlace}
    />

    <DeleteCardPopup 
        isOpen={deletePopupOpen} 
        onClose={handleClosePopups} 
        onDeleteCard = {handleCardDeleteSubmit}/>

    <PopupWithImage 
    card={selectedCard} 
    isOpen={imagePopupOpen} 
    onClose={closeAllPopups} />
    
    </CurrentUserContext.Provider> 
    
    </div>
  );
  }
export default App;
