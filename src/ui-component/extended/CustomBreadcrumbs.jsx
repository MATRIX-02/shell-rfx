import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { IconChevronRight } from "@tabler/icons-react";
import menuItems from "menu-items";
import { routeConfig } from "routes/RouteConfig";

const CustomBreadcrumb = ({ currentState, isSelected }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const isPathClickable = (path) => {
    const findMenuItem = (items, currentPath) => {
      for (const item of items) {
        if (item.url === currentPath) {
          return true;
        }
        if (item.children) {
          const found = findMenuItem(item.children, currentPath);
          if (found) return true;
        }
      }
      return false;
    };

    const allMenuItems = menuItems.items.flatMap((item) => [
      item,
      ...(item.children || []),
    ]);
    return findMenuItem(allMenuItems, path);
  };

  const getBreadcrumbName = (path) => {
    const pathParts = path.split("/").filter((x) => x);
    let config = routeConfig;
    let name = "";

    for (const part of pathParts) {
      if (config[part]) {
        config = config[part];
        name = config.name;
      } else if (config.childRoutes && config.childRoutes[part]) {
        config = config.childRoutes[part];
        name = config.name;
      } else {
        name = part;
      }
    }

    return name;
  };

  const breadcrumbs = [
    <MuiLink
      component={Link}
      underline="hover"
      sx={{ display: "flex", alignItems: "center" }}
      color="inherit"
      to="/"
      key="home"
    >
      <HomeIcon
        sx={{
          marginRight: 1,
          marginTop: 0,
          width: "1rem",
          height: "1rem",
          color: "#2B2B2B",
        }}
        fontSize="inherit"
      />
      Home
    </MuiLink>,
  ];

  let currentPath = "";

  pathnames.forEach((value, index) => {
    currentPath += `/${value}`;
    const last = index === pathnames.length - 1;
    const name = getBreadcrumbName(currentPath);
    const isClickable = isPathClickable(currentPath);

    // console.log(
    // 	`Processing path: ${currentPath}, name: ${name}, isClickable: ${isClickable}`
    // );

    if (name && (name.toLowerCase() !== "home" || index === 0)) {
      if (last && isSelected) {
        breadcrumbs.push(
          <Typography color="text.primary" key={currentPath}>
            {name}
          </Typography>
        );
      } else if (isClickable) {
        breadcrumbs.push(
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            to={currentPath}
            key={currentPath}
          >
            {name}
          </MuiLink>
        );
      } else {
        breadcrumbs.push(
          <Typography color="text.secondary" key={currentPath}>
            {name}
          </Typography>
        );
      }
    }
  });

  // Add custom breadcrumbs after the route
  if (currentState && Array.isArray(currentState)) {
    currentState.forEach((stateItem, index) => {
      breadcrumbs.push(
        <Typography color="text.primary" key={`current-state-${index}`}>
          {stateItem}
        </Typography>
      );
    });
  } else if (currentState) {
    breadcrumbs.push(
      <Typography color="text.primary" key="current-state">
        {currentState}
      </Typography>
    );
  }

  // console.log("Final breadcrumbs:", breadcrumbs);

  return (
    <Breadcrumbs
      maxItems={2}
      aria-label="breadcrumb"
      separator={<IconChevronRight size={20} />}
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumb;
