import { createTheme } from "@mui/material/styles";

// assets
import colors from "assets/scss/_themes-vars.module.scss";

// project imports
import componentStyleOverrides from "./compStyleOverride";
import themePalette from "./palette";
import themeTypography from "./typography";

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
	const color = colors;

	const themeOption = {
		colors: color,
		mainheading: color.primaryMain,
		heading: color.primaryMain,
		paper: color.paper,
		backgroundDefault: color.paper,
		background: color.paper,
		darkTextPrimary: color.grey700,
		darkTextSecondary: color.grey500,
		textDark: color.grey900,
		menuSelected: color.primaryMain,
		menuSelectedBack: color.primaryLight,
		divider: color.grey200,
		buttonBorder: color.secondaryMain,
		blackText: color.secondaryDark,
		customization,
	};

	const themeOptions = {
		direction: "ltr",
		palette: themePalette(themeOption),
		mixins: {
			toolbar: {
				minHeight: "48px",
				padding: "16px",
				"@media (min-width: 600px)": {
					minHeight: "48px",
				},
			},
		},
		typography: themeTypography(themeOption),
	};

	const themes = createTheme(themeOptions);
	themes.components = componentStyleOverrides(themeOption);

	return themes;
};

export default theme;
