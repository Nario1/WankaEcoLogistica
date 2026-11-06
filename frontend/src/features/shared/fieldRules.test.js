import { describe, expect, it, vi } from "vitest";
import {
  addressInput,
  emailInput,
  numberInput,
  personNameInput,
  plateInput,
  productInput,
} from "./fieldRules.js";

function eventWith(data, value = "", selectionStart = value.length) {
  return {
    data,
    currentTarget: {
      value,
      selectionStart,
      selectionEnd: selectionStart,
      setCustomValidity: vi.fn(),
    },
    preventDefault: vi.fn(),
  };
}

describe("fieldRules", () => {
  it("define patrones de texto para nombre, placa, producto y dirección", () => {
    expect(personNameInput.pattern).toContain("ÁÉÍÓÚ");
    expect(plateInput.minLength).toBe(5);
    expect(productInput.title).toMatch(/letras y números/i);
    expect(addressInput.minLength).toBe(5);
    expect(emailInput.pattern).toContain("@");
  });

  it("bloquea caracteres no permitidos en el nombre", () => {
    const event = eventWith("9");
    personNameInput.onBeforeInput(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("bloquea un número por encima del máximo", () => {
    const capacity = numberInput({
      min: 0.01,
      max: 100000,
      title: "Capacidad inválida",
    });
    const event = eventWith("2", "99999");
    capacity.onBeforeInput(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("permite coordenadas negativas", () => {
    const latitude = numberInput({
      min: -90,
      max: 90,
      title: "Latitud inválida",
      allowNegative: true,
      maxDecimals: 6,
    });
    const event = eventWith("-", "");
    latitude.onBeforeInput(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("limpia la validez al escribir", () => {
    const event = eventWith(null);
    personNameInput.onInput(event);
    expect(event.currentTarget.setCustomValidity).toHaveBeenCalledWith("");
  });
});
