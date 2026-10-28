import { useState } from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Time12Field from "./Time12Field";

export default function DateTime12Field({ name, label, defaultValue = "" }) {
  const [date, setDate] = useState(defaultValue.slice(0, 10));
  const [time, setTime] = useState(defaultValue.slice(11, 16) || "08:00");
  const value = date ? `${date}T${time}` : "";

  return (
    <Stack spacing={1}>
      <input type="hidden" name={name} value={value} />
      <TextField
        label={`${label}: fecha`}
        type="date"
        required
        value={date}
        onChange={(event) => setDate(event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <Time12Field label={label} value={time} onChange={setTime} />
    </Stack>
  );
}

DateTime12Field.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};
