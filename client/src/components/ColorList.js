import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(
        res =>
          updateColors([
            ...colors.filter(e => e.id !== colorToEdit.id),
            res.data
          ]) & console.log(res)
      )
      .catch(err => console.log(err));
    setEditing(false);
  };
  const deleteColor = color => {
    axiosWithAuth()
      .delete(`http://localhost:5000/api/colors/${color.id}`)
      .then(updateColors([...colors.filter(e => e.id !== color.id)]));
    setEditing(false);
  };

  const addColor = e => {
    e.preventDefault();
    axiosWithAuth()
      .post(`http://localhost:5000/api/colors/`, newColor)
      .then(res => updateColors([...colors, newColor]) & console.log(res))
      .catch(err => console.log(err));
    setEditing(false);
  };
  return (
    <div className="colors-wrap">
      <p>Exsisting Colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <hr></hr>
      <div className="add-color">
        <p>Add New Color</p>
        <form onSubmit={addColor}>
          <input
            type="text"
            placeholder="New Name"
            name="newName"
            value={newColor.color}
            style={{ width: "99%" }}
            required
            onChange={e => setNewColor({ ...newColor, color: e.target.value })}
          />
          <input
            type="text"
            placeholder="New Hex"
            name="newHex"
            value={newColor.code.hex}
            style={{ width: "99%" }}
            required
            onChange={e =>
              setNewColor({ ...newColor, code: { hex: e.target.value } })
            }
          />
          <button type="submit">Add New Color</button>
        </form>
      </div>
    </div>
  );
};

export default ColorList;
