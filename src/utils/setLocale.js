import { LocaleConfig } from "react-native-calendars";
import translationCalendar from "./translationCalendar.json";

export const setLocale = () => {
  LocaleConfig.locales["fr"] = translationCalendar;
  LocaleConfig.defaultLocale = "fr";
};
