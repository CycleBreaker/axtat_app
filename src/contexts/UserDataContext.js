import React, { createContext, useState } from "react";
//Helpers
import { db } from "../firebaseConfig";
//Firebase
import firebase from "firebase/compat/app";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
  const [userSettings, setUserSettings] = useState({
    currency: { name: "Ukrainian Hryvnia", symbol: "₴" },
    tags: [{ color: 1, name: "Me" }],
    groups: [{ name: "Food", icon: "🍗" }],
    items: [{ name: "Home-Cooked", parent: "Food" }],
    sources: [{ name: "Salary" }],
  });

  const downloadUserData = async function () {
    const userDatabaseRef = collection(db, user.id);
    await getDocs(userDatabaseRef).then((dt) => {
      updateUserEntries(dt);
      updateSettings(dt);
    });
  };

  const updateUserEntries = async function () {
    const userDatabaseRef = collection(db, user.id);
    await getDocs(userDatabaseRef).then((dt) => {
      const decipheredEntries = new Array();
      dt.docs.map((ent) => {
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
        }
      });
      setUserEntries(decipheredEntries);
      setUser({ ...user, entriesLoaded: true });
    });
  };

  const updateSettings = async function () {
    const userSettingsRef = doc(db, `${user.id}/settings`);
    console.log(userSettingsRef);
    const userSettingsSnap = await getDoc(userSettingsRef);
    if (userSettingsSnap.exists()) {
      console.log(userSettingsSnap);
      setUserSettings({
        currency: userSettingsSnap.data().currency,
        tags: userSettingsSnap.data().tags,
        groups: userSettingsSnap.data().groups,
        items: userSettingsSnap.data().items,
        sources: userSettingsSnap.data().sources,
      });
    }
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
        updateUserEntries,
        updateSettings,
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
}
