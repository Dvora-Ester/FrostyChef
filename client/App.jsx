import React, { useState } from 'react';
import './App.css';
//import './ChefMirror.css';

const ChefMirror = () => {
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [dietary, setDietary] = useState('Parve');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);

  // טיפול בהעלאת תמונה
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRecipe = async () => {
    if (!base64) return alert("Please upload a photo of your fridge first!");
    
    setLoading(true);
    try {
      // קריאה ל-Backend (סעיף 27)
      const response = await fetch('http://localhost:5000/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, type: dietary, notes })
      });
      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      console.error(err);
      // Fallback לדמו במקרה שהשרת לא זמין
      setRecipe({
        title: "Chef's Quick Shakshuka",
        ingredients: ["3 Eggs", "2 Tomatoes", "1 Onion"],
        instructions: "Chop the onions and tomatoes, fry them, add eggs and enjoy!"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chef-container">
      <header className="chef-header">
        <div className="chef-logo">👨‍🍳</div>
        <h1>Chef-Mirror</h1>
        <p>Turning your fridge leftovers into gourmet magic</p>
      </header>

      <div className="chef-grid">
        {/* Input Section */}
        <section className="card input-card">
          <div className="upload-box" onClick={() => document.getElementById('file-input').click()}>
            {image ? <img src={image} alt="Preview" className="preview-img" /> : 
            <div className="upload-placeholder">📸 <span>Click to Upload Fridge Photo</span></div>}
            <input type="file" id="file-input" hidden onChange={handleImageChange} accept="image/*" />
          </div>

          <div className="controls">
            <label>Meal Type:</label>
            <div className="chip-group">
              {['Meat', 'Dairy', 'Parve'].map(type => (
                <button 
                  key={type}
                  className={`chip ${dietary === type ? 'active' : ''}`}
                  onClick={() => setDietary(type)}
                >
                  {type === 'Parve' ? 'פרווה' : type === 'Dairy' ? 'חלבי' : 'בשרי'}
                </button>
              ))}
            </div>

            <label>Chef Notes:</label>
            <textarea 
              placeholder="e.g. No onions, spicy, quick meal..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button className="main-btn" onClick={generateRecipe} disabled={loading}>
            {loading ? 'Chef is thinking...' : 'Make Me Something Tasty!'}
          </button>
        </section>

        {/* Result Section */}
        <section className="card result-card">
          {!recipe ? (
            <div className="placeholder">✨ Your recipe will appear here...</div>
          ) : (
            <div className="recipe-content">
              <h2>{recipe.title}</h2>
              <h4>Ingredients:</h4>
              <ul>{recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
              <h4>Instructions:</h4>
              <p>{recipe.instructions}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChefMirror;