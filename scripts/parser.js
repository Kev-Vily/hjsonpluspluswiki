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

function renderHome(){
    document.getElementById("pageContent").innerHTML = `
        <h1>${get("home.title")}</h1>
        <p>${get("home.description")}</p>
    `;
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
    `;
}

function createSidebar(){

    const list =
        document.getElementById("classList");

    list.innerHTML = "";

    const search =
        document.createElement("input");

    search.type = "text";
    search.id = "classSearch";

    search.placeholder =
        get("search.placeholder");

    list.appendChild(search);

    function updateClassList(filter = ""){

        list
            .querySelectorAll(".class-entry")
            .forEach(e => e.remove());

        CLASSES.forEach(classId => {

            const name =
                get(`class.${classId}.name`);

            if(
                !name
                    .toLowerCase()
                    .includes(filter.toLowerCase())
            ){
                return;
            }

            const button =
                document.createElement("div");

            button.className =
                "class-item class-entry";

            button.textContent = name;

            button.onclick =
                () => openClass(classId);

            list.appendChild(button);
        });
    }

    search.addEventListener(
        "input",
        () => updateClassList(search.value)
    );

    updateClassList();
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

document.getElementById("homeButton").addEventListener("click", () => {
        currentClass = null;
        renderHome();
    });

createLanguageSelector();
reloadLanguage();