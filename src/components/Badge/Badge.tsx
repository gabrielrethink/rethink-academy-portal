import React from "react";

// Styles
import styles from "./Badge.module.css";

type BadgeProps = {
  color: "primary" | "secondary" | "accent" | "danger" | "warning" | "success";
  size: "micro" | "default" | "small" | "large";
  icon: JSX.Element;
};

const Badge = ({ color, size, icon }: BadgeProps) => {
  return <div className={`${styles[color]} ${styles[size]}`}>{icon}</div>;
};

export default Badge;
