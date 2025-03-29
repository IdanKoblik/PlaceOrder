import i18next from "i18next";
import Backend from "i18next-fs-backend";
// TODO support
i18next
  .use(Backend)
  .init({
    lng: "en",
    fallbackLng: "en",
    backend: {
      loadPath: "./src/locales/{{lng}}.json"
    }
  });

export default i18next;
