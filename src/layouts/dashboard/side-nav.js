import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronUpDownIcon from "@heroicons/react/24/solid/ChevronUpDownIcon";
import { Box, Divider, Drawer, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scroll-bar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks/use-auth";
import { useDispatch, useSelector } from "react-redux";
import Storage from "src/utils/Storage";
import { logout } from "src/redux/create-actions/auth-action";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const dispatch = useDispatch();

  const role = useSelector((state) => state.auth.role);
  const filteredItems = items.filter((item) => item.roles.includes(role));

  const handleSignOut = () => {
    Storage.removeAccessToken();
    auth.signOut();
    dispatch(logout());
    router.push("/auth/login");
  };

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: "inline-flex",
              height: 32,
              width: 32,
            }}
          >
            <Logo />
          </Box>
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderRadius: 1,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              p: "12px",
            }}
          >
            <div>
              <Typography color="inherit" variant="subtitle1">
                Booking Website
              </Typography>
              <Typography color="neutral.400" variant="body2">
                DHD
              </Typography>
            </div>
            <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
              <ChevronUpDownIcon />
            </SvgIcon>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {filteredItems?.map((item) => {
              const active = item.path ? pathname === item.path : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          sx={{
            px: 2,
            py: 3,
            listStyle: "none",
          }}
          onClick={handleSignOut}
        >
          <SideNavItem
            icon={
              <SvgIcon fontSize="small">
                <LogoutIcon />
              </SvgIcon>
            }
            title="Đăng xuất"
          />
        </Box>
      </Box>
    </Scrollbar>
  );

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      variant={lgUp ? "persistent" : "temporary"}
      ModalProps={{ keepMounted: true }}
      sx={lgUp ? undefined : { zIndex: (theme) => theme.zIndex.appBar + 100 }}
      color="inherit"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
