import { createContext, useContext, useState } from 'react';

type AuthModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{
      isOpen,
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false)
    }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};