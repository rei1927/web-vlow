
import React, { createContext, useContext, useState } from 'react';

const ConsultationContext = createContext();

export function ConsultationProvider({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <ConsultationContext.Provider value={{ isModalOpen, openModal, closeModal }}>
            {children}
        </ConsultationContext.Provider>
    );
}

export function useConsultation() {
    return useContext(ConsultationContext);
}
