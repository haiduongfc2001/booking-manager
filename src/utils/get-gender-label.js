import { GENDER } from "src/constant/constants";

export const getGenderLabel = (gender) => {
  switch (gender) {
    case GENDER.MALE:
      return "Nam";
    case GENDER.FEMALE:
      return "Nữ";
    default:
      return "Khác";
  }
};
