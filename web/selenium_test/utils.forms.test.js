// Funciones a testear
import {
  getDate,
  deleteRecipe,
  fieldChanger,
  addField,
  deleteField,
  addRecipe,
} from "../utils/forms";
import { recipes, state, recipe } from "../Mocks/recipes";
// Mocks jsons

describe("getDate", () => {
  test("Debe retornar un string", () => {
    expect(typeof getDate()).toBe("string");
  });
  test("Debe tener el formato dd de mes de yyyy", () => {
    expect(getDate()).toMatch(/\d{1,2} de \w+ del \d{4}/);
  });
});

describe("deleteRecipe", () => {
  test("Debe retornar un array", () => {
    expect(Array.isArray(deleteRecipe(0, recipes.recipes))).toBe(true);
  });
  test("Debe retornar un array con 1 elemento menos", () => {
    expect(deleteRecipe(0, recipes.recipes).length).toBe(
      recipes.recipes.length - 1
    );
  });
  test("Debe retornar un array con el elemento eliminado", () => {
    expect(deleteRecipe(0, recipes.recipes)).not.toContain(recipes.recipes[0]);
  });
});

describe("fieldChanger", () => {
  test("Debe retornar un objeto", () => {
    expect(
      typeof fieldChanger(state, {
        target: {
          name: "ingrediente",
          id: 0,
          value: "nuevo ingrediente",
        },
      })
    ).toBe("object");
  });
  test("Si se modifica un ingrediente debe modificar los atributos de dicho ingrediente", () => {
    expect(
      fieldChanger(state, {
        target: {
          name: "ingrediente",
          id: 0,
          value: "nuevo ingrediente",
        },
      }).ingredientes[0]
    ).toBe("nuevo ingrediente");
  });
  test("Si se modifica un paso debe modificar los atributos de dicho paso", () => {
    expect(
      fieldChanger(state, {
        target: {
          name: "paso",
          id: 0,
          value: "nuevo paso",
        },
      }).pasos[0]
    ).toBe("nuevo paso");
  });
  test("Si se modifica un atributo que no es ingrediente o paso debe modificar dicho atributo", () => {
    expect(
      fieldChanger(state, {
        target: {
          name: "nombre",
          id: "nombre",
          value: "nuevo nombre",
        },
      }).nombre
    ).toBe("nuevo nombre");
  });
});

describe("addField", () => {
  test("Debe retornar un array", () => {
    expect(Array.isArray(addField(state.ingredientes))).toBe(true);
  });
  test("Debe retornar un array con 1 elemento más", () => {
    expect(addField(state.ingredientes).length).toBe(
      state.ingredientes.length + 1
    );
  });
  test("Debe retornar un array con el elemento agregado", () => {
    expect(addField(state.ingredientes)).toContain("");
  });
});

describe("deleteField", () => {
  test("Debe retornar un array", () => {
    expect(Array.isArray(addField(state.ingredientes))).toBe(true);
  });
  test("Debe retornar un array con 1 elemento menos", () => {
    expect(deleteField(state.ingredientes).length).toBe(
      state.ingredientes.length - 1
    );
  });
});

describe("addRecipe", () => {
  test("Debe retornar un array", () => {
    expect(Array.isArray(addRecipe(recipe, recipes.recipes))).toBe(true);
  });
  test("Debe retornar un array con 1 elemento más", () => {
    expect(addRecipe(recipe, recipes.recipes).length).toBe(
      recipes.recipes.length + 1
    );
  });
  test("Debe retornar un array con el elemento agregado", () => {
    expect(addRecipe(recipe, recipes.recipes)).toContain(recipe);
  });
});
