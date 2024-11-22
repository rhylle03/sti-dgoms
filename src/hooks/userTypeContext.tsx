"use client";

import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface UserTypeContextType {
  userType: string;
  setUserType: Dispatch<SetStateAction<string>>;
}

const UserTypeContext = createContext<UserTypeContextType>({
  userType: "",
  setUserType: () => {},
});

export const useUserType = () => {
  return useContext(UserTypeContext);
};

export const UserTypeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userType, setUserType] = useState<string>("");

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};
