import React, { createContext, useState } from "react";
//Helpers
import { db } from "../firebaseConfig";
//Firebase
import firebase from "firebase/compat/app";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const UserDataContext = createContext();

export function UserDataContextProvider(props) {
  const [user, setUser] = useState({
    userLoggedIn: false,
    entriesLoaded: false,
    id: "demo",
    name: "Demo User",
  });
  const [sessionSettings, setSessionSettings] = useState({
    appLoaded: false,
  });
  const [userEntries, setUserEntries] = useState(new Array());
  const [userSettings, setUserSettings] = useState(new Object());

  const downloadUserData = async function () {
    console.log("downloading data...");
    const userDatabaseRef = collection(db, user.id);
    let receivedData = new Object();
    receivedData = await getDocs(userDatabaseRef);
    const decipheredEntries = new Array();
    const decipheredSettings = new Object();
    receivedData.docs.map((ent) => {
      if (ent.id !== "settings") {
        decipheredEntries.push({
          id: ent.id,
          isSpending: ent.data().isSpending,
          date: ent.data().date.seconds * 1000,
          sum: ent.data().sum,
          icon: ent.data().icon,
          tags: ent.data().tags,
          group: ent.data().group,
          item: ent.data().item,
          source: ent.data().source,
          comment: ent.data().comment,
        });
      } else if (ent.id === "settings") {
        decipheredSettings.currency = ent.data().currency;
        decipheredSettings.tags = ent.data().tags;
        decipheredSettings.groups = ent.data().groups;
        decipheredSettings.items = ent.data().items;
        decipheredSettings.sources = ent.data().sources;
      }
    });
    setUserEntries(decipheredEntries);
    setUserSettings(decipheredSettings);
    setUser({ ...user, entriesLoaded: true });
  };

  const logout = function () {
    firebase.auth().signOut();
    setUser({ id: "demo", name: "Demo User" });
    setSessionSettings({ appLoaded: false });
    setUserEntries(new Array());
    setUserSettings(new Object());
  };

  //User authentication listener
  const auth = getAuth();
  onAuthStateChanged(auth, (usr) => {
    if (usr && !user.userLoggedIn) {
      setUser({
        userLoggedIn: true,
        entriesLoaded: false,
        id: usr.uid,
        name: usr.displayName,
        pic: usr.photoURL,
      });
    }
    //The following is the first entry download only:
    user.userLoggedIn && !user.entriesLoaded && downloadUserData();
  });

  return (
    <UserDataContext.Provider
      value={{
        user,
        setUser,
        userEntries,
        userSettings,
        logout,
        sessionSettings,
        setSessionSettings,
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
}
