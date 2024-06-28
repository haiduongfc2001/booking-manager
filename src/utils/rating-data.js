export const ratingData = (averageRatings) => {
  return [
    {
      id: 1,
      criteria: "Vị trí",
      rating: averageRatings?.location || 0,
    },
    {
      id: 2,
      criteria: "Giá cả",
      rating: averageRatings?.price || 0,
    },
    {
      id: 3,
      criteria: "Phục vụ",
      rating: averageRatings?.service || 0,
    },
    {
      id: 4,
      criteria: "Vệ sinh",
      rating: averageRatings?.cleanliness || 0,
    },
    {
      id: 5,
      criteria: "Tiện nghi",
      rating: averageRatings?.amenities || 0,
    },
  ];
};

export const ratingDataByReview = (averageRatings) => {
  return [
    {
      id: 1,
      criteria: "Vị trí",
      rating: averageRatings?.location_rating || 0,
    },
    {
      id: 2,
      criteria: "Giá cả",
      rating: averageRatings?.price_rating || 0,
    },
    {
      id: 3,
      criteria: "Phục vụ",
      rating: averageRatings?.service_rating || 0,
    },
    {
      id: 4,
      criteria: "Vệ sinh",
      rating: averageRatings?.cleanliness_rating || 0,
    },
    {
      id: 5,
      criteria: "Tiện nghi",
      rating: averageRatings?.amenities_rating || 0,
    },
  ];
};
