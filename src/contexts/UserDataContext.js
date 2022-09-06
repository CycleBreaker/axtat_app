import React, { createContext, useState, useEffect } from "react";
//Helpers
import { db } from "../firebaseConfig";
import { demoUserData } from "../config";
//Firebase
import firebase from "firebase/compat/app";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const UserDataContext = createContext();

export function UserDataContextProvider(props) {
  const userSettingsPlaceholder = {
    currency: { name: "Ukrainian Hryvnia", symbol: "₴" },
    tags: [{ color: 1, name: "Me" }],
    groups: [{ name: "Food", icon: "🍗" }],
    items: [{ name: "Home-Cooked", parent: "Food" }],
    sources: [{ name: "Salary" }],
    statistics: [],
  };
  const [user, setUser] = useState({
    userLoggedIn: false,
    entriesLoaded: false,
    settingsLoaded: false,
    fetchingUserData: false,
    id: null,
    name: null,
    demoMode: false,
  });
  const [sessionSettings, setSessionSettings] = useState({
    appLoaded: false,
  });
  const [userEntries, setUserEntries] = useState(new Array());
  const [userSettings, setUserSettings] = useState(userSettingsPlaceholder);

  const downloadUserData = async function () {
    const userDatabaseRef = collection(db, user.id);
    await getDocs(userDatabaseRef).then((dt) => {
      updateUserEntries(dt);
      updateSettings(dt);
    });
  };

  const updateUserEntries = async function () {
    const userDatabaseRef = collection(db, user.id);
    const q = query(userDatabaseRef, orderBy("date", "desc"));
    await getDocs(q).then(
      (dt) => {
        const decipheredEntries = new Array();
        let prevEntryDate = null;
        dt.docs.map((ent, i) => {
          if (ent.id !== "settings") {
            const curEntryDate = new Date(ent.data().date.seconds * 1000);
            if (i === 0) {
              decipheredEntries.push({
                sum: 0,
                date: ent.data().date.seconds * 1000,
              });
            } else if (prevEntryDate) {
              if (
                `${prevEntryDate.getDate()} ${prevEntryDate.getMonth()} ${prevEntryDate.getFullYear()}` !==
                `${curEntryDate.getDate()} ${curEntryDate.getMonth()} ${curEntryDate.getFullYear()}`
              ) {
                decipheredEntries.push({
                  sum: 0,
                  date: ent.data().date.seconds * 1000,
                });
              }
            }
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
          prevEntryDate = new Date(ent.data().date.seconds * 1000);
        });
        setUserEntries(decipheredEntries);
        setUser({ ...user, entriesLoaded: true });
      },
      (err) => {
        alert("Fethcing entries error ", err);
      }
    );
  };

  const updateSettings = async function () {
    const userSettingsRef = await doc(db, `${user.id}/settings`);
    await getDoc(userSettingsRef).then(
      (res) => {
        setUserSettings({
          currency: res.data().currency,
          tags: res.data().tags,
          groups: res.data().groups,
          items: res.data().items,
          sources: res.data().sources,
          statistics: res.data().statistics, //будем пока хранить в таком виде, а вызывать функцию-конвертер уже когда надо
        });
        setUser({ ...user, settingsLoaded: true });
      },
      (err) => {
        alert("Settings fetching error", err);
      }
    );
  };

  const loginDataToUser = async function (usrdt) {
    setUser({
      ...user,
      id: usrdt.user.uid,
      name: usrdt.user.displayName,
      pic: usrdt.user.photoURL,
      userLoggedIn: true,
      loggedInForSure: true,
    });
    if (usrdt.additionalUserInfo.isNewUser) {
      await setDoc(doc(db, usrdt.user.uid, "settings"), {
        currency: {
          name: "Euro",
          symbol: "€",
        },
        groups: [
          {
            name: "Food",
            icon: "🍗",
          },
        ],
        items: [
          {
            name: "Restaurant",
            parent: "Food",
          },
        ],
        sources: [
          {
            name: "Salary",
            icon: "💰",
          },
        ],
        tags: [
          {
            name: "Me",
            color: 1,
          },
        ],
        statistics: [],
      });
    }
    setTimeout(downloadUserData, 200);
  };

  const logout = function () {
    firebase.auth().signOut();
    setUser({ id: "demo", name: "Demo User", loggedInForSure: false });
    setSessionSettings({ appLoaded: false });
    setUserEntries(new Array());
    setUserSettings(userSettingsPlaceholder);
    turnOffDemoMode();
    unloadUserData();
  };

  const unloadUserData = function () {
    setUser({
      userLoggedIn: false,
      entriesLoaded: false,
      settingsLoaded: false,
      fetchingUserData: false,
      id: null,
      name: null,
      demoMode: false,
    });
    setSessionSettings({ appLoaded: false });
    setUserEntries(new Array());
    setUserSettings(userSettingsPlaceholder);
  };

  const turnOnDemoMode = function () {
    setUser({
      userLoggedIn: true,
      entriesLoaded: true,
      settingsLoaded: true,
      fetchingUserData: false,
      id: 1,
      name: "Demo User",
      demoMode: true,
    });
    setUserSettings(demoUserData.settings);
    setUserEntries(demoUserData.entries);
  };
  const turnOffDemoMode = () => setUser({ ...user, demoMode: false });

  useEffect(() => {
    const compareUserIds = async function () {
      const auth = await getAuth();
      if (auth.currentUser !== null && auth.currentUser.uid !== user.id) {
        setUser({
          ...user,
          userLoggedIn: true,
          loggedInForSure: true,
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName,
          pic: auth.currentUser.photoURL,
        });
        downloadUserData();
      }
    };
    if (!user.loggedInForSure) {
      compareUserIds();
    }
  });

  useEffect(() => {
    if (!user.entriesLoaded && !user.settingsLoaded) {
      downloadUserData();
    }
  }, [user]);

  useEffect(() => {
    //User authentication listener
    const auth = getAuth();
    const authUnsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser({
        ...user,
        userLoggedIn: true,
        id: usr.uid,
        name: usr.displayName,
        pic: usr.photoURL,
      });
    });
    //The following is the first entry download only:
    //downloadUserData();
    return authUnsubscribe();
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        user,
        setUser,
        userEntries,
        setUserEntries,
        userSettings,
        setUserSettings,
        logout,
        sessionSettings,
        setSessionSettings,
        updateUserEntries,
        updateSettings,
        turnOnDemoMode,
        turnOffDemoMode,
        loginDataToUser,
        unloadUserData,
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
}
