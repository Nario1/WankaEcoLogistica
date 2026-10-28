const LETTER = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";

function clearValidity(event) {
  event.currentTarget.setCustomValidity("");
}

function reject(title) {
  return (event) => event.currentTarget.setCustomValidity(title);
}

function blockUnless(expression) {
  const pattern = new RegExp(expression);
  return (event) => {
    if (event.data && !pattern.test(event.data)) event.preventDefault();
  };
}

function textInput({ pattern, characters, title, ...limits }) {
  return {
    ...limits,
    pattern,
    title,
    onBeforeInput: blockUnless(characters),
    onInvalid: reject(title),
    onInput: clearValidity,
  };
}

export const personNameInput = textInput({
  minLength: 3,
  maxLength: 120,
  characters: `^[${LETTER} '\\-]+$`,
  pattern: `^[${LETTER}]+(?:[ '\\-][${LETTER}]+)*$`,
  title: "Use solo letras, espacios y guiones",
});

export const emailInput = {
  maxLength: 255,
  pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
  title: "Escriba un correo válido, como maria@wanka.local",
  onInvalid: reject("Escriba un correo válido, como maria@wanka.local"),
  onInput: clearValidity,
};

export const passwordInput = {
  minLength: 12,
  maxLength: 128,
  pattern: `^(?=.*[${LETTER}])(?=.*\\d).{12,128}$`,
  title: "Use al menos 12 caracteres, con letras y números",
  onInvalid: reject("Use al menos 12 caracteres, con letras y números"),
  onInput: clearValidity,
};

export const loginPasswordInput = {
  minLength: 8,
  maxLength: 128,
  title: "La contraseña debe tener al menos 8 caracteres",
  onInvalid: reject("La contraseña debe tener al menos 8 caracteres"),
  onInput: clearValidity,
};

export const plateInput = textInput({
  minLength: 5,
  maxLength: 10,
  characters: "^[A-Za-z0-9-]+$",
  pattern: "^[A-Za-z0-9-]{5,10}$",
  title: "Use de 5 a 10 letras, números o guiones, sin espacios",
});

export const productInput = textInput({
  minLength: 2,
  maxLength: 160,
  characters: `^[${LETTER}0-9 .,'\\-]+$`,
  pattern: `^[${LETTER}0-9][${LETTER}0-9 .,'\\-]{1,159}$`,
  title: "Use letras y números. Ejemplo: 4 cajas de limpieza",
});

export const addressInput = textInput({
  minLength: 5,
  maxLength: 255,
  characters: `^[${LETTER}0-9 .,#°'/\\-]+$`,
  pattern: `^[${LETTER}0-9][${LETTER}0-9 .,#°'/\\-]{4,254}$`,
  title: "Use letras y números de la dirección. Ejemplo: Av. Ferrocarril 123",
});

export function numberInput({
  min,
  max,
  title,
  allowNegative = false,
  maxDecimals = 2,
}) {
  return {
    min,
    max,
    step: maxDecimals === 0 ? "1" : "any",
    title,
    inputMode: "decimal",
    onBeforeInput(event) {
      const data = event.data;
      if (data == null) return;
      const allowed = allowNegative ? /^[0-9.\-]+$/ : /^[0-9.]+$/;
      if (!allowed.test(data)) {
        event.preventDefault();
        return;
      }
      const input = event.currentTarget;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      const next = `${input.value.slice(0, start)}${data}${input.value.slice(end)}`;
      const decimals = next.split(".")[1];
      const tooManyDots = (next.match(/\./g) ?? []).length > 1;
      const minus = next.includes("-");
      const badMinus = minus && (!allowNegative || !next.startsWith("-") || next.indexOf("-") !== next.lastIndexOf("-"));
      const tooManyDecimals = Boolean(decimals && decimals.length > maxDecimals);
      const numeric = next === "" || next === "-" || next === "." || next === "-." ? null : Number(next);
      const aboveMax = numeric != null && max != null && numeric > max;
      const belowMin = numeric != null && !allowNegative && numeric < 0;
      if (
        tooManyDots ||
        badMinus ||
        tooManyDecimals ||
        aboveMax ||
        belowMin ||
        (numeric != null && !Number.isFinite(numeric))
      ) {
        event.preventDefault();
      }
    },
    onInvalid: reject(title),
    onInput: clearValidity,
  };
}
