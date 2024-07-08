import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";

const RoomAmenitiesList = ({ roomTypeAmenities = [] }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const amenitiesToShow = roomTypeAmenities
    ?.slice(0, 6)
    .map((roomTypeAmenity) => roomTypeAmenity.amenity);

  const remainingAmenitiesCount = roomTypeAmenities.length - amenitiesToShow.length;

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ my: 2, mx: "4px", display: "flex", flexWrap: "wrap" }}>
      {amenitiesToShow.map((amenity, index) => (
        <Box
          key={index}
          sx={{
            m: "3px",
            p: "5px 8px",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "14px",
            borderRadius: "100px",
            bgcolor: "#EDF2F7",
          }}
        >
          {amenity}
        </Box>
      ))}
      {remainingAmenitiesCount > 0 && (
        <div>
          <Typography
            aria-owns={open ? "popover-amenities" : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            sx={{
              width: "fit-content",
              cursor: "pointer",
              m: "6px 3px 3px 3px",
              p: "5px 8px",
              color: "#00B6F3",
              bgcolor: "rgba(0, 182, 243, 0.1)",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "14px",
              borderRadius: "100px",
            }}
          >
            {`${remainingAmenitiesCount} tiện ích`}
          </Typography>
          <Popover
            id="popover-amenities"
            sx={{ pointerEvents: "none" }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "left",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
            transitionDuration={600}
          >
            <Box
              sx={{
                p: 1,
                minWidth: "40vw",
                maxWidth: "50vw",
                // minHeight: "50vw",
                height: "auto",
                maxHeight: "80vw",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {roomTypeAmenities?.map((amenity) => (
                <Box
                  key={amenity.id}
                  sx={{
                    m: "3px",
                    p: "5px 8px",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "14px",
                    borderRadius: "100px",
                    bgcolor: "#EDF2F7",
                  }}
                >
                  {amenity.amenity}
                </Box>
              ))}
            </Box>
          </Popover>
        </div>
      )}
    </Box>
  );
};

export default RoomAmenitiesList;
