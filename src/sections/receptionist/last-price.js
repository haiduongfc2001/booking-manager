import { Box, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomizedTooltip from "src/theme/tooltip";
import FormatCurrency from "src/utils/format-currency";

const LastPrice = ({ checkIn, numRooms, numNights, roomCost, serviceCharge }) => {
  const startDate = new Date(checkIn);

  const { room_price_per_night, total_room_price, total_service_fee, total_tax, final_price } =
    roomCost;

  return (
    <>
      <CustomizedTooltip
        title={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: 340,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
              }}
            >
              <Typography>
                Giá cho {numNights} đêm x {numRooms} phòng
              </Typography>
              <Typography>{FormatCurrency(total_room_price)}</Typography>
            </Box>

            <Box
              sx={{
                width: "100%",
                bgcolor: "primary.light",
                color: "black",
                mx: 2,
                px: 2,
                py: 1,
                borderRadius: 1,
              }}
            >
              {Array.from({ length: numNights }, (_, index) => {
                const currentDate = new Date(startDate);
                currentDate.setDate(currentDate.getDate() + index);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;

                return (
                  <Box
                    key={index}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      Đêm {index + 1} ({day}/{month}) x {numRooms} phòng
                    </Typography>
                    <Typography>{FormatCurrency(room_price_per_night)}</Typography>
                  </Box>
                );
              })}
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
              }}
            >
              <Typography>Thuế và phí dịch vụ khách sạn</Typography>
              <Typography>{FormatCurrency(total_service_fee + total_tax)}</Typography>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                pt: 2,
                borderTop: "2px solid gray",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="h6">Tổng tiền thanh toán</Typography>
                <Typography variant="subtitle2">Đã bao gồm thuế, phí, VAT</Typography>
                <Typography variant="subtitle2">
                  Giá cho {numNights} đêm, {numRooms} phòng
                </Typography>
              </Box>
              <Typography>{FormatCurrency(final_price)}</Typography>
            </Box>
          </Box>
        }
        content={
          <Box
            sx={{
              color: "#4A5568",
              display: "flex",
              transition: "all 0.3s",
              alignItems: "flex-end",
              flexDirection: "column",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Typography variant="subtitle2">
                Giá cuối cùng {FormatCurrency(final_price)}&nbsp;
              </Typography>
              <InfoOutlinedIcon />
            </Box>
            <Box
              component="span"
              sx={{
                display: "flex",
                fontSize: "12px",
                mt: "2px",
                lineHeight: "14px",
                mr: "20px",
                justifyContent: "flex-end",
              }}
            >
              cho {numRooms} phòng {numNights} đêm
            </Box>
          </Box>
        }
      />
    </>
  );
};

export default LastPrice;
