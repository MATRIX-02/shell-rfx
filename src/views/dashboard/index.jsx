import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Slider,
  OutlinedInput,
  Tabs,
  Tab,
  Checkbox,
  Alert
} from "@mui/material";

import DraftsIcon from "@mui/icons-material/Drafts";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import SearchBar from "ui-component/SearchBar";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import ESCustomTextField from "ui-component/ESCustomTextField";
import ESCustomTextArea from "ui-component/ESCustomTextArea";
import ESCustomStepper from "ui-component/ESCustomStepper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MainCard from "ui-component/cards/MainCard";
import Zoom from "@mui/material/Zoom";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";

const filterButtons = [
  { name: "All Filter", items: ["Item 1", "Item 2", "Item 3"] },
  { name: "All Model", items: ["Model A", "Model B", "Model C"] },
  { name: "Task", items: ["Task 1", "Task 2", "Task 3"] },
  { name: "DataType", items: ["Type X", "Type Y", "Type Z"] },
  { name: "Framework", items: ["React", "Vue", "Angular"] },
  { name: "Publisher", items: ["Publisher 1", "Publisher 2", "Publisher 3"] },
  { name: "Language", items: ["JavaScript", "Python", "Java"] },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const SearchPage = () => {
  const [open, setOpen] = useState(true);
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [rangeValue, setRangeValue] = useState([20, 80]);
  const [loading, setLoading] = useState(true);
  const [textValue, setTextValue] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [stepperLoading, setStepperLoading] = useState(false);


  // Stepper Start
  const steps = ['Step 1', 'Step 2', 'Step 3'];

  const handleNext = () => {
    setStepperLoading(true);
    setTimeout(() => {
      setStepperLoading(false);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, 500); // Simulate loading with timeout
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  // Stepper End

  const handleTextAreaChange = (event) => {
    setTextValue(event.target.value);
  };

  function handleButtonClick() {
    setLoading(true);
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleRangeChange = (event, newValue) => {
    setRangeValue(newValue);
  };

  const countries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "UK", label: "United Kingdom" },
  ];

  const FilterButton = ({ name, items }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(true);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      setOpen(!open);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Button
          color="inherit"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleClick}
        >
          {name}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {items.map((item, index) => (
            <MenuItem key={index} onClick={handleClose}>
              {item}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <MainCard title="Component Showcase">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search and Filters
        </Typography>
        <SearchBar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          {filterButtons.map((button, index) => (
            <FilterButton key={index} name={button.name} items={button.items} />
          ))}
        </Box>
      </Box>

      <Box sx={{ width: '100%' }}>
        <ESCustomStepper
          steps={steps}
          activeStep={activeStep}
          onNext={handleNext}
          onBack={handleBack}
          loading={stepperLoading}
        >
          {/* This box will render different content based on the active step */}
          <Box sx={{ mt: 2, mb: 2 }}>
            {activeStep === 0 && (
              <Typography variant="h6">Content for Step 1</Typography>
            )}
            {activeStep === 1 && (
              <Typography variant="h6">Content for Step 2</Typography>
            )}
            {activeStep === 2 && (
              <Typography variant="h6">Content for Step 3</Typography>
            )}
          </Box>
        </ESCustomStepper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Custom Components
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <ESCustomDropdown
            label="Select Country"
            options={countries}
            value={countries.find((c) => c.value === country)}
            onChange={(selectedOption) =>
              setCountry(selectedOption ? selectedOption.value : "")
            }
            placeholder="Select a country..."
            isClearable
            required
          />
          <ESCustomTextField
            label="ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter ZIP Code"
          />

        </Box>
        <ESCustomTextArea
          label="Description"
          value={textValue}
          onChange={handleTextAreaChange}
          placeholder="Write your description..."
          required
          helperText={!textValue ? "This field is required." : ""}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Typography
        </Typography>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
        <Typography variant="subtitle1">subtitle1</Typography>
        <Typography variant="subtitle2">subtitle2</Typography>
        <Typography variant="body1">body1</Typography>
        <Typography variant="body2">body2</Typography>
        <Typography variant="button" display="block">
          button
        </Typography>
        <Typography variant="caption" display="block">
          caption
        </Typography>
        <Typography variant="overline" display="block">
          overline
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Outlined Input
        </Typography>
        <OutlinedInput
          id="outlined-input"
          value={value}
          onChange={handleChange}
          label="Label"
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkbox
        </Typography>
        <Checkbox /> This is a Checkbox <br />
        <Checkbox
          {...label}
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite />}
          sx={{
            color: "red",
            "&.Mui-checked": {
              color: "red",
            },
          }}
        />{" "}
        Did you like it?
        <br />
        <Checkbox
          {...label}
          icon={<BookmarkBorderIcon />}
          checkedIcon={<BookmarkIcon />}
          sx={{
            color: "green",
            "&.Mui-checked": {
              color: "green",
            },
          }}
        />{" "}
        Bookmark this page
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sliders
        </Typography>
        <Typography variant="h6" gutterBottom>
          Default Slider
        </Typography>
        <Slider
          defaultValue={30}
          aria-label="Default"
          valueLabelDisplay="auto"
          min={0}
          max={500000}
          sx={{ mt: 2, width: 300 }}

        />

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Range Slider
        </Typography>
        <Slider
          value={rangeValue}
          onChange={handleRangeChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          sx={{ mt: 2, width: 300 }}
        />
        <Typography>
          Range: {rangeValue[0]} - {rangeValue[1]}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tooltip
        </Typography>
        <Tooltip
          title="This is a tooltip"
          placement="top"
          arrow
          TransitionComponent={Zoom}
        >
          Hover over this text to see tooltip
        </Tooltip>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          MUI Tabs
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          Item One Content
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          Item Two Content
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          Item Three Content
        </TabPanel>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Buttons and Paper
        </Typography>
        <Button variant="contained" sx={{ mr: 1 }}>
          Contained
        </Button>
        <Button variant="outlined" sx={{ mr: 1 }}>
          Outlined
        </Button>
        <Button variant="text">Text</Button>
        <IconButton aria-label="delete">
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label="delete" disabled color="primary">
          <DeleteIcon />
        </IconButton>
        <IconButton color="secondary" aria-label="add an alarm">
          <AlarmIcon />
        </IconButton>
        <IconButton color="primary" aria-label="add to shopping cart">
          <AddShoppingCartIcon />
        </IconButton>

        <Stack direction="row" spacing={2}>
          <FormControlLabel
            sx={{ display: "block" }}
            control={
              <Switch
                checked={loading}
                onChange={() => setLoading(!loading)}
                name="loading"
                color="primary"
              />
            }
            label="Loading"
          />
          <Box sx={{ "& > button": { m: 1 } }}>
            <LoadingButton
              size="small"
              onClick={handleButtonClick}
              loading={loading}
              variant="outlined"
              disabled
            >
              Disabled
            </LoadingButton>
            <LoadingButton
              size="small"
              onClick={handleButtonClick}
              loading={loading}
              loadingIndicator="Loading…"
              variant="outlined"
            >
              Fetch data
            </LoadingButton>
            <LoadingButton
              size="small"
              onClick={handleButtonClick}
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              Send
            </LoadingButton>
            <LoadingButton
              size="small"
              color="secondary"
              onClick={handleButtonClick}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Save
            </LoadingButton>
          </Box>
        </Stack>

        <Box sx={{ mt: 2, }}>
          <Alert severity="error">This is an error alert — check it out!</Alert>
          <Alert severity="warning">This is a warning alert — check it out!</Alert>
          <Alert severity="info">This is an info alert — check it out!</Alert>
          <Alert severity="success">This is a success alert — check it out!</Alert>
        </Box>

        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          This is a Paper component
        </Paper>
      </Box>
      <Divider />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Card
        </Typography>
        <Card sx={{ maxWidth: 275 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
              benevolent
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <Tooltip arrow title="tooltip" placement="top">
                {" "}
                adjective{" "}
              </Tooltip>
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          List
        </Typography>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Nested List Items
            </ListSubheader>
          }
        >
          <ListItemButton>
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Sent mail" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItemButton>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="Starred" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>
      

      <Box sx={{ mb: 4 }}>
        <Tooltip title="Delete"></Tooltip>
      </Box>
    </MainCard>
  );
};

export default SearchPage;
