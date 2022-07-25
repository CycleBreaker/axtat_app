import React, { useState } from "react";

export function textInput(initialValue, onlyNumbers = false) {
  const [value, setValue] = useState(initialValue);
  const handleChange = function (e) {
    const checkedValue = e.target.value;
    if (onlyNumbers) {
      checkedValue.replace(/\D+/g, "");
    }
    setValue(checkedValue);
  };
  const reset = () => setValue("");
  return [value, handleChange, reset];
}
