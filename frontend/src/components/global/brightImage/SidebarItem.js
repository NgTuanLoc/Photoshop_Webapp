import React from "react";

const SidebarItem = ({ name, active, handleClick }) => {
  return (
    <button
      className={
        active ? "sidebar__item sidebar__item--active" : "sidebar__item"
      }
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export default SidebarItem;
