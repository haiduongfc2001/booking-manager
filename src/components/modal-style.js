export const ModalStyle = ({ width, maxWidth, maxHeight }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: `${width}%`,
  maxWidth: `${maxWidth}%`,
  maxHeight: `${maxHeight}%`,
  overflowY: "auto",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
});
