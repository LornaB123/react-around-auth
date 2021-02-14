import PopupWithForm from './PopupWithForm.js';
import React from 'react';

function DeleteCardPopup(props) {

    const {
        isOpen,
        onClose,
        onDeleteCard
    } = props;

    
    function handleSubmit(e) {
        // Prevent the browser from navigating to the form address
        e.preventDefault();
        onDeleteCard();
        }

    return (
        <PopupWithForm 
        name="type_delete-card" 
        title="Are you sure?" 
        buttonText="Yes" 
        isOpen={isOpen} 
        onClose={onClose}
        onDeleteCard={onDeleteCard}
        onSubmit = {handleSubmit} />
    );
}

export default DeleteCardPopup;