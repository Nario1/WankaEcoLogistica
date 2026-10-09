import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

function parseTime(value) {
  const [hours = 8, minutes = 0] = String(value || "08:00")
    .split(":")
    .map(Number);
  return {
    hour: hours % 12 || 12,
    minute: String(minutes).padStart(2, "0"),
    period: hours >= 12 ? "PM" : "AM",
  };
}

function toTime24(hour, minute, period) {
  const normalizedHour = (Number(hour) % 12) + (period === "PM" ? 12 : 0);
  return `${String(normalizedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function Time12Field({ label, value, onChange }) {
  const parsed = parseTime(value);
  const update = (part, nextValue) => {
    const next = { ...parsed, [part]: nextValue };
    onChange(toTime24(next.hour, next.minute, next.period));
  };

  return (
    <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
      <TextField
        select
        fullWidth
        label={`${label}: hora`}
        value={parsed.hour}
        onChange={(event) => update("hour", event.target.value)}
      >
        {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
          <MenuItem key={hour} value={hour}>
            {String(hour).padStart(2, "0")}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        label="Minutos"
        value={parsed.minute}
        onChange={(event) => update("minute", event.target.value)}
      >
        {Array.from({ length: 60 }, (_, minute) =>
          String(minute).padStart(2, "0"),
        ).map((minute) => (
          <MenuItem key={minute} value={minute}>
            {minute}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        label="Periodo"
        value={parsed.period}
        onChange={(event) => update("period", event.target.value)}
      >
        <MenuItem value="AM">AM</MenuItem>
        <MenuItem value="PM">PM</MenuItem>
      </TextField>
    </Stack>
  );
}

Time12Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
