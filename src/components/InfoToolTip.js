import React from 'react';
import PopupWithForm from './PopupWithForm';
import circleCheck from '../images/circleCheck.png';
import circleX from '../images/circleX.png';

function InfoToolTip(props) {
    const { isOpen, onClose, mode } = props;
  return (
    <PopupWithForm name='tooltip' isOpen={isOpen} onClose={onClose}>
      <img
        className='popup__tooltip-icon'
        src={mode === 'success' ? circleCheck : circleX}
        alt='check mark'
      />
      <h2 className='popup__tooltip-title'>
        {props.mode === 'success'
          ? 'Success! You have now been registered'
          : 'Oops, something went wrong! Please try again.'}
      </h2>
    </PopupWithForm>
  );
}

export default InfoToolTip;