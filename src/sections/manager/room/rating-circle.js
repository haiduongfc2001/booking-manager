import React from "react";
import { styled } from "@mui/material/styles";
import { Avatar, Typography } from "@mui/material";

const CircleRating = styled(Avatar)(({ theme, rating }) => ({
  backgroundColor: getRatingColor(theme, rating),
  color: theme.palette.primary.contrastText,
  width: 50,
  height: 50,
  fontSize: 24,
  fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: `2px solid ${getBorderColor(theme, rating)}`,
  borderRadius: "50%",
}));

const getRatingColor = (theme, rating) => {
  if (rating === 0) {
    return theme.palette.grey[500];
  } else if (rating >= 1 && rating <= 5) {
    switch (Math.floor(rating)) {
      case 1:
        return theme.palette.error.main;
      case 2:
        return theme.palette.warning.main;
      case 3:
        return theme.palette.info.main;
      case 4:
        return theme.palette.success.main;
      case 5:
        return theme.palette.primary.main;
      default:
        return theme.palette.grey[500];
    }
  } else {
    return theme.palette.grey[500];
  }
};

const getBorderColor = (theme, rating) => {
  if (rating === 0) {
    return theme.palette.grey[500];
  } else {
    return getRatingColor(theme, rating);
  }
};

const RatingCircle = ({ rating }) => {
  return (
    <CircleRating rating={rating}>
      <Typography>{rating}</Typography>
    </CircleRating>
  );
};

export default RatingCircle;
