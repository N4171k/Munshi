import React from "react";

const styles = `
  .munshi-toggle {
    position: relative;
    display: inline-flex;
    height: 30px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: #0D0D10;
    overflow: hidden;
    transition: border-color 0.2s ease;
    width: 130px;
    font-family: 'DM Sans', sans-serif;
  }

  .munshi-toggle:hover {
    border-color: rgba(201, 168, 76, 0.2);
  }

  .toggle-highlight {
    position: absolute;
    top: 3px;
    height: calc(100% - 6px);
    width: calc(50% - 4px);
    background: #C9A84C;
    border-radius: 7px;
    transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    left: 3px;
  }

  .toggle-highlight.right {
    transform: translateX(calc(100% + 2px));
  }

  .toggle-option {
    position: relative; z-index: 1;
    width: 50%;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: color 0.2s ease;
    user-select: none;
  }

  .toggle-option.selected { color: #0D0D10; }
  .toggle-option.unselected { color: #52505E; }
`;

export default function ToggleSwitch({ option1, option2, value, onToggle }) {
    const isOption1 = value === option1;

    return (
        <button
            className="munshi-toggle"
            onClick={() => onToggle(isOption1 ? option2 : option1)}
            type="button"
        >
            <style>{styles}</style>

            <div className={`toggle-highlight ${isOption1 ? "" : "right"}`} />

            <span className={`toggle-option ${isOption1 ? "selected" : "unselected"}`}>
                {option1}
            </span>
            <span className={`toggle-option ${!isOption1 ? "selected" : "unselected"}`}>
                {option2}
            </span>
        </button>
    );
}