import { useState } from "react";
export const useModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");

    const toggleModal = () => {
        setShowModal(prev => !prev);
    };

    return {
        showModal,
        modalType,
        setShowModal,   
        setModalType,
        toggleModal    
    };
};

