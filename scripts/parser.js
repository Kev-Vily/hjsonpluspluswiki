let currentClass = null;

const languageSelect =
    document.getElementById("languageSelect");

function createLanguageSelector(){

    LANGUAGES.forEach(lang => {

        const option =
            document.createElement("option");

        option.value = lang.id;
        option.textContent = lang.name;

        languageSelect.appendChild(option);
    });
}

async function openClass(classId){

    currentClass = classId;

    const data =
        await fetch(`docs/${classId}.json`)
            .then(r => r.json());

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <h1>
            ${get(`class.${data.id}.name`)}
        </h1>

        <p>
            ${get(`class.${data.id}.description`)}
        </p>

        <table>

            <tr>
                <th>${get("table.field")}</th>
                <th>${get("table.type")}</th>
                <th>${get("table.notes")}</th>
            </tr>

            ${data.fields.map(field => `

                <tr>

                    <td>
                        ${get(`field.${field.name}`)}
                    </td>

                    <td>
                        ${field.type}
                    </td>

                    <td>
                        ${get(field.note)}
                    </td>

                </tr>

            `).join("")}

        </table>

        
        ${data.example != null ? `
            <pre><code class="language-json">
            ${data.example}
            </code></pre>
        ` : ""}
        ${get(`class.${data.id}.subdescription`)!=null ? ` <p> ${get(`class.${data.id}.subdescription`)} </p>` : ""}
        
    `;
}

function createSidebar(){

    const list =
        document.getElementById("classList");

    list.innerHTML = "";

    const home =
        document.createElement("div");

    home.className = "class-item";
    home.textContent = get("home.sidebar");

    home.onclick = () => {

        currentClass = null;
        renderHome();
    };

    list.appendChild(home);

    CLASSES.forEach(classId => {

        const button =
            document.createElement("div");

        button.className = "class-item";

        button.textContent =
            classId;

        button.onclick =
            () => openClass(classId);

        list.appendChild(button);
    });
}

async function reloadLanguage(){

    await loadBundle(
        languageSelect.value
    );

    document.getElementById(
        "sidebarTitle"
    ).textContent =
        get("sidebar.classes");

    createSidebar();

    if(currentClass){
        openClass(currentClass);
    }else{
        renderHome();
    }
    console.log("Selected:", languageSelect.value);
}

languageSelect.addEventListener(
    "change",
    reloadLanguage
);

createLanguageSelector();
reloadLanguage();