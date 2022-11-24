import axios from 'axios';
export function deleteRecipe(id) {
  axios
      .delete("http://localhost:4000/recipes/"+id)
      .catch(function (error) {
        console.log(error.toJSON());
      })
      .then(
        async (res) => {
          return res
        }
      );
}

export function addRecipe(recipe) {
  const payload = {
    title: recipe.Title,
    description: recipe.Description,
    date: recipe.Date,
    image: recipe.Image,
    ingredients: recipe.Ingredients,
    steps: recipe.Recipe
  }

  axios
    .post("http://localhost:4000/recipes", payload)
    .catch(function (error) {
      console.log(error.toJSON());
    })
    .then(
      async (res) => {
        return res.data.message
      }
    );
}

export function fieldChanger(state, event) {
  var newState = state;
  if (["ingrediente"].includes(event.target.name)) {
    let ingredientes = [...state.ingredientes];
    ingredientes[event.target.id] = event.target.value;
    newState.ingredientes = ingredientes;
  } else if (["paso"].includes(event.target.name)) {
    let pasos = [...state.pasos];
    pasos[event.target.id] = event.target.value;
    newState.pasos = pasos;
  } else {
    newState[event.target.id] = event.target.value;
  }
  return newState;
}

export function addField(field) {
  var newField = [...field];
  newField.push("");
  return newField;
}

export function deleteField(field) {
  var newField = [...field];
  newField.pop();
  return newField;
}

export function getDate() {
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth();
  var yyyy = today.getFullYear();
  today = dd + " de " + months[mm] + " del " + yyyy;

  return today;
}
