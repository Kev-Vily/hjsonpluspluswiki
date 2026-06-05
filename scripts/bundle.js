let bundle = {};

async function loadBundle(lang){

    const response =
        await fetch(`bundles/${lang}.properties`);

    const text = await response.text();

    bundle = {};

    text.split("\n").forEach(line => {

        line = line.trim();

        if(
            line.length === 0 ||
            line.startsWith("#")
        ){
            return;
        }

        const index = line.indexOf("=");

        if(index === -1){
            return;
        }

        const key =
            line.substring(0, index).trim();

        const value =
            line.substring(index + 1).trim();

        bundle[key] = value;
    });
}

function get(key){

    return bundle[key] || key;
}