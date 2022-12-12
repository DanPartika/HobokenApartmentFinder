
const sortApartmentsBy = array => {

}

let form = document.getElementById("sortBy-form");
let input = document.getElementById("sortByInput");
let results = document.getElementById("results");

if (form){
    form.addEventListener('submit', (e) =>{
        e.preventDefault()
        try{
           let resultingList
            const listItem = document.createElement('li');

          

            const text = `[${sortedArr}]`;
            const content = document.createTextNode(text);
            listItem.appendChild(content);
            results.appendChild(listItem);
            //form.reset();
        } catch (err) {
            alert(err);
        }
    });
}
