
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const startingItems = [
  { id: 1, name: "Eggs", quantity: 12, unit: "eggs", location: "Fridge", category: "Dairy & Eggs" },
  { id: 2, name: "Ground Venison", quantity: 3, unit: "packs", location: "Garage Freezer", category: "Meat" },
  { id: 3, name: "BBQ Sauce", quantity: 1, unit: "bottle", location: "Pantry", category: "Condiments" },
  { id: 4, name: "Black Beans", quantity: 4, unit: "cans", location: "Pantry", category: "Canned Goods" },
  { id: 5, name: "Whitetail Backstrap", quantity: 2, unit: "packs", location: "Garage Freezer", category: "Meat" },
];

function App() {
  const [items, setItems] = useState(startingItems);
  const [shopping, setShopping] = useState([]);
  const [location, setLocation] = useState("All Locations");
  const [page, setPage] = useState("Inventory");
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState("1");
  const [newLocation, setNewLocation] = useState("Pantry");
  const [showAdd, setShowAdd] = useState(false);

  const changeQuantity = (id, amount) => {
    setItems(current => current
      .map(item => item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + amount) }
        : item)
      .filter(item => item.quantity > 0));
  };

  const addItem = event => {
    event.preventDefault();
    if (!newName.trim()) return;
    setItems(current => [...current, {
      id: Date.now(),
      name: newName.trim(),
      quantity: Math.max(1, Number(newQuantity) || 1),
      unit: "items",
      location: newLocation,
      category: "Other",
    }]);
    setNewName("");
    setNewQuantity("1");
    setShowAdd(false);
  };

  const addToShopping = name => {
    setShopping(current => current.includes(name) ? current : [...current, name]);
  };

  const visibleItems = location === "All Locations"
    ? items
    : items.filter(item => item.location === location);

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <div className="brand-name">PantryPro</div>
            <div className="brand-tagline">YOUR KITCHEN, ORGANIZED</div>
          </div>
        </div>
        <div className="household">⌂ <span>My Household</span></div>
      </header>

      <main>
        <section className="welcome">
          <p className="eyebrow">YOUR HOME INVENTORY</p>
          <h1>Good food starts<br />with knowing what you have.</h1>
          <p className="subheading">Your pantry, fridge, and freezers — all in one place.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setShowAdd(true)}>＋ Add food</button>
            <button className="secondary-button" onClick={() => setPage("Shopping")}>▤ Shopping list ({shopping.length})</button>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon">▤</span>
            <span className="stat-label">Food entries</span>
            <strong>{items.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-icon">◫</span>
            <span className="stat-label">Total quantity</span>
            <strong>{totalUnits}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✓</span>
            <span className="stat-label">To shop for</span>
            <strong>{shopping.length}</strong>
          </div>
        </section>

        <nav className="tabs">
          {["Inventory", "Recipes", "Shopping"].map(tab => (
            <button
              key={tab}
              className={page === tab ? "tab active" : "tab"}
              onClick={() => setPage(tab)}
            >{tab}</button>
          ))}
        </nav>

        {page === "Inventory" && (
          <section className="content-panel">
            <div className="section-heading">
              <div>
                <h2>Your food inventory</h2>
                <p>Keep track of what’s on hand.</p>
              </div>
              <button className="secondary-button" onClick={() => setShowAdd(true)}>＋ Add item</button>
            </div>
            <label className="filter-label" htmlFor="location">Storage location</label>
            <select id="location" value={location} onChange={e => setLocation(e.target.value)}>
              {["All Locations", "Pantry", "Fridge", "Kitchen Freezer", "Garage Freezer"].map(place => (
                <option key={place}>{place}</option>
              ))}
            </select>

            <div className="inventory-list">
              {visibleItems.length === 0 && <p className="empty">No food here yet. Add an item to get started.</p>}
              {visibleItems.map(item => (
                <article className="food-row" key={item.id}>
                  <div className="food-icon">{item.category === "Meat" ? "🥩" : item.category === "Dairy & Eggs" ? "🥚" : item.category === "Condiments" ? "🫙" : "🥫"}</div>
                  <div className="food-info">
                    <strong>{item.name}</strong>
                    <span>{item.location} · {item.category}</span>
                    <small>{item.quantity} {item.unit}</small>
                  </div>
                  <div className="quantity-controls">
                    <button aria-label={"Remove one " + item.name} onClick={() => changeQuantity(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button aria-label={"Add one " + item.name} onClick={() => changeQuantity(item.id, 1)}>＋</button>
                  </div>
                  <button className="list-button" title="Add to shopping list" onClick={() => addToShopping(item.name)}>＋ List</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === "Recipes" && (
          <section className="content-panel">
            <h2>Make something delicious</h2>
            <p className="subheading">Recipe recommendations based on your inventory will be added in a later step.</p>
            <div className="recipe-card">
              <div className="recipe-emoji">🍲</div>
              <div><strong>Venison chili</strong><p>Uses ground venison and pantry staples.</p><span className="pill">Easy · 45 minutes</span></div>
              <button onClick={() => addToShopping("Chili ingredients")}>＋ Ingredients</button>
            </div>
            <div className="recipe-card">
              <div className="recipe-emoji">🍳</div>
              <div><strong>Quick egg breakfast</strong><p>A simple idea for using your eggs.</p><span className="pill">Easy · 15 minutes</span></div>
              <button onClick={() => addToShopping("Breakfast ingredients")}>＋ Ingredients</button>
            </div>
          </section>
        )}

        {page === "Shopping" && (
          <section className="content-panel">
            <div className="section-heading"><div><h2>Shopping list</h2><p>Your next grocery run, made easier.</p></div></div>
            <form className="shopping-form" onSubmit={e => { e.preventDefault(); const field = e.currentTarget.elements.shoppingItem; if (field.value.trim()) { addToShopping(field.value.trim()); field.value = ""; } }}>
              <input name="shoppingItem" placeholder="Add something to buy..." />
              <button className="primary-button">Add</button>
            </form>
            {shopping.length === 0 ? <p className="empty">Your shopping list is empty.</p> : shopping.map((name, i) => (
              <div className="shopping-row" key={name + i}>
                <span>□</span><span>{name}</span>
                <button onClick={() => setShopping(current => current.filter((_, index) => index !== i))}>Remove</button>
              </div>
            ))}
          </section>
        )}

        {showAdd && (
          <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
            <form className="add-modal" onSubmit={addItem} onClick={e => e.stopPropagation()}>
              <div className="section-heading"><h2>Add food</h2><button type="button" className="close-button" onClick={() => setShowAdd(false)}>✕</button></div>
              <label htmlFor="foodName">Food name</label>
              <input id="foodName" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Frozen corn" required autoFocus />
              <label htmlFor="foodQuantity">Quantity</label>
              <input id="foodQuantity" type="number" min="1" value={newQuantity} onChange={e => setNewQuantity(e.target.value)} required />
              <label htmlFor="foodLocation">Storage location</label>
              <select id="foodLocation" value={newLocation} onChange={e => setNewLocation(e.target.value)}>
                {["Pantry", "Fridge", "Kitchen Freezer", "Garage Freezer"].map(place => <option key={place}>{place}</option>)}
              </select>
              <button className="primary-button full-width">Save food</button>
            </form>
          </div>
        )}

        <footer>PantryPro · A simpler way to manage your food</footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
