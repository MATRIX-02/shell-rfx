// NavItem.jsx
import PropTypes from "prop-types";
import { forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@mui/material/Tooltip";

// project imports
import { MENU_OPEN, SET_MENU } from "store/actions";

// assets
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const customization = useSelector((state) => state.customization);
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  

  const Icon = item.icon;
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: 6,
        height: 6,
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} target={item.target || '_self'} />
    )),
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: item.target || '_self' };
  }

  const itemHandler = (id) => {
    dispatch({ type: MENU_OPEN, id });
    if (matchesSM) dispatch({ type: SET_MENU, opened: false });
  };

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split("/")
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch({ type: MENU_OPEN, id: item.id });
    }
    // eslint-disable-next-line
  }, [pathname]);

  const isSelected = pathname.includes(item.url);

  const textContent = (
    <>
      <Typography 
        variant={isSelected ? 'h5' : 'body1'} 
        color={isSelected ? '#5E35B1' : 'inherit'}
      >
        {item.title}
      </Typography>
      {item.caption && (
        <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
          {item.caption}
        </Typography>
      )}
    </>
  );

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 0.5,
        alignItems: 'center',
        backgroundColor: isSelected ? 'rgba(94, 53, 177, 0.1) !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${leftDrawerOpened ? level * 24 : 20}px`,
      }}
      selected={isSelected}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon sx={{ 
        my: 'auto', 
        minWidth: !item?.icon ? 18 : 36,
        color: isSelected ? '#5E35B1' : 'inherit'
      }}>
        {itemIcon}
      </ListItemIcon>
      {leftDrawerOpened ? (
        <ListItemText primary={textContent} />
      ) : (
        <Tooltip title={item.title} placement="right">
          <span>{/* Empty span to make tooltip work with disabled ListItemButton */}</span>
        </Tooltip>
      )}
      {leftDrawerOpened && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavItem;