import React, { Component } from "react";
import axios from "axios";
import {
  Paper,
  Container,
  Divider,
  Grid,
  Button,
  Modal,
  Typography,
  Box,
  TextField,
  Fab,
} from "@mui/material";
import CardComponent from "./CardComponent";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { styled } from "@mui/material/styles";
import { fieldChanger, addField, deleteField, getDate } from "./utils/forms.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  mb: 2,
  display: "flex",
  flexDirection: "column",
  height: 560,
  overflow: "hidden",
  overflowY: "scroll",
};

const RecipesTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#E884A1",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#E884A1",
  },

  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {},
    "&.Mui-focused fieldset": {
      borderColor: "#E884A1",
    },
  },
});

class Home extends Component {
  state = {
    titulo: "",
    descripcion: "",
    fecha: "",
    image: "",
    open: false,
    ingredientes: [""],
    pasos: [""],
    recipes: [],
  };
  async componentDidMount() {
    await axios
      .get("http://localhost:4000/recipes")
      .catch((err) => console.log(err.toJSON()))
      .then((res) => {
        this.setState({ recipes: res.data.message });
      });
  }

  async handleSubmit(event) {
    event.preventDefault();
    var newRecipe = {
      title: this.state.titulo,
      date: getDate(),
      description: this.state.descripcion,
      image: this.state.image,
      ingredients: this.state.ingredientes,
      steps: this.state.pasos,
    };
    await axios
      .post("http://localhost:4000/recipes", newRecipe)
      .catch(function (error) {
        console.log(error.toJSON());
      })
      .then(async (res) => {
        this.setState({ recipes: res.data.message });
        this.handleClose();
      });
  }

  handleDeleteRecipe = async (id) => {
    console.log(id);
    await axios
      .delete("http://localhost:4000/recipes/" + id)
      .catch(function (error) {
        console.log(error.toJSON());
      })
      .then(async (res) => {
        window.location.reload();
      });
  };

  handleFieldChange = (event) => {
    event.preventDefault();
    this.setState(fieldChanger(this.state, event));
  };

  addIngredient = (event) => {
    event.preventDefault();
    this.setState({ ingredientes: addField(this.state.ingredientes) });
  };

  removeIngredient = (event) => {
    event.preventDefault();
    this.setState({
      ingredientes: deleteField(this.state.ingredientes, event),
    });
  };

  addStep = (event) => {
    event.preventDefault();
    this.setState({ pasos: addField(this.state.pasos) });
  };
  removeStep = (event) => {
    event.preventDefault();
    this.setState({ pasos: deleteField(this.state.pasos, event) });
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () =>
    this.setState({
      titulo: "",
      descripcion: "",
      fecha: "",
      image: "",
      open: false,
      ingredientes: [""],
      pasos: [""],
    });

  render() {
    const open = this.state.open;
    const recipes = this.state.recipes;
    return (
      <>
        <Box
          sx={{
            margin: 0,
            top: "auto",
            right: 10,
            bottom: 20,
            left: "auto",
            position: "fixed",
          }}
        >
          <Fab
            aria-label="add"
            onClick={this.handleOpen}
            sx={{
              backgroundColor: "#E884A1",
              "&:hover": {
                backgroundColor: "#b94c6c",
              },
            }}
          >
            <PlaylistAddIcon />
          </Fab>
        </Box>
        <Container maxWidth id="body" sx={{ minHeight: "60rem", mt: -3 }}>
          <Container>
            <Paper elevation={3} id="Main">
              <h1 style={{ textAlign: "center" }}>Reacetario</h1>
              <Divider sx={{ marginTop: "2.45em" }}>Recetas</Divider>

              {/* Pequeño Trucazo para usar el Grid para hacer un pading sin problemas uwu*/}

              <Grid container justifyContent="center">
                <Grid xs={0.2}></Grid>

                <Grid container spacing={2} xs={11.6}>
                  {recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                      <div key={recipe.id} id={recipe.id} className={"Tarjeta"}>
                      <CardComponent
                        recipe={recipe}
                        deleteRecipe={this.handleDeleteRecipe}
                      />
                      </div>
                    </Grid>
                  ))}
                </Grid>

                <Grid xs={0.2}></Grid>
              </Grid>
            </Paper>
            <Modal
              open={open}
              onClose={this.handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Añadir receta
                </Typography>
                <Grid
                  container
                  spacing={2}
                  justify="center"
                  sx={{ paddingTop: 2 }}
                >
                  <Grid item xs={12} justify="center">
                    <RecipesTextField
                      fullWidth
                      id="titulo"
                      label="Titulo"
                      variant="outlined"
                      value={this.state.titulo}
                      onChange={(e) => this.handleFieldChange(e)}
                    />
                  </Grid>
                  <Grid item xs={16} justify="center">
                    <RecipesTextField
                      fullWidth
                      id="descripcion"
                      label="Descripcion"
                      variant="outlined"
                      value={this.state.descripcion}
                      onChange={(e) => this.handleFieldChange(e)}
                    />
                  </Grid>
                  <Grid item xs={16} justify="center">
                    <RecipesTextField
                      fullWidth
                      id="image"
                      label="Imagen"
                      variant="outlined"
                      value={this.state.image}
                      onChange={(e) => this.handleFieldChange(e)}
                    />
                  </Grid>
                  <Grid item xs={12} justify="center">
                    <Divider> Ingredientes </Divider>
                  </Grid>
                  {this.state.ingredientes.map((ingrediente, i) => {
                    return (
                      <>
                        <Grid item xs={10} justify="center">
                          <RecipesTextField
                            id={i}
                            name="ingrediente"
                            label="Ingrediente"
                            variant="outlined"
                            value={ingrediente.ingrediente}
                            onChange={(e) => this.handleFieldChange(e)}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="success"
                            type="submit"
                            disabled={
                              this.state.ingredientes.length > 1 &&
                              i < this.state.ingredientes.length - 1
                            }
                            onClick={(e) => this.addIngredient(e)}
                          >
                            +
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            type="submit"
                            disabled={
                              i < this.state.ingredientes.length - 1 ||
                              this.state.ingredientes.length === 1
                            }
                            onClick={(e) => this.removeIngredient(e)}
                          >
                            -
                          </Button>
                        </Grid>
                      </>
                    );
                  })}
                  <Grid item xs={12} justify="center">
                    <Divider> Pasos </Divider>
                  </Grid>
                  {this.state.pasos.map((paso, i) => {
                    return (
                      <>
                        <Grid item xs={10} justify="center">
                          <RecipesTextField
                            id={i}
                            name="paso"
                            label="paso"
                            variant="outlined"
                            value={paso.paso}
                            onChange={(e) => this.handleFieldChange(e)}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="success"
                            type="submit"
                            disabled={
                              this.state.pasos.length > 1 &&
                              i < this.state.pasos.length - 1
                            }
                            onClick={(e) => this.addStep(e)}
                          >
                            +
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            type="submit"
                            disabled={
                              i < this.state.pasos.length - 1 ||
                              this.state.pasos.length === 1
                            }
                            onClick={(e) => this.removeStep(e)}
                          >
                            -
                          </Button>
                        </Grid>
                      </>
                    );
                  })}
                  <Grid item xs={16}>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      onClick={(e) => this.handleSubmit(e)}
                      sx={{
                        backgroundColor: "#E884A1",
                        "&:hover": {
                          backgroundColor: "#b94c6c",
                        },
                      }}
                    >
                      Añadir receta
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Container>
        </Container>
      </>
    );
  }
}

export default Home;
