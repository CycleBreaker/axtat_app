import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

export default function Logo() {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ mr: "1", width: 24, height: 24 }}>
        <AutoGraphIcon
          sx={{ fontSize: 36, display: "fixed", transform: "translateY(-3px)" }}
        />
      </Box>
      <Box sx={{ pl: 2, pr: 1 }}>
        <Typography variant="h6">Axtat</Typography>
      </Box>
    </Box>
  );
}
