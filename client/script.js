document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const genBtn = document.getElementById('generate-btn');
    const chips = document.querySelectorAll('.chip');
    let selectedType = 'Parve';
    let base64Image = null;

    // 1. טיפול בבחירת תגיות (Dietary Selection)
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            // הסרת המחלקה הפעילה מכולם והוספה לנבחר
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedType = chip.getAttribute('data-type');
            console.log("Selected type:", selectedType);
        });
    });

    // 2. פתיחת בחירת קובץ בלחיצה על האזור
    dropZone.addEventListener('click', () => fileInput.click());

    // 3. הצגת תצוגה מקדימה של התמונה (זה ה-WOW!)
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                base64Image = event.target.result;
                // החלפת האייקון בתמונה שנבחרה
                dropZone.innerHTML = `
                    <img src="${base64Image}" style="max-height: 150px; border-radius: 10px;">
                    <p style="margin-top:10px; color:green;">תמונה נטענה בהצלחה! ✅</p>
                `;
            };
            reader.readAsDataURL(file);
        }
    });

    // 4. שליחה ל-Backend
    genBtn.addEventListener('click', async () => {
        const notes = document.getElementById('notes').value;
        const resultArea = document.getElementById('result-area');

        if (!base64Image) {
            alert("השף צריך לראות מה יש במקרר! אנא העלו תמונה.");
            return;
        }

        genBtn.innerText = "השף חושב על מתכון...";
        genBtn.disabled = true;

        try {
            // שליחה לשרת (Node.js/Python) כפי שנדרש בסעיף 1C
            const response = await fetch('http://localhost:8080/api/chef', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    image: base64Image, 
                    type: selectedType, 
                    notes: notes 
                })
            });

            const data = await response.json();
            renderRecipe(data); 
        } catch (error) {
            console.error("Error:", error);
            // דמו לפרזנטציה אם השרת עדיין לא למעלה
            renderRecipe({
                title: "מוקפץ 'מה שיש' מהיר",
                ingredients: ["שאריות ירקות מהתמונה", "רוטב סויה", "2 כפות שמן"],
                instructions: "לחתוך הכל דק, להקפיץ 5 דקות ולהגיש חם."
            });
        } finally {
            genBtn.innerText = "תכין לי משהו טעים!";
            genBtn.disabled = false;
        }
    });

    function renderRecipe(data) {
        const resultArea = document.getElementById('result-area');
        resultArea.innerHTML = `
            <div class="recipe-content animate-in">
                <h2 style="color: #ea580c; border-bottom: 2px solid #eee; padding-bottom: 10px;">${data.title}</h2>
                <div style="margin-top: 20px;">
                    <h4 style="margin-bottom: 5px;">🥗 מצרכים:</h4>
                    <ul style="padding-right: 20px;">
                        ${data.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                <div style="margin-top: 20px;">
                    <h4 style="margin-bottom: 5px;">🍳 הוראות הכנה:</h4>
                    <p style="line-height: 1.6;">${data.instructions}</p>
                </div>
            </div>
        `;
    }
});