import React from "react";

// Styles
import styles from "./InputText.module.css";

type InputTextProps = {
  type: "micro" | "default" | "small" | "large";
  placeholder: string;
  onChange: () => void;
  hasIcon: Boolean;
  iconPosition?: "left" | "both" | "right";
  iconName?: "calendar";
  label: string;
  elementCaption: string;
  left?: JSX.Element;
  right?: JSX.Element;
};

const InputText = ({
  type,
  placeholder,
  onChange,
  hasIcon,
  iconPosition,
  label,
  elementCaption,
  left,
  right,
}: InputTextProps) => {
  let container, inputLabel, input, icon, field;

  switch (type) {
    case "micro":
      container = styles.inputText_containerMicro;
      inputLabel = styles.inputText_labelMicro;
      input = styles.inputText_inputMicro;
      icon = styles.inputText_iconMicro;
      field = styles.inputText_fieldMicro;
      break;
    case "default":
      container = styles.inputText_containerDefault;
      inputLabel = styles.inputText_labelDefault;
      input = styles.inputText_inputDefault;
      icon = styles.inputText_iconDefault;
      field = styles.inputText_fieldDefault;
      break;
    case "small":
      container = styles.inputText_containerSmall;
      inputLabel = styles.inputText_labelSmall;
      input = styles.inputText_inputSmall;
      icon = styles.inputText_iconSmall;
      field = styles.inputText_fieldSmall;
      break;
    case "large":
      container = styles.inputText_containerLarge;
      inputLabel = styles.inputText_labelLarge;
      input = styles.inputText_inputLarge;
      icon = styles.inputText_iconLarge;
      field = styles.inputText_fieldLarge;
      break;
  }

  return (
    <label className={container}>
      <span className={inputLabel}>{label}</span>
      <div className={input}>
        {hasIcon && iconPosition !== "right" && (
          <div className={icon}>{hasIcon && left}</div>
        )}

        <input
          className={field}
          type="text"
          name="placeholder"
          required
          placeholder={placeholder}
          onChange={onChange}
        />

        {hasIcon && iconPosition !== "left" && (
          <div className={icon}>{hasIcon && right}</div>
        )}
      </div>
      <span className={styles.inputText_caption}>{elementCaption}</span>
    </label>
  );
};

export default InputText;
