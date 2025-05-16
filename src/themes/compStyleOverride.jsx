export default function componentStyleOverrides(theme) {
	return {
		MuiButton: {
			styleOverrides: {
				root: {
					color: theme.colors?.secondaryDark,
					fontWeight: 700,
					borderRadius: "8px",
				},
				outlined: {
					color: theme.colors?.secondaryDark,
					fontWeight: 700,
					borderRadius: "8px",
					border: `2px solid ${theme.colors?.secondaryDark}`,
					"&:hover": {
						border: `2px solid ${theme.colors?.secondaryDark}`,
						backgroundColor: theme.colors?.secondaryDark,
						color: theme.colors?.paper,
					},
				},
				contained: {
					color: theme.colors?.paper,
					backgroundColor: "#3d3d3d",
					"&:hover": {
						backgroundColor: theme.colors?.secondaryDark,
					},
					"&:active": {
						transform: "scale(0.95)",
					},
				},
			},
		},
		MuiPaper: {
			defaultProps: {
				elevation: 1,
			},
			styleOverrides: {
				root: {
					backgroundImage: "none",
				},
				rounded: {
					borderRadius: `${theme?.customization?.borderRadius}px`,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: `${theme?.customization?.borderRadius}px`,
				},
			},
		},
		MuiCardHeader: {
			styleOverrides: {
				root: {
					color: theme.colors?.textDark,
					padding: "24px 24px 10px",
				},
				title: {
					fontSize: "1.125rem",
				},
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: {
					padding: "24px",
				},
			},
		},
		MuiCardActions: {
			styleOverrides: {
				root: {
					padding: "24px",
				},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					color: theme.darkTextPrimary,
					paddingTop: "10px",
					paddingBottom: "10px",
					"&.Mui-selected": {
						color: theme.menuSelected,
						backgroundColor: theme.primaryLight,
						"&:hover": {
							backgroundColor: theme.primaryLight,
						},
						"& .MuiListItemIcon-root": {
							color: theme.menuSelected,
						},
					},
					"&:hover": {
						backgroundColor: theme.primaryLight,
						color: theme.secondaryDark,
						"& .MuiListItemIcon-root": {
							color: theme.secondaryDark,
						},
					},
				},
			},
		},
		MuiListItemIcon: {
			styleOverrides: {
				root: {
					color: theme.darkTextPrimary,
					minWidth: "36px",
				},
			},
		},
		MuiListItemText: {
			styleOverrides: {
				primary: {
					color: theme.textDark,
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: {
					color: theme.textDark,
					"&::placeholder": {
						color: theme.darkTextSecondary,
						fontSize: "0.875rem",
					},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					background: theme.colors?.paper,
					borderRadius: `${theme?.customization?.borderRadius}px`,
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: theme.colors?.grey400,
					},
					"&:hover $notchedOutline": {
						borderColor: theme.colors?.secondaryMain,
					},
					"&.MuiInputBase-multiline": {
						padding: 1,
					},
				},
				input: {
					fontWeight: 500,
					background: theme.colors?.paper,
					padding: "15.5px 14px",
					borderRadius: `${theme?.customization?.borderRadius}px`,
					"&.MuiInputBase-inputSizeSmall": {
						padding: "10px 14px",
						"&.MuiInputBase-inputAdornedStart": {
							paddingLeft: 0,
						},
					},
				},
				inputAdornedStart: {
					paddingLeft: 4,
				},
				notchedOutline: {
					borderRadius: `${theme?.customization?.borderRadius}px`,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: theme.divider,
					opacity: 1,
					marginBottom: "16px",
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					color: theme.colors?.primaryDark,
					background: theme.colors?.primary200,
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					"&.MuiChip-deletable .MuiChip-deleteIcon": {
						color: "inherit",
					},
				},
			},
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					fontSize: "0.799rem",
					color: theme.paper,
					background: theme.colors?.secondaryDark,
					padding: "8px 16px",
					borderRadius: "10px",
				},
				arrow: {
					color: theme.colors?.secondaryDark,
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					position: "relative",
					"&::after": {
						content: '""',
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						height: "3px",
						backgroundColor: theme.colors?.grey300,
					},
					border: "none",
				},
				indicator: {
					backgroundColor: theme.colors?.secondaryDark,
					height: "3px",
					zIndex: 1,
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 300,
					fontSize: "1rem",
					padding: "12px 16px",
					color: theme.colors?.grey400,
					"&.Mui-selected": {
						fontWeight: 400,
						color: theme.colors?.secondaryDark,
					},
					"&:hover": {
						color: theme.colors?.secondaryDark,
					},
				},
			},
		},
		MuiSlider: {
			styleOverrides: {
				root: {
					color: theme.colors?.secondaryDark,
					height: 8,
					"&.Mui-disabled": {
						color: theme.colors?.grey300,
					},
					"& .MuiSlider-track": {
						border: "none",
					},
					"& .MuiSlider-thumb": {
						height: 24,
						width: 24,
						backgroundColor: "#fff",
						border: "2px solid currentColor",
						"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
							boxShadow: "inherit",
						},
						"&::before": {
							display: "none",
						},
					},
					"& .MuiSlider-valueLabel": {
						lineHeight: 1.2,
						fontSize: 12,
						background: "unset",
						padding: 0,
						width: 32,
						height: 32,
						borderRadius: "50% 50% 50% 0",
						backgroundColor: theme.colors?.secondaryDark,
						transformOrigin: "bottom left",
						transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
						"&::before": { display: "none" },
						"&.MuiSlider-valueLabelOpen": {
							transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
						},
						"& > *": {
							transform: "rotate(45deg)",
						},
					},
				},
				thumb: {
					height: 24,
					width: 24,
					backgroundColor: "#fff",
					border: `2px solid ${theme.colors?.secondaryDark}`,
					"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
						boxShadow: "inherit",
					},
				},
				track: {
					height: 8,
					borderRadius: 4,
				},
				rail: {
					height: 8,
					borderRadius: 4,
					backgroundColor: theme.colors?.grey300,
				},
				valueLabel: {
					color: theme.colors?.paper,
					backgroundColor: theme.colors?.secondaryMain,
				},
				mark: {
					backgroundColor: theme.colors?.paper,
					height: 8,
					width: 1,
					marginTop: 0,
				},
				markActive: {
					opacity: 1,
					backgroundColor: "currentColor",
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: theme.colors?.secondaryMain,
					"&.Mui-checked": {
						color: theme.colors?.secondaryDark,
					},
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					// backgroundColor: theme.colors?.paper,
				},
			},
		},
		MuiStepper: {
			styleOverrides: {
				root: {
					// padding: theme.spacing(2),
					// backgroundColor: theme.colors?.secondaryMain || 'transparent',
				},
			},
		},
		MuiStep: {
			styleOverrides: {
				root: {
					"&.MuiStep-completed": {
						color: theme.colors?.secondaryDark,
					},
					"&.MuiStep-active": {
						color: theme.colors?.secondaryDark,
					},
				},
			},
		},
		MuiStepLabel: {
			styleOverrides: {
				label: {
					"&.MuiStepLabel-alternativeLabel": {
						// marginTop: theme.spacing(1),
					},
					"&.Mui-completed": {
						color: theme.colors?.secondaryDark,
						fontWeight: 300,
					},
					"&.Mui-active": {
						color: theme.colors?.secondaryDark,
						fontWeight: 400,
					},
					color: theme.colors?.textSecondary,
				},
				iconContainer: {
					"& .MuiStepIcon-root": {
						color: theme.colors?.grey400,
						"&.Mui-active": {
							color: theme.colors?.secondaryDark,
						},
						"&.Mui-completed": {
							color: theme.colors?.primaryMain,
						},
					},
				},
			},
		},
		MuiStepConnector: {
			styleOverrides: {
				line: {
					borderColor: theme.colors?.divider,
				},
			},
		},
		MuiStepIcon: {
			styleOverrides: {
				root: {
					color: theme.colors?.grey400,
					"&.MuiStepIcon-active": {
						color: theme.colors?.secondaryMain,
					},
					"&.MuiStepIcon-completed": {
						color: theme.colors?.successMain,
					},
				},
				text: {
					fill: theme.colors?.textPrimary,
				},
			},
		},
		MuiRadio: {
			styleOverrides: {
				root: {
					color: "#383838",
					"&.Mui-checked": {
						color: "#383838",
					},
					"&:hover": {
						backgroundColor: theme.colors?.secondaryLight,
					},
				},
			},
		},
		MuiSwitch: {
			styleOverrides: {
				root: {
					width: 45,
					height: 26,
					padding: 0,
					"& .MuiSwitch-switchBase": {
						padding: 0,
						margin: 2,
						transitionDuration: "300ms",
						"&.Mui-checked": {
							transform: "translateX(19px)",
							color: "#fff",
							"& + .MuiSwitch-track": {
								backgroundColor: "#35a03a",
								opacity: 1,
								border: 0,
							},
							"&.Mui-disabled + .MuiSwitch-track": {
								opacity: 0.5,
							},
						},
						"&.Mui-focusVisible .MuiSwitch-thumb": {
							color: "#33cf4d",
							border: "6px solid #fff",
						},
						"&.Mui-disabled .MuiSwitch-thumb": {
							color: "grey",
						},
						"&.Mui-disabled + .MuiSwitch-track": {
							opacity: 0.7,
						},
					},
					"& .MuiSwitch-thumb": {
						boxSizing: "border-box",
						width: 22,
						height: 22,
					},
					"& .MuiSwitch-track": {
						borderRadius: 26 / 2,
						backgroundColor: "#E9E9EA",
						opacity: 1,
					},
				},
			},
		},
	};
}
