export function deleteRecipe(index, recipes) {
  var newRecipes = [...recipes];
  newRecipes.splice(index, 1);
  return newRecipes;
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

export function addRecipe(recipe, recipes) {
  var newRecipes = [...recipes];
  newRecipes.push(recipe);
  return newRecipes;
}
