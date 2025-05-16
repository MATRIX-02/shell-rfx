import React from "react";

const ApproversAnimation = () => {
  //const [visibleManagers, setVisibleManagers] = useState([]);
  //const [showApprovers, setShowApprovers] = useState(false);
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setVisibleManagers((prev) =>
  //       prev.length < managers.length ? [...prev, managers[prev.length]] : prev
  //     );
  //   }, 500); // Adjust this value to change the speed of appearance

  //   return () => clearInterval(timer);
  // }, [visibleManagers]);
  return {
    /* <List sx={{ px: 2 }}>
    {showApprovers ? (
      <>
        <Button
          sx={{ mb: 2 }}
          variant="outlined"
          onClick={() => setShowApprovers(!showApprovers)}
          endIcon={
            <ExpandMoreIcon
              sx={{ transform: "rotate(180deg)" }}
            />
          }
        >
          Hide Assigned Approvers
        </Button>
        {visibleManagers?.map((manager, index) => (
          <ListItem
            key={index}
            sx={{
              pl: 0,
              position: "relative",
              opacity: 0,
              transform: "translateY(20px)",
              animation: `fadeInMove 0.5s ease forwards ${index * 0.5}s`,
              "@keyframes fadeInMove": {
                from: {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            {index !== 0 && (
              <Box
                sx={{
                  position: "absolute",
                  left: "11px",
                  top: "-25px",
                  height: "45px",
                  width: "2px",
                  backgroundColor: "#000",
                }}
              />
            )}
            <ListItemAvatar>
              <CircleIcon />
            </ListItemAvatar>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <ListItemText
                primary={manager.name}
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {manager.title}
                  </Typography>
                }
              />
              <Chip label={`Level ${index + 1}`} />
            </Box>
          </ListItem>
        ))}
      </>
    ) : (
      <Button
        sx={{ mb: 2 }}
        variant="outlined"
        onClick={() => setShowApprovers(!showApprovers)}
        endIcon={<ExpandMoreIcon />}
      >
        Show Assigned Approvers
      </Button>
    )}
  </List> */
  };
};

export default ApproversAnimation;
