import React from "react";
import firebase from "firebase/compat/app";

export const updateSettings = function (settings, userId) {
  const docRef = firebase.firestore().collection(userId).doc("settings");
};
