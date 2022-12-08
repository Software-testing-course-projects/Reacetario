import * as React from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button, Grid } from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Modal,
  TextField,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { getDate, fieldChanger, addField, deleteField } from "./utils/forms";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "0",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
  height: 600,
  overflow: "hidden",
  overflowY: "scroll",
};

class CardComponent extends React.Component {
  state = {
    expanded: false,
    expanded2: false,
    open: false,
    titulo: this.props.recipe.title,
    descripcion: this.props.recipe.description,
    fecha: this.props.recipe.date,
    image: this.props.recipe.image,
    ingredientes: this.props.recipe.ingredients,
    pasos: this.props.recipe.steps,
    recipe: this.props.recipe,
    anchorEl: null,
    openMenu: false,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget, openMenu: true });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null, openMenu: false });
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  handleExpandClick2 = () => {
    this.setState({ expanded2: !this.state.expanded2 });
  };
  handleClose = () => {
    this.setState({
      expanded: false,
      expanded2: false,
      open: false,
      titulo: this.state.recipe.title,
      descripcion: this.state.recipe.description,
      fecha: this.state.recipe.date,
      image: this.state.recipe.image,
      ingredientes: this.state.recipe.ingredients,
      pasos: this.state.recipe.steps,
    });
  };
  handleOpen = () => {
    this.setState({ open: true });
    this.handleCloseMenu();
  };

  handleFieldChange = (event) => {
    event.preventDefault();
    this.setState(fieldChanger(this.state, event));
  };
  async handleSubmit(event) {
    event.preventDefault();
    const newRecipe = {
      title: this.state.titulo,
      description: this.state.descripcion,
      date: this.state.fecha,
      image: this.state.image,
      ingredients: this.state.ingredientes,
      steps: this.state.pasos,
    };
    await axios
      .put("http://44.202.138.175:4000/recipes/" + this.state.recipe.id, newRecipe)
      .catch(function (error) {
        console.log(error.toJSON());
      })
      .then(async (res) => {
        window.location.reload();
      });
    this.setState({
      expanded: false,
      expanded2: false,
      open: false,
    });
  }
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

  handleDelete = () => {
    this.props.deleteRecipe(this.props.recipe.id);
    this.handleCloseMenu();
  };

  render() {
    var recipe = this.state.recipe;
    return (
      <>
        <Menu
          id="basic-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.openMenu}
          onClose={this.handleCloseMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={this.handleOpen}>Editar</MenuItem>
          <MenuItem onClick={this.handleDelete}>Borrar</MenuItem>
        </Menu>
        <Card id="Card">
          {/* Cambiar la X por un botón de Delete*/}
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"></Avatar>
            }
            action={
              <IconButton
                aria-label="settings"
                onClick={(e) => this.handleClick(e)}
              >
                <MoreVertIcon />
              </IconButton>
            }
            title={
              <Typography variant="subtitle1"> {recipe.title} </Typography>
            }
            subheader={recipe.date}
            sx={{
              fontSize: 1,
            }}
          />
          <CardMedia
            component="img"
            height="194"
            image={recipe.image}
            alt={recipe.title}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {recipe.Description}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <ExpandMore
              expand={this.state.expanded}
              onClick={(e) => this.handleExpandClick(e)}
              aria-expanded={this.expanded}
              aria-label="Ingredients"
            >
              <ReceiptLongIcon />
            </ExpandMore>
            <ExpandMore
              expand={this.state.expanded2}
              onClick={(e) => this.handleExpandClick2(e)}
              aria-expanded={this.expanded2}
              aria-label="Recipe"
            >
              <FormatListNumberedIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Ingredientes:</Typography>
              <Typography paragraph>
                <List sx={{ listStyleType: "disc", pl: 4, color: "black" }}>
                  {recipe.ingredients.map((ingredient) => (
                    <ListItem sx={{ display: "list-item" }}>
                      <ListItemText primary={ingredient} />
                    </ListItem>
                  ))}
                </List>
              </Typography>
            </CardContent>
          </Collapse>
          <Collapse in={this.state.expanded2} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Receta:</Typography>
              <Typography paragraph>
                <List sx={{ listStyleType: "decimal", pl: 4, color: "black" }}>
                  {recipe.steps.map((step) => (
                    <ListItem sx={{ display: "list-item" }}>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
        <Modal
          open={this.state.open}
          sx={{ overflowY: "auto" }}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editar receta
            </Typography>
            <Grid container spacing={2} justify="center" sx={{ paddingTop: 2 }}>
              <Grid item xs={12} justify="center">
                <TextField
                  fullWidth
                  id="titulo"
                  label="Titulo"
                  variant="outlined"
                  value={this.state.titulo}
                  onChange={(e) => this.handleFieldChange(e)}
                />
              </Grid>
              <Grid item xs={16} justify="center">
                <TextField
                  fullWidth
                  id="descripcion"
                  label="Descripcion"
                  variant="outlined"
                  value={this.state.descripcion}
                  onChange={(e) => this.handleFieldChange(e)}
                />
              </Grid>
              <Grid item xs={16} justify="center">
                <TextField
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
                      <TextField
                        id={i}
                        name="ingrediente"
                        label="Ingrediente"
                        variant="outlined"
                        fullWidth
                        value={this.state.ingredientes[i]}
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
                      <TextField
                        id={i}
                        name="paso"
                        label="paso"
                        fullWidth
                        variant="outlined"
                        value={this.state.pasos[i]}
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
                  Editar receta
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </>
    );
  }
}

export default CardComponent;
